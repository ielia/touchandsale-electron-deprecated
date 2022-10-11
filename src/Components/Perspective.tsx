import Color from 'color';
import React, {Component, ReactElement, ReactNode, RefObject, createRef} from 'react';

import './_Perspective.scss';

import {getCompassOctoHeadingClassName, getCompassOctoHeadingComponents, getOppositeCompassHeading, listToDictionary, manhattanDistanceToRectangle} from '../commons';
import BaseMenu from './Menu';
import BaseMenuSection from './MenuSection';
import {default as BaseMinimizedViewContainer, MinimizedViewContainerPropsType} from './MinimizedViewContainer';
import BasePerspectiveSelector from './PerspectiveSelector';
import BaseResizableContainer from './ResizableContainer';
import BaseSimpleMenuSection from './SimpleMenuSection';
import BaseTabbedViewContainer from './TabbedViewContainer';
import BaseView from './View';
import BaseViewSetLayout from './ViewSetLayout';
import getBrandedComponent from './branding';
const Menu = getBrandedComponent<InstanceType<typeof BaseMenu>>('Menu') as typeof BaseMenu;
const MinimizedViewContainer = getBrandedComponent<InstanceType<typeof BaseMinimizedViewContainer>>('MinimizedViewContainer') as typeof BaseMinimizedViewContainer;
const PerspectiveSelector = getBrandedComponent<InstanceType<typeof BasePerspectiveSelector>>('PerspectiveSelector') as typeof BasePerspectiveSelector;
const ResizableContainer = getBrandedComponent<InstanceType<typeof BaseResizableContainer>>('ResizableContainer') as typeof BaseResizableContainer;
const SimpleMenuSection = getBrandedComponent<InstanceType<typeof BaseSimpleMenuSection>>('SimpleMenuSection') as typeof BaseSimpleMenuSection;
const TabbedViewContainer = getBrandedComponent<InstanceType<typeof BaseTabbedViewContainer>>('TabbedViewContainer') as typeof BaseTabbedViewContainer;
const ViewSetLayout = getBrandedComponent<InstanceType<typeof BaseViewSetLayout>>('ViewSetLayout') as typeof BaseViewSetLayout;

/**
 * Menu snap margin in pixels.
 */
const MENU_SNAP_MARGIN = 5;
type SimpleMenuSectionPropsType = 'options-menu';
type MenuSectionType = SimpleMenuSectionPropsType | MinimizedViewContainerPropsType;
const SIMPLE_MENU_SECTION_TYPE: SimpleMenuSectionPropsType = 'options-menu';
type MenuSectionTypeAndId = `${MenuSectionType}:${string}`;

export interface Props<V extends BaseView = BaseView> {
    accentColor: Color;
    children: ReactElement<V> | ReactElement<V>[];
    className: string;
    floatingGroup?: string | null;
    label: string;
    layout: LayoutSpec;
    maximizedGroup?: string | null;
    menuSections: {menuId: string, sectionId: string, content: ReactElement<Component>[]}[];
    minimizedGroups: MinimizedGroups;
    shortcutKey: string;
}

export interface State {
    dragging: {menuId?: string, sectionId: string, type: MenuSectionType} | null;
    floatingGroup: string;
    layout: LayoutSpec;
    maximizedGroup: string;
    menuSectionsByTypeAndId: {[key: MenuSectionTypeAndId]: {element: ReactElement<InstanceType<typeof BaseMenuSection>>, sectionId: string, type: MenuSectionType}};
    menuSectionsByLocation: {[key: string]: {sectionId: string, type: MenuSectionType}[]};
    minimizedGroups: MinimizedGroups;
}

export default class Perspective<V extends BaseView = BaseView> extends Component<Props<V>, State> {
    layoutContainerRef: RefObject<HTMLDivElement>;
    menus: {[menuId: string]: {ref: RefObject<HTMLElement>}};
    minimizedFloaterRef: RefObject<HTMLElement>;

