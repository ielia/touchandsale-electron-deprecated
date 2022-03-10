import Color from 'color';
import React, {Component, ReactElement, ReactNode} from 'react';

import './_SalesPerspective.scss';
import Menu from '../Menu';
import MenuSection from '../MenuSection';
import MinimizedViewContainer from '../MinimizedViewContainer';
import Perspective from '../Perspective';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import View from '../View';
import ViewSetLayout from '../ViewSetLayout';

interface MinimizedGroupLocations {
    left: string[],
    right: string[],
}

interface Props {
}

interface State {
    layout: LayoutSpec;
    maximizedGroup: string;
    minimizedGroupLocations: MinimizedGroupLocations;
}

export default class SalesPerspective extends Component<Props, State> {
    static accentColor = Color('#006bb5');

    constructor(props: Props) {
        super(props);
        this.buildMinimizedGroups = this.buildMinimizedGroups.bind(this);
        this.handleContainerMaximization = this.handleContainerMaximization.bind(this);
        this.handleContainerMinimization = this.handleContainerMinimization.bind(this);
        this.handleContainerRestoration = this.handleContainerRestoration.bind(this);
        this.handleLayoutDivisionChange = this.handleLayoutDivisionChange.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);

        this.state = {
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
            minimizedGroupLocations: {
                left: ['top-left', 'bottom-left'],
                right: ['top-right', 'bottom-right'],
            },
        };
    }

    buildMinimizedGroups(maximizedContext: boolean, groupIds: string[], layout: LayoutSpec, views: { [viewId: string]: ReactElement<View> & ReactNode }) {
        const groups = this.findGroups(groupIds, layout);
        return groups.reduce((acc, group) => {
            const state = group.state;
            if (maximizedContext ? state !== 'maximized' : state === 'minimized') {
                const {groupId, children} = group;
                acc.push(
                    <MinimizedViewContainer key={groupId} containerId={groupId} onRestore={this.handleContainerRestoration}>
                        {children.map(viewId => views[viewId])}
                    </MinimizedViewContainer>
                );
            }
            return acc;
        }, []);
    }

    findGroups(groupIds: string[], layout: LayoutSpec): LeafLayoutSpec[] {
        return 'orientation' in layout
            ? layout.children.flatMap(subLayout => this.findGroups(groupIds, subLayout))
            : groupIds.indexOf(layout.groupId) >= 0
                ? [layout]
                : [];
    }

    handleContainerMaximization(tabbedContainerId: string): void {
        this.setState(({layout, maximizedGroup, ...others}) => ({layout: this.updateGroupAttribute(layout, tabbedContainerId, 'state', 'maximized'), maximizedGroup: tabbedContainerId, ...others}));
    }

    handleContainerMinimization(tabbedContainerId: string): void {
        this.setState(({layout, maximizedGroup, ...others}) => ({layout: this.updateGroupAttribute(layout, tabbedContainerId, 'state', 'minimized'), maximizedGroup: maximizedGroup === tabbedContainerId ? null : maximizedGroup, ...others}));
    }

    handleContainerRestoration(tabbedContainerId: string): void {
        this.setState(({layout, maximizedGroup, ...others}) => {
            let newLayout = this.updateGroupAttribute(layout, tabbedContainerId, 'state', 'normal');
            if (tabbedContainerId !== maximizedGroup) {
                newLayout = this.updateGroupAttribute(newLayout, maximizedGroup, 'state', 'normal');
            }
            return {layout: newLayout, maximizedGroup: null, ...others};
        });
    }

    handleLayoutDivisionChange(pathToStart: string, startRatio: number, endRatio: number) {
        this.setState(({layout, ...others}) => ({layout: this.updateWeights(layout, pathToStart, startRatio, endRatio), ...others}));
    }

    handleViewSelection(tabbedContainerId: string, viewId: string) {
        this.setState(({layout, ...others}) => ({layout: this.updateGroupAttribute(layout, tabbedContainerId, 'selected', viewId), ...others}));
    }

    updateGroupAttribute<T>(layout: LayoutSpec, tabbedContainerId: string, attribute: keyof LeafLayoutSpec, value: T): LayoutSpec {
        let result;
        if ('groupId' in layout) {
            const {groupId, ...other} = layout;
            const originalValue = layout[attribute];
            result = {groupId, ...other, [attribute]: (groupId === tabbedContainerId) ? value : originalValue};
        } else {
            const {children, ...other} = layout;
            result = {children: children.map(child => this.updateGroupAttribute(child, tabbedContainerId, attribute, value)), ...other};
        }
        return result;
    }

    updateWeights(layout: LayoutSpec, pathToStart: string, startRatio: number, endRatio: number): LayoutSpec {
        let result: LayoutSpec;
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
        const {layout, maximizedGroup, minimizedGroupLocations} = this.state;
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
                    {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroupLocations.left, layout, views)}
                </Menu>
                <ViewSetLayout layout={layout} shownState={maximizedGroup ? 'maximized' : 'normal'} onLayoutDivisionChange={this.handleLayoutDivisionChange} onMaximizeContainer={this.handleContainerMaximization} onMinimizeContainer={this.handleContainerMinimization} onRestoreContainer={this.handleContainerRestoration} onViewSelected={this.handleViewSelection}>
                    {Object.values(views)}
                </ViewSetLayout>
                <Menu orientation="vertical">
                    {this.buildMinimizedGroups(!!maximizedGroup, minimizedGroupLocations.right, layout, views)}
                </Menu>
            </Perspective>
        );
    }
};
