import Color from 'color';
import React, {PureComponent, ReactElement, ReactNode, RefObject, createRef} from 'react';

import './_Perspective.scss';

import '../commons';
import Menu from './Menu';
import MenuSection from './MenuSection';
import MinimizedViewContainer from './MinimizedViewContainer';
import PerspectiveSelector from './PerspectiveSelector';
import ResizableContainer from './ResizableContainer';
import TabbedViewContainer from './TabbedViewContainer';
import View from './View';
import ViewSetLayout from './ViewSetLayout';

interface Props {
    accentColor: Color;
    children: ReactElement<View> | ReactElement<View>[],
    className: string;
    floatingGroup?: string | null;
    label: string;
    layout: LayoutSpec;
    maximizedGroup?: string | null;
    menuSections: ReactElement<MenuSection>[];
    minimizedGroups: MinimizedGroups;
    shortcutKey: string;
}

interface State {
    floatingGroup: string;
    layout: LayoutSpec;
    maximizedGroup: string;
    minimizedGroups: MinimizedGroups;
}

export default class Perspective extends PureComponent<Props, State> {
    layoutContainerRef: RefObject<HTMLDivElement>;
    minimizedFloaterRef: RefObject<HTMLElement>;

    constructor(props: Props) {
        super(props);

        this.buildMinimizedGroups = this.buildMinimizedGroups.bind(this);
        this.handleClosingFloatingGroup = this.handleClosingFloatingGroup.bind(this);
        this.handleContainerMaximization = this.handleContainerMaximization.bind(this);
        this.handleContainerMinimization = this.handleContainerMinimization.bind(this);
        this.handleContainerRestoration = this.handleContainerRestoration.bind(this);
        this.handleLayoutDivisionChange = this.handleLayoutDivisionChange.bind(this);
        this.handleMinimizedViewSelection = this.handleMinimizedViewSelection.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
        this.layoutContainerRef = createRef();
        this.minimizedFloaterRef = createRef();

        const {floatingGroup, layout, maximizedGroup, minimizedGroups} = this.props;
        this.state = {
            floatingGroup: floatingGroup ?? null,
            layout,
            maximizedGroup: maximizedGroup ?? null,
            minimizedGroups,
        };
    }

    protected buildMinimizedGroups(maximizedContext: boolean, minimizedGroupList: MinimizedGroupSpec[], layout: LayoutSpec,
                                   views: { [viewId: string]: ReactElement<View> & ReactNode }
    ): MinimizedViewContainer[] {
        const minimizedGroupsById = minimizedGroupList.reduce((acc: { [key: string]: MinimizedGroupSpec }, group) => {
            acc[group.containerId] = group;
            return acc;
        }, {});
        const groups = this.findGroups(layout, ...Object.keys(minimizedGroupsById));
        return groups.reduce((acc, group) => {
            const state = group.state;
            if (maximizedContext ? state !== 'maximized' : state === 'minimized') {
                const {children, groupId, selected} = group;
                const wrapperRefAttr = minimizedGroupsById[groupId].floating ? {wrapperRef: this.minimizedFloaterRef} : {};
                acc.push(
                    <MinimizedViewContainer key={groupId} containerId={groupId} selectedView={selected} onRestore={this.handleContainerRestoration}
                                            onViewSelected={this.handleMinimizedViewSelection} {...wrapperRefAttr}>
                        {children.map(viewId => views[viewId])}
                    </MinimizedViewContainer>
                );
            }
            return acc;
        }, []);
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
            let newLayout = this.updateGroupAttribute(layout, containerId, 'state', 'normal');
            if (containerId !== maximizedGroup) {
                newLayout = this.updateGroupAttribute(newLayout, maximizedGroup, 'state', 'normal');
            }
            if (newLayout === layout) {
                console.error('Restored a container that was in normal state:', containerId);
            }
            return !floatingGroup && newLayout === layout && !maximizedGroup
                ? currentState
                : {
                    floatingGroup: null,
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
        const {accentColor, children, className, label, menuSections} = this.props;
        const {floatingGroup, layout, maximizedGroup, minimizedGroups} = this.state;
        const childArray = Array.isArray(children) ? children : [children];
        const views = childArray.reduce((acc: { [viewId: string]: ReactElement<View> & ReactNode }, view) => {
            acc[view.props.viewId] = view;
            return acc;
        }, {});
        const floatingGroupSpec = floatingGroup ? this.findMinimizedGroups(minimizedGroups, floatingGroup)[0] : null;
        return (
            <div className={`perspective ${className}`}>
                <Menu>
                    <MenuSection>
                        <PerspectiveSelector accentColor={accentColor} label={label}/>
                    </MenuSection>
                    {menuSections}
                    <MenuSection>
                        <div className="TnS-about"/>
                        <div className="zWeb-link"/>
                    </MenuSection>
                </Menu>
                <div className="body">
                    <Menu orientation="vertical">
                        {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroups.left, layout, views)}
                    </Menu>
                    <div className="perspective-layout-container" ref={this.layoutContainerRef}>
                        <ViewSetLayout layout={layout} shownState={maximizedGroup ? 'maximized' : 'normal'} onLayoutDivisionChange={this.handleLayoutDivisionChange}
                                       onMaximizeContainer={this.handleContainerMaximization} onMinimizeContainer={this.handleContainerMinimization}
                                       onRestoreContainer={this.handleContainerRestoration} onViewSelected={this.handleViewSelection}>
                            {childArray}
                        </ViewSetLayout>
                        {
                            floatingGroup
                                ? <ResizableContainer key={floatingGroup} left={0} top={0} height={floatingGroupSpec.height} width={floatingGroupSpec.width}
                                                      resizableEdges={['e', 's']} initiallyTryResizeToFit={true}
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
                                : null
                        }
                    </div>
                    <Menu orientation="vertical">
                        {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroups.right, layout, views)}
                    </Menu>
                </div>
            </div>
        );
    }
};