    constructor(props: Props<V>) {
        super(props);

        this.buildMinimizedGroups = this.buildMinimizedGroups.bind(this);
        this.handleClosingFloatingGroup = this.handleClosingFloatingGroup.bind(this);
        this.handleContainerMaximization = this.handleContainerMaximization.bind(this);
        this.handleContainerMinimization = this.handleContainerMinimization.bind(this);
        this.handleContainerRestoration = this.handleContainerRestoration.bind(this);
        this.handleLayoutDivisionChange = this.handleLayoutDivisionChange.bind(this);
        this.handleMenuDragEnter = this.handleMenuDragEnter.bind(this);
        this.handleMenuDragLeave = this.handleMenuDragLeave.bind(this);
        this.handleMenuDragOver = this.handleMenuDragOver.bind(this);
        this.handleMenuDropInSection = this.handleMenuDropInSection.bind(this);
        this.handleMenuSectionDrag = this.handleMenuSectionDrag.bind(this);
        this.handleMenuSectionDragEnd = this.handleMenuSectionDragEnd.bind(this);
        this.handleMenuSectionDragStart = this.handleMenuSectionDragStart.bind(this);
        this.handleMinimizedViewSelection = this.handleMinimizedViewSelection.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
        this.layoutContainerRef = createRef();
        this.menus = {bottom: {ref: createRef()}, left: {ref: createRef()}, right: {ref: createRef()}, top: {ref: createRef()}};
        this.minimizedFloaterRef = createRef();

        const {floatingGroup, layout, maximizedGroup, menuSections, minimizedGroups} = this.props;
        const menuSectionsByTypeAndId = menuSections.reduce((acc, {sectionId, content}) => {
            acc[`${SIMPLE_MENU_SECTION_TYPE}:${sectionId}`] = {
                element: (
                    <SimpleMenuSection key={sectionId} sectionId={sectionId} type={SIMPLE_MENU_SECTION_TYPE} onDrag={this.handleMenuSectionDrag}
                                       onDragEnd={this.handleMenuSectionDragEnd} onDragStart={this.handleMenuSectionDragStart}>
                        {content}
                    </SimpleMenuSection>
                ),
                sectionId,
                type: 'options-menu',
            };
            return acc;
        }, {} as {[key: MenuSectionTypeAndId]: {element: ReactElement<InstanceType<typeof BaseMenuSection>>, sectionId: string, type: MenuSectionType}});
        this.state = {
            dragging: null,
            floatingGroup: floatingGroup ?? null,
            layout,
            maximizedGroup: maximizedGroup ?? null,
            menuSectionsByTypeAndId,
            menuSectionsByLocation: menuSections.reduce((acc: {[key: string]: {sectionId: string, type: MenuSectionType}[]}, {menuId, sectionId}) => {
                acc[menuId].push({sectionId, type: menuSectionsByTypeAndId[`${SIMPLE_MENU_SECTION_TYPE}:${sectionId}`].type});
                return acc;
            }, {bottom: [], left: [], right: [], top: []}), // TODO: See if we can generalise these.
            minimizedGroups,
        };
    }

    protected buildMinimizedGroups(maximizedContext: boolean, minimizedGroupList: MinimizedGroupSpec[], layout: LayoutSpec,
                                   views: { [viewId: string]: ReactElement<BaseView> & ReactNode }
    ): ReactElement<BaseMinimizedViewContainer>[] {
        let result = [];
        if (minimizedGroupList) {
            const minimizedGroupsById = listToDictionary(group => group.containerId, minimizedGroupList);
            const groups = this.findGroups(layout, ...Object.keys(minimizedGroupsById));
            result = groups.reduce((acc, group) => {
                const state = group.state;
                if (maximizedContext ? state !== 'maximized' : state === 'minimized') {
                    const {children, groupId, selected} = group;
                    const wrapperRefAttr = minimizedGroupsById[groupId].floating ? {wrapperRef: this.minimizedFloaterRef} : {};
                    acc.push(
                        <MinimizedViewContainer key={groupId} sectionId={groupId} selectedView={selected}
                                                {...wrapperRefAttr}
                                                onDrag={this.handleMenuSectionDrag} onDragEnd={this.handleMenuSectionDragEnd} onDragStart={this.handleMenuSectionDragStart}
                                                onRestore={this.handleContainerRestoration} onViewSelected={this.handleMinimizedViewSelection}>
                            {children.map(viewId => views[viewId])}
                        </MinimizedViewContainer>
                    );
                }
                return acc;
            }, []);
        }
        return result;
    }

