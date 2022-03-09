import React, {Component, ReactElement, ReactNode} from 'react';

import './SalesPerspective.scss';
import Menu from '../Menu';
import MenuSection from '../MenuSection';
import MinimizedViewContainer from '../MinimizedViewContainer';
import Perspective from '../Perspective';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import View from '../View';
import ViewSetLayout from '../ViewSetLayout';

interface MinimizedGroups {
    left: string[],
    right: string[],
}

interface Props {
}

interface State {
    layout: LayoutSpec;
    minimizedGroups: MinimizedGroups;
}

export default class SalesPerspective extends Component<Props, State> {
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
            minimizedGroups: {
                left: ['top-left', 'bottom-left'],
                right: ['top-right', 'bottom-right'],
            },
        };
    }

    buildMinimizedGroups(groupIds: string[], layout: LayoutSpec, views: { [viewId: string]: ReactElement<View> & ReactNode }) {
        const groups = this.findGroups(groupIds, layout);
        console.log('GROUPS:', groups);
        return groups.reduce((acc, group) => {
            if (group.state === 'minimized') {
                console.log('MINIMIZED:', group);
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
        this.setState(({layout, ...others}) => ({layout: this.updateGroupAttribute(layout, tabbedContainerId, 'state', 'maximized'), ...others}));
    }

    handleContainerMinimization(tabbedContainerId: string): void {
        this.setState(({layout, ...others}) => ({layout: this.updateGroupAttribute(layout, tabbedContainerId, 'state', 'minimized'), ...others}));
    }

    handleContainerRestoration(tabbedContainerId: string): void {
        this.setState(({layout, ...others}) => ({layout: this.updateGroupAttribute(layout, tabbedContainerId, 'state', 'normal'), ...others}));
    }

    handleLayoutDivisionChange(pathToStart: string, startRatio: number, endRatio: number) {
        this.setState(({minimizedGroups}) => ({layout: this.updateWeights(this.state.layout, pathToStart, startRatio, endRatio), minimizedGroups}));
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
        console.log('RENDERING SalesPerspective');
        const {layout, minimizedGroups} = this.state;
        const views: { [viewId: string]: ReactElement<View> & ReactNode } = {
            agreements: <View key="agreements" viewId="agreements" iconLabel="Cnv" label="Convenios" className="agreements" shortcutKey={{key: 'F8'}} actions={[]}>
                Convenios
            </View>,
            assistant: <View key="assistant" viewId="assistant" iconLabel="Ast" label="Asistente" className="assistant" shortcutKey={{key: 'A', ctrlKey: true}} actions={[]}>
                Asistente
            </View>,
            clients: <View key="clients" viewId="clients" iconLabel="Cli" label="Clientes" className="clients" shortcutKey={{key: 'F7'}} actions={[]}>
                Clientes
            </View>,
            file: <View key="file" viewId="file" iconLabel="Fic" label="Ficha" className="file" shortcutKey={{key: 'F5'}} actions={[]}>
                Ficha
            </View>,
            icons: <View key="icons" viewId="icons" iconLabel="Ico" label="Íconos" className="icons" shortcutKey={{key: 'F6'}} actions={[]}>
                Íconos
            </View>,
            items: <View key="items" viewId="items" iconLabel="Its" label="Items" className="items" shortcutKey={{key: 'I', ctrlKey: true}} actions={[]}>
                Items
            </View>,
            news: <View key="news" viewId="news" iconLabel="Ntc" label="Noticias" className="news" shortcutKey={{key: 'N', ctrlKey: true}} actions={[]}>
                Noticias
            </View>,
            payments: <View key="payments" viewId="payments" iconLabel="Pgs" label="Pagos" className="payments" shortcutKey={{key: 'F9'}} actions={[]}>
                Pagos
            </View>,
        };
        return (
            <Perspective
                label="Ventas"
                className="sales"
                shortcutKey="aV"
                menuSections={[
                    <MenuSection key="section0">
                        <PerspectiveMenuItem key="op-type" title="Tipo de operación" label="Oper." shortcutKey={{key: 'F3'}}/>
                        <PerspectiveMenuItem key="def-vals" title="Valores por defecto" label="V.Defe." shortcutKey={{key: 'F12'}}/>
                        <PerspectiveMenuItem key="last-ops" title="Consulta de operaciones anteriores" label="Consul." shortcutKey={{key: 'F11'}}/>
                        <PerspectiveMenuItem key="repeat" title="Repetir condiciones de la operación anterior" label="Repetir" shortcutKey={{key: 'F12', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="save-temp" title="Guarda operación en curso de forma temporal" label="G.Tem." shortcutKey={{key: 'F10', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="sum" title="Visualizar suma de operaciones previas" label="Suma" shortcutKey={{key: '+', altKey: true}}/>
                        <PerspectiveMenuItem key="expiration" title="Cambiar fecha de vencimiento (Presupuesto)" label="Vto." shortcutKey={{key: 'F', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="client-log" title="Histórico Cliente" label="Histór." shortcutKey={{key: 'H', ctrlKey: true}}/>
                    </MenuSection>,
                    <MenuSection key="section1">
                        <PerspectiveMenuItem key="load-obs" title="Cargar observaciones" label="Observ." shortcutKey={{key: 'O', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="stock-deposit" title="Depósitos de Stock" label="Depós." shortcutKey={{key: 'P', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="stock-query" title="Interconsulta de Stock" label="Interc." shortcutKey={{key: 'S', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="load-temp" title="Rescata temporal" label="R.Tem." shortcutKey={{key: 'T', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="save-op" title="Guarda operación en curso de forma pendiente" label="G.Pend." shortcutKey={{key: 'F10', altKey: true}}/>
                        <PerspectiveMenuItem key="print-prev" title="Vista previa impresión" label="V.Impr." shortcutKey={{key: 'P', ctrlKey: true, shiftKey: true}}/>
                        <PerspectiveMenuItem key="print-prev-temp" title="Vista previa impresión temporal" label="V.Tem." shortcutKey={{key: 'T', ctrlKey: true, shiftKey: true}}/>
                    </MenuSection>,
                ]}
            >
                <Menu orientation="vertical">
                    {this.buildMinimizedGroups(minimizedGroups.left, layout, views)}
                </Menu>
                <ViewSetLayout layout={layout} onLayoutDivisionChange={this.handleLayoutDivisionChange} onMaximizeContainer={this.handleContainerMaximization} onMinimizeContainer={this.handleContainerMinimization} onRestoreContainer={this.handleContainerRestoration} onViewSelected={this.handleViewSelection}>
                    {Object.values(views)}
                </ViewSetLayout>
                <Menu orientation="vertical">
                    {this.buildMinimizedGroups(minimizedGroups.right, layout, views)}
                </Menu>
            </Perspective>
        );
    }
};
