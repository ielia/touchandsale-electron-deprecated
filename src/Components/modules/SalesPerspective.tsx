import Color from 'color';
import React, {Component, ReactElement, ReactNode, RefObject, createRef} from 'react';

import './_SalesPerspective.scss';

import Menu from '../Menu';
import MenuSection from '../MenuSection';
import MinimizedViewContainer from '../MinimizedViewContainer';
import Perspective from '../Perspective';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import ResizableContainer from '../ResizableContainer';
import TabbedViewContainer from '../TabbedViewContainer';
import View from '../View';
import ViewSetLayout from '../ViewSetLayout';

type MinimizedGroupSpec = {containerId: string, floating: boolean, height: number, width: number};
interface MinimizedGroups {
    [menuId: string]: MinimizedGroupSpec[],
}

interface Props {
}

interface State {
    floatingGroup: string;
    layout: LayoutSpec;
    maximizedGroup: string;
    minimizedGroups: MinimizedGroups;
}

export default class SalesPerspective extends Component<Props, State> {
    static accentColor = Color('#006bb5');

    layoutContainerRef: RefObject<HTMLDivElement>;
    minimizedFloaterRef: RefObject<HTMLElement>;

    // FIXME: Move all non-configuration code from SalesPerspective into Perspective.
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

        this.state = {
            floatingGroup: null,
            layout: {
                orientation: 'horizontal',
                children: [
                    {
                        orientation: 'vertical',
                        children: [
                            {groupId: 'top-left', children: ['items'], selected: 'items', state: 'normal', weight: 0.6},
                            {groupId: 'bottom-left', children: ['file', 'icons', 'clients', 'agreements'], selected: 'clients', state: 'normal', weight: 0.4},
                        ],
                        weight: 0.65,
                    },
                    {
                        orientation: 'vertical',
                        children: [
                            {groupId: 'top-right', children: ['payments'], selected: 'payments', state: 'normal', weight: 0.6},
                            {groupId: 'bottom-right', children: ['news', 'assistant'], selected: 'news', state: 'normal', weight: 0.4},
                        ],
                        weight: 0.35,
                    },
                ],
                weight: 1,
            },
            maximizedGroup: null,
            minimizedGroups: {
                left: [
                    {containerId: 'top-left', height: 100, floating: false, width: 100},
                    {containerId: 'bottom-left', height: 100, floating: false, width: 100},
                ],
                right: [
                    {containerId: 'top-right', height: 100, floating: false, width: 100},
                    {containerId: 'bottom-right', height: 100, floating: false, width: 100},
                ],
            },
        };
    }

    protected buildMinimizedGroups(maximizedContext: boolean, minimizedGroupList: MinimizedGroupSpec[], layout: LayoutSpec, views: { [viewId: string]: ReactElement<View> & ReactNode }): MinimizedViewContainer[] {
        const minimizedGroupsById = minimizedGroupList.reduce((acc: {[key: string]: MinimizedGroupSpec}, group) => { acc[group.containerId] = group; return acc; }, {});
        const groups = this.findGroups(layout, ...Object.keys(minimizedGroupsById));
        return groups.reduce((acc, group) => {
            const state = group.state;
            if (maximizedContext ? state !== 'maximized' : state === 'minimized') {
                const {children, groupId, selected} = group;
                const wrapperRefAttr = minimizedGroupsById[groupId].floating ? {wrapperRef: this.minimizedFloaterRef} : {};
                acc.push(
                    <MinimizedViewContainer key={groupId} containerId={groupId} selectedView={selected} onRestore={this.handleContainerRestoration} onViewSelected={this.handleMinimizedViewSelection} {...wrapperRefAttr}>
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

    protected getClosestCornerSpec(x: number, y: number, container: Element): {bottom?: 0, left?: 0, right?: 0, top?: 0, resizableEdges: CompassHeading[]} {
        const {bottom, left, right, top} = container.getBoundingClientRect();
        const horizontalSpec: ['left' | 'right', CompassHeading] = Math.abs(x - right) < Math.abs(x - left) ? ['right', 'w'] : ['left', 'e'];
        const verticalSpec: ['bottom' | 'top', CompassHeading] = Math.abs(y - bottom) < Math.abs(y - top) ? ['bottom', 's'] : ['top', 'n'];
        return {[horizontalSpec[0]]: 0, [verticalSpec[0]]: 0, resizableEdges: [horizontalSpec[1], verticalSpec[1]]};
    }

    protected handleClosingFloatingGroup(containerId: string, event: FocusEvent): void {
        // This method will always result in a new state, since having floatingGroup with any other value than the non-null containerId would be a bug,
        // and the resulting state will have floatingGroup set to null.
        if (!event.relatedTarget || !this.minimizedFloaterRef || !this.minimizedFloaterRef.current.contains(event.relatedTarget as Node)) {
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
            this.minimizedFloaterRef = null;
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

    protected updateAttributeOnAllMinimizedGroups<A extends keyof MinimizedGroupSpec, T extends MinimizedGroupSpec[A]>(minimizedGroups: MinimizedGroups, attribute: A, value: T): MinimizedGroups {
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

    protected updateMinimizedGroupAttribute<A extends keyof MinimizedGroupSpec, T extends MinimizedGroupSpec[A]>(minimizedGroups: MinimizedGroups, containerId: string, attribute: A, value: T): MinimizedGroups {
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
        const {floatingGroup, layout, maximizedGroup, minimizedGroups} = this.state;
        const views: { [viewId: string]: ReactElement<View> & ReactNode } = {
            agreements: <View key="agreements" viewId="agreements" color={Color('#006bb5')} iconLabel="Cnv" label="Convenios" className="agreements" shortcutKey={{key: 'F8'}} actions={[]}>
                Convenios
            </View>,
            assistant: <View key="assistant" viewId="assistant" color={Color('#006bb5')} iconLabel="Ast" label="Asistente" className="assistant" shortcutKey={{key: 'A', ctrlKey: true}} actions={[]}>
                Asistente
            </View>,
            clients: <View key="clients" viewId="clients" color={Color('#1cbbee')} iconLabel="Cli" label="Clientes" className="clients" shortcutKey={{key: 'F7'}} actions={[]}>
                Clientes
            </View>,
            file: <View key="file" viewId="file" color={Color('#d7af00')} iconLabel="Fic" label="Ficha" className="file" shortcutKey={{key: 'F5'}} actions={[]}>
                Ficha
            </View>,
            icons: <View key="icons" viewId="icons" color={Color('#ef7f1a')} iconLabel="Ico" label="Íconos" className="icons" shortcutKey={{key: 'F6'}} actions={[]}>
                Íconos
            </View>,
            items: <View key="items" viewId="items" color={Color('#006bb5')} iconLabel="Its" label="Items" className="items" shortcutKey={{key: 'I', ctrlKey: true}} actions={[]}>
                Items
            </View>,
            news: <View key="news" viewId="news" color={Color('#006bb5')} iconLabel="Ntc" label="Noticias" className="news" shortcutKey={{key: 'N', ctrlKey: true}} actions={[]}>
                Noticias
            </View>,
            payments: <View key="payments" color={Color('#006bb5')} viewId="payments" iconLabel="Pgs" label="Pagos" className="payments" shortcutKey={{key: 'F9'}} actions={[]}>
                Pagos
            </View>,
        };
        return (
            <Perspective
                label="Ventas"
                className="sales"
                accentColor={SalesPerspective.accentColor}
                shortcutKey="aV"
                menuSections={[
                    <MenuSection key="section0">
                        <PerspectiveMenuItem key="op-type" accentColor={SalesPerspective.accentColor} title="Tipo de operación" label="Oper." shortcutKey={{key: 'F3'}}/>
                        <PerspectiveMenuItem key="def-vals" accentColor={SalesPerspective.accentColor} title="Valores por defecto" label="V.Defe." shortcutKey={{key: 'F12'}}/>
                        <PerspectiveMenuItem key="last-ops" accentColor={SalesPerspective.accentColor} title="Consulta de operaciones anteriores" label="Consul." shortcutKey={{key: 'F11'}}/>
                        <PerspectiveMenuItem key="repeat" accentColor={SalesPerspective.accentColor} title="Repetir condiciones de la operación anterior" label="Repetir" shortcutKey={{key: 'F12', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="save-temp" accentColor={SalesPerspective.accentColor} title="Guarda operación en curso de forma temporal" label="G.Tem." shortcutKey={{key: 'F10', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="sum" accentColor={SalesPerspective.accentColor} title="Visualizar suma de operaciones previas" label="Suma" shortcutKey={{key: '+', altKey: true}}/>
                        <PerspectiveMenuItem key="expiration" accentColor={SalesPerspective.accentColor} title="Cambiar fecha de vencimiento (Presupuesto)" label="Vto." shortcutKey={{key: 'F', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="client-log" accentColor={SalesPerspective.accentColor} title="Histórico Cliente" label="Histór." shortcutKey={{key: 'H', ctrlKey: true}}/>
                    </MenuSection>,
                    <MenuSection key="section1">
                        <PerspectiveMenuItem key="load-obs" accentColor={SalesPerspective.accentColor} title="Cargar observaciones" label="Observ." shortcutKey={{key: 'O', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="stock-deposit" accentColor={SalesPerspective.accentColor} title="Depósitos de Stock" label="Depós." shortcutKey={{key: 'P', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="stock-query" accentColor={SalesPerspective.accentColor} title="Interconsulta de Stock" label="Interc." shortcutKey={{key: 'S', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="load-temp" accentColor={SalesPerspective.accentColor} title="Rescata temporal" label="R.Tem." shortcutKey={{key: 'T', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="save-op" accentColor={SalesPerspective.accentColor} title="Guarda operación en curso de forma pendiente" label="G.Pend." shortcutKey={{key: 'F10', altKey: true}}/>
                        <PerspectiveMenuItem key="print-prev" accentColor={SalesPerspective.accentColor} title="Vista previa impresión" label="V.Impr." shortcutKey={{key: 'P', ctrlKey: true, shiftKey: true}}/>
                        <PerspectiveMenuItem key="print-prev-temp" accentColor={SalesPerspective.accentColor} title="Vista previa impresión temporal" label="V.Tem." shortcutKey={{key: 'T', ctrlKey: true, shiftKey: true}}/>
                    </MenuSection>,
                ]}
            >
                <Menu orientation="vertical">
                    {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroups.left, layout, views)}
                </Menu>
                <div className="perspective-layout-container" ref={this.layoutContainerRef}>
                    <ViewSetLayout layout={layout} shownState={maximizedGroup ? 'maximized' : 'normal'} onLayoutDivisionChange={this.handleLayoutDivisionChange} onMaximizeContainer={this.handleContainerMaximization} onMinimizeContainer={this.handleContainerMinimization} onRestoreContainer={this.handleContainerRestoration} onViewSelected={this.handleViewSelection}>
                        {Object.values(views)}
                    </ViewSetLayout>
                    {
                        floatingGroup
                            ? <ResizableContainer left={0} top={0} resizableEdges={['e', 's']} initiallyTryResizeToFit={true}
                                                  onFocusOut={this.handleClosingFloatingGroup.bind(this, floatingGroup)}>
                                  {this.findGroups(layout, floatingGroup).map(group => (
                                      <TabbedViewContainer key={group.groupId} containerId={group.groupId} onMaximize={this.handleContainerMaximization} onMinimize={this.handleContainerMinimization} onRestore={this.handleContainerRestoration} onViewSelected={this.handleMinimizedViewSelection} selectedViewId={group.selected} state="floating">
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
            </Perspective>
        );
    }
};