    protected findClosestMenuToPoint(x: number, y: number): {manhattanDistance: number, menuId: string, menu: {ref: RefObject<HTMLElement>}}
    {
        // console.log('Perspective.findClosestMatchingMenuToPoint x:', x, '| y:', y);
        const match = Object.entries(this.menus).reduce((match: {manhattanDistance: number, menuId: string, menu: {ref: RefObject<HTMLElement>}}, [menuId, menu]) => {
            let result = match;
            if (!match || match.manhattanDistance > 0) {
                const menuElement = menu.ref.current;
                if (menuElement) {
                    const rect = {height: menuElement.offsetHeight, left: menuElement.offsetLeft, top: menuElement.offsetTop, width: menuElement.offsetWidth};
                    const manhattanDistance = manhattanDistanceToRectangle(rect, {x, y});
                    if (!match || match.manhattanDistance > manhattanDistance) {
                        result = {manhattanDistance, menuId, menu};
                    }
                }
            }
            return result;
        }, null);
        return Number.isFinite(match.manhattanDistance) && match.manhattanDistance < MENU_SNAP_MARGIN
            ? match
            : null;
    }

    protected findGroups(layout: LayoutSpec, ...groupIds: string[]): LeafLayoutSpec[] {
        return 'orientation' in layout
            ? layout.children.flatMap(subLayout => this.findGroups(subLayout, ...groupIds))
            : groupIds.indexOf(layout.groupId) >= 0
                ? [layout]
                : [];
    }

    protected findMinimizedGroups(minimizedGroups: MinimizedGroups, ...groupIds: string[]): MinimizedGroupSpec[] {
        return Object.values(minimizedGroups).reduce((acc, minimizedGroupSpecs) =>
                acc.concat(minimizedGroupSpecs.filter(spec => groupIds.indexOf(spec.containerId) >= 0)),
            []);
    }

    protected getClosestCornerSpec(x: number, y: number, container: Element): { bottom?: 0, left?: 0, right?: 0, top?: 0, resizableEdges: CompassHeading[] } {
        const {bottom, left, right, top} = container.getBoundingClientRect();
        const horizontalSpec: ['left' | 'right', CompassHeading] = Math.abs(x - right) < Math.abs(x - left) ? ['right', 'w'] : ['left', 'e'];
        const verticalSpec: ['bottom' | 'top', CompassHeading] = Math.abs(y - bottom) < Math.abs(y - top) ? ['bottom', 's'] : ['top', 'n'];
        return {[horizontalSpec[0]]: 0, [verticalSpec[0]]: 0, resizableEdges: [horizontalSpec[1], verticalSpec[1]]};
    }

    protected handleClosingFloatingGroup(containerId: string, event: FocusEvent): void {
        // This method will always result in a new state, since having floatingGroup with any other value than the non-null containerId would be a bug,
        // and the resulting state will have floatingGroup set to null.
        if (!event.relatedTarget || !this.minimizedFloaterRef.current || !this.minimizedFloaterRef.current.contains(event.relatedTarget as Node)) {
            this.setState(({floatingGroup, minimizedGroups, ...others}) => {
                let newMinimizedGroups = minimizedGroups;
                // If they don't match, then it wasn't open... For some weird reason.
                // Consider changing if we start allowing multiple floating tabbed containers.
                if (floatingGroup === containerId) {
                    newMinimizedGroups = this.updateMinimizedGroupAttribute(newMinimizedGroups, containerId, 'floating', false);
                } else {
                    console.error('Closing a minimized group that was not the floating one (', floatingGroup, '):', containerId);
                }
                return {
                    floatingGroup: null,
                    minimizedGroups: newMinimizedGroups,
                    ...others,
                };
            });
        }
    }

    protected handleContainerMaximization(containerId: string): void {
        this.setState(currentState => {
            const {floatingGroup, layout, maximizedGroup, minimizedGroups, ...others} = currentState;
            let newLayout = layout;
            if (containerId === maximizedGroup) {
                console.error('Maximizing the already maximized container:', containerId);
            } else if (maximizedGroup) {
                newLayout = this.updateGroupAttribute(newLayout, maximizedGroup, 'state', 'normal');
            }
            newLayout = this.updateGroupAttribute(newLayout, containerId, 'state', 'maximized');
            const newMinimizedGroups = floatingGroup
                ? this.updateMinimizedGroupAttribute(minimizedGroups, floatingGroup, 'floating', false)
                : minimizedGroups;
            return !floatingGroup && newLayout === layout && containerId === maximizedGroup && newMinimizedGroups === minimizedGroups
                ? currentState
                : {
                    floatingGroup: null,
                    layout: newLayout,
                    maximizedGroup: containerId,
                    minimizedGroups: newMinimizedGroups,
                    ...others,
                };
        });
    }

    protected handleContainerMinimization(containerId: string): void {
        this.setState(currentState => {
            const {floatingGroup, layout, maximizedGroup, minimizedGroups, ...others} = currentState;
            const newFloatingGroup = floatingGroup === containerId ? null : floatingGroup;
            const newLayout = this.updateGroupAttribute(layout, containerId, 'state', 'minimized');
            const newMaximizedGroup = maximizedGroup === containerId ? null : maximizedGroup;
            const newMinimizedGroups = floatingGroup
                ? this.updateMinimizedGroupAttribute(minimizedGroups, floatingGroup, 'floating', false)
                : minimizedGroups;
            return newFloatingGroup === floatingGroup && newLayout === layout && newMaximizedGroup === maximizedGroup && newMinimizedGroups === minimizedGroups
                ? currentState
                : {
                    floatingGroup: newFloatingGroup,
                    layout: newLayout,
                    maximizedGroup: newMaximizedGroup,
                    minimizedGroups: newMinimizedGroups,
                    ...others,
                };
        });
    }

    protected handleContainerRestoration(containerId: string): void {
        this.setState(currentState => {
            const {floatingGroup, layout, maximizedGroup, ...others} = currentState;
            const newFloatingGroup = containerId === floatingGroup ? null : floatingGroup;
            let newLayout = this.updateGroupAttribute(layout, containerId, 'state', 'normal');
            if (containerId !== maximizedGroup) {
                newLayout = this.updateGroupAttribute(newLayout, maximizedGroup, 'state', 'normal');
            }
            if (newLayout === layout) {
                console.error('Restored a container that was in normal state:', containerId);
            }
            return newFloatingGroup === floatingGroup && newLayout === layout && !maximizedGroup
                ? currentState
                : {
                    floatingGroup: newFloatingGroup,
                    layout: newLayout,
                    maximizedGroup: null,
                    ...others
                };
        });
    }

    protected handleFloatingGroupResize(containerId: string, height: number, width: number): void {
        this.setState(currentState => {
            const {floatingGroup, minimizedGroups, ...others} = currentState;
            let newMinimizedGroups = minimizedGroups;
            // If they don't match, then I don't know what we are resizing...
            // Consider changing if we start allowing multiple floating tabbed containers.
            if (floatingGroup === containerId) {
                // TODO: Create a method to change multiple attributes in one go.
                newMinimizedGroups = this.updateMinimizedGroupAttribute(newMinimizedGroups, containerId, 'height', height);
                newMinimizedGroups = this.updateMinimizedGroupAttribute(newMinimizedGroups, containerId, 'width', width);
            } else {
                console.error('Resizing a non-floating group:', containerId);
            }
            return minimizedGroups === newMinimizedGroups
                ? currentState
                : {
                    floatingGroup,
                    minimizedGroups: newMinimizedGroups,
                    ...others,
                };
        });
    }

    protected handleLayoutDivisionChange(pathToStart: string, startRatio: number, endRatio: number): void {
        // Will not compare for weights equality to prevent a re-render, for it should seldomly be the same.
        this.setState(({layout, ...others}) => ({layout: this.updateWeights(layout, pathToStart, startRatio, endRatio), ...others}));
    }

    protected handleMenuDragEnter(type: string, menuId: string): void {
        console.log('Perspective.handleMenuDragEnter MENUID:', menuId);
    }

    protected handleMenuDragLeave(type: string, menuId: string): void {
        console.log('Perspective.handleMenuDragLeave MENUID:', menuId);
    }

    protected handleMenuDragOver(type: string, menuId: string, x: number, y: number): void {
        console.log(`Perspective.handleMenuDragOver MENUID: "${menuId}", x: ${x}, y: ${y}`);
    }

    protected handleMenuDropInSection(type: string, menuId: string, containedSections: string): void {
        console.log(`Perspective.handleMenuDropInSection MENUID: "${menuId}", ${containedSections}`);
    }

    protected handleMenuSectionDrag(type: MenuSectionType, sectionId: string, x: number, y: number, elementRectangle: {bottom: number, left: number, right: number, top: number}): void {
        // console.log('Perspective.handleMenuSectionDrag SECTIONID:', sectionId, '| TYPE:', type, '| x:', x, '| y:', y);
        const match = this.findClosestMenuToPoint(x, y);
        // TODO: Remove most of the following if we can trust on DragStart.
        if (match && (!this.state.dragging || (this.state.dragging && this.state.dragging.menuId !== match.menuId))) {
            this.setState(({dragging, ...restOfState}) => ({dragging: {menuId: match.menuId, sectionId, type}, ...restOfState}));
        } else if (!match && (!this.state.dragging || (this.state.dragging && this.state.dragging.menuId))) {
            this.setState(({dragging, ...restOfState}) => ({dragging: {sectionId, type}, ...restOfState}));
        }
        // console.log('MATCH:', match);
    }

    protected handleMenuSectionDragEnd(type: string, sectionId: string): void {
        console.log('Perspective.handleMenuSectionDragEnd SECTIONID:', sectionId, '| TYPE:', type);
        this.setState(({dragging, ...restOfState}) => ({dragging: null, ...restOfState}));
    }

    protected handleMenuSectionDragStart(type: MenuSectionType, sectionId: string): void {
        console.log('Perspective.handleMenuSectionDragStart SECTIONID:', sectionId, '| TYPE:', type);
        this.setState(({dragging, ...restOfState}) => ({dragging: {sectionId, type}, ...restOfState}));
    }

    protected handleMinimizedViewSelection(containerId: string, viewId: string): void {
        this.setState(currentState => {
            const {floatingGroup, layout, minimizedGroups, ...others} = currentState;
            const newLayout = this.updateGroupAttribute(layout, containerId, 'selected', viewId);
            let newMinimizedGroups = minimizedGroups;
            if (floatingGroup !== containerId) {
                if (floatingGroup) {
                    newMinimizedGroups = this.updateMinimizedGroupAttribute(newMinimizedGroups, floatingGroup, 'floating', false);
                }
                newMinimizedGroups = this.updateMinimizedGroupAttribute(newMinimizedGroups, containerId, 'floating', true);
            }
            return containerId === floatingGroup && newLayout === layout && newMinimizedGroups === minimizedGroups
                ? currentState
                : {
                    floatingGroup: containerId,
                    layout: newLayout,
                    minimizedGroups: newMinimizedGroups,
                    ...others,
                };
        });
    }

    protected handleViewSelection(containerId: string, viewId: string): void {
        this.setState(currentState => {
            const {layout, ...others} = currentState;
            const newLayout = this.updateGroupAttribute(layout, containerId, 'selected', viewId);
            return layout === newLayout ? currentState : {layout: newLayout, ...others};
        });
    }

    protected updateAttributeOnAllMinimizedGroups<A extends keyof MinimizedGroupSpec, T extends MinimizedGroupSpec[A]>(minimizedGroups: MinimizedGroups, attribute: A, value: T
    ): MinimizedGroups {
        let changed = false;
        const newMinimizedGroups: MinimizedGroups = {};
        for (const menuId in minimizedGroups) {
            const groups = minimizedGroups[menuId as keyof MinimizedGroups];
            let newGroups = [];
            for (const group of groups) {
                if (group[attribute] === value) {
                    newGroups.push(group);
                } else {
                    newGroups.push({...group, [attribute]: value});
                    changed = true;
                }
            }
            newMinimizedGroups[menuId as keyof MinimizedGroups] = newGroups;
        }
        return changed ? newMinimizedGroups : minimizedGroups;
    }

    protected updateGroupAttribute<A extends keyof LeafLayoutSpec, T extends LeafLayoutSpec[A]>(layout: LayoutSpec, containerId: string, attribute: A, value: T): LayoutSpec {
        let result;
        if ('groupId' in layout) {
            const {groupId, ...other} = layout;
            const currentValue = layout[attribute];
            result = containerId === groupId && value !== currentValue ? {groupId, ...other, [attribute]: value} : layout;
        } else {
            const {children, ...other} = layout;
            let changed = false;
            const newChildren: LayoutSpec[] = [];
            for (const child of children) {
                const newChild = this.updateGroupAttribute(child, containerId, attribute, value);
                if (newChild !== child) {
                    changed = true;
                }
                newChildren.push(newChild);
            }
            result = changed ? {children: newChildren, ...other} : layout;
        }
        return result;
    }

    protected updateMinimizedGroupAttribute<A extends keyof MinimizedGroupSpec, T extends MinimizedGroupSpec[A]>(minimizedGroups: MinimizedGroups,
                                                                                                                 containerId: string, attribute: A, value: T
    ): MinimizedGroups {
        let changed = false;
        const newMinimizedGroups: MinimizedGroups = {};
        for (const menuId in minimizedGroups) {
            const groups = minimizedGroups[menuId as keyof MinimizedGroups];
            let newGroups = [];
            for (const group of groups) {
                if (group.containerId === containerId && group[attribute] !== value) {
                    newGroups.push({...group, [attribute]: value});
                    changed = true;
                } else {
                    newGroups.push(group);
                }
            }
            newMinimizedGroups[menuId as keyof MinimizedGroups] = newGroups;
        }
        return changed ? newMinimizedGroups : minimizedGroups;
    }

    protected updateWeights(layout: LayoutSpec, pathToStart: string, startRatio: number, endRatio: number): LayoutSpec {
        // Not trying to return the same object if ratios were already the same.
        let result;
        if ('orientation' in layout) {
            const {children: subLayout, ...other} = layout;
            const indexStr = pathToStart.match('^[hv](\\d+)')[1];
            const nextPathPointer = indexStr.length + 1;
            const index = parseInt(indexStr);
            const startLayout = subLayout[index];
            if (pathToStart.length > nextPathPointer) {
                result = {
                    children: [
                        ...subLayout.slice(0, index),
                        this.updateWeights(startLayout, pathToStart.substring(nextPathPointer), startRatio, endRatio),
                        ...subLayout.slice(index + 1),
                    ],
                    ...other,
                };
            } else {
                const endLayout = subLayout[index + 1];
                result = {
                    children: [
                        ...subLayout.slice(0, index),
                        {...startLayout, weight: startRatio},
                        {...endLayout, weight: endRatio},
                        ...subLayout.slice(index + 2),
                    ],
                    ...other,
                }
            }
        }
        return result;
    }

    render() {
        const {accentColor, children, className, label} = this.props;
        const {dragging, floatingGroup, layout, maximizedGroup, menuSectionsByTypeAndId, menuSectionsByLocation, minimizedGroups} = this.state;
        const draggingSection = dragging ? menuSectionsByTypeAndId[`${dragging.type}:${dragging.sectionId}`].element : null;
        const childArray = Array.isArray(children) ? children : [children];
        const views = childArray.reduce((acc: { [viewId: string]: ReactElement<BaseView> & ReactNode }, view) => {
            acc[view.props.viewId] = view;
            return acc;
        }, {});
        let floatingGroupSpatialAttrs: { bottom?: number, height: number, left?: number, resizableEdges: CompassHeading[], right?: number, top?: number, width: number } = null;
        if (floatingGroup) {
            const floatingGroupSpec = this.findMinimizedGroups(minimizedGroups, floatingGroup)[0];
            floatingGroupSpatialAttrs = getCompassOctoHeadingComponents(floatingGroupSpec.corner).reduce(
                (acc: { bottom?: number, height: number, left?: number, resizableEdges: CompassHeading[], right?: number, top?: number, width: number }, side) => {
                    acc[getCompassOctoHeadingClassName(side) as 'bottom' | 'left' | 'right' | 'top'] = 0;
                    acc.resizableEdges.push(getOppositeCompassHeading(side));
                    return acc;
                },
                {
                    height: floatingGroupSpec.height,
                    width: floatingGroupSpec.width,
                    resizableEdges: [],
                }
            );
        }
        return (
            <div className={`perspective ${className}`}>
                <Menu menuId="top" draggingSection={dragging && dragging.menuId === 'top' ? draggingSection : null} wrapperRef={this.menus.top.ref}>
                    {[
                        <SimpleMenuSection key="perspective-selector" sectionId="perspective-selector" type="perspective-selector" draggable={false}
                                           onDrag={this.handleMenuSectionDrag} onDragEnd={this.handleMenuSectionDragEnd} onDragStart={this.handleMenuSectionDragStart}>
                            <PerspectiveSelector accentColor={accentColor} label={label}/>
                        </SimpleMenuSection>,
                        ...menuSectionsByLocation['top'].map(({sectionId, type}) => menuSectionsByTypeAndId[`${type}:${sectionId}`].element),
                    ]}
                </Menu>
                <div className="body">
                    <Menu menuId="left" orientation="vertical" draggingSection={dragging && dragging.menuId === 'left' ? draggingSection : null} wrapperRef={this.menus.left.ref}>
                        {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroups.left, layout, views)}
                    </Menu>
                    <div className="perspective-layout-container" ref={this.layoutContainerRef}>
                        <ViewSetLayout layout={layout} shownState={maximizedGroup ? 'maximized' : 'normal'} onLayoutDivisionChange={this.handleLayoutDivisionChange}
                                       onMaximizeContainer={this.handleContainerMaximization} onMinimizeContainer={this.handleContainerMinimization}
                                       onRestoreContainer={this.handleContainerRestoration} onViewSelected={this.handleViewSelection}>
                            {childArray}
                        </ViewSetLayout>
                        {floatingGroup &&
                            <ResizableContainer key={floatingGroup} {...floatingGroupSpatialAttrs} initiallyTryResizeToFit={true}
                                                  onFocusOut={this.handleClosingFloatingGroup.bind(this, floatingGroup)}
                                                  onResizeEnd={this.handleFloatingGroupResize.bind(this, floatingGroup)}
                            >
                                {this.findGroups(layout, floatingGroup).map(group => (
                                    <TabbedViewContainer key={group.groupId} containerId={group.groupId} focused={true} selectedViewId={group.selected} state="floating"
                                                         onMaximize={this.handleContainerMaximization} onMinimize={this.handleContainerMinimization}
                                                         onRestore={this.handleContainerRestoration} onViewSelected={this.handleMinimizedViewSelection}
                                    >
                                        {group.children.map(viewId => views[viewId])}
                                    </TabbedViewContainer>
                                ))}
                            </ResizableContainer>
                        }
                    </div>
                    <Menu menuId="right" orientation="vertical" draggingSection={dragging && dragging.menuId === 'right' ? draggingSection : null}
                          wrapperRef={this.menus.right.ref}>
                        {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroups.right, layout, views)}
                    </Menu>
                </div>
                <Menu menuId="bottom" draggingSection={dragging && dragging.menuId === 'bottom' ? draggingSection : null} wrapperRef={this.menus.bottom.ref}>
                </Menu>
            </div>
        );
    }
};
