import React, {PureComponent} from 'react';

import './SalesPerspective.scss';
import MenuSection from '../MenuSection';
import Perspective from '../Perspective';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import View from '../View';
import ViewSetLayout from '../ViewSetLayout';

interface Props {
}

interface State {
    layout: any;
}

export default class SalesPerspective extends PureComponent<Props, State> {
    constructor(props: any) {
        super(props);
        this.handleLayoutDivisionChange = this.handleLayoutDivisionChange.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);

        this.state = {
            layout: {
                horizontal: [
                    {
                        vertical: [
                            {group: 'top-left', keys: ['items'], selected: 'items', weight: 0.6},
                            {group: 'bottom-left', keys: ['file', 'icons', 'clients', 'agreements'], selected: 'clients', weight: 0.4},
                        ],
                        weight: 0.65,
                    },
                    {
                        vertical: [
                            {group: 'top-right', keys: ['payments'], selected: 'payments', weight: 0.6},
                            {group: 'bottom-right', keys: ['news', 'assistant'], selected: 'news', weight: 0.4},
                        ],
                        weight: 0.35,
                    },
                ],
                weight: 1,
            },
        };
    }

    handleLayoutDivisionChange(pathToStart: string, startRatio: number, endRatio: number) {
        this.setState({layout: this.updateWeights(this.state.layout, pathToStart, startRatio, endRatio)});
    }

    handleViewSelection(tabbedContainerId: string, viewId: string) {
        this.setState({layout: this.updateSelections(this.state.layout, tabbedContainerId, viewId)});
    }

    updateSelections(layout: any, tabbedContainerId: string, viewId: string) {
        const {horizontal, group, keys, selected, vertical, ...other} = layout;
        let result;
        if (group) {
            result = {group, keys, selected: (group === tabbedContainerId) || (!tabbedContainerId && keys.indexOf(viewId) >= 0) ? viewId : selected, ...other};
        } else {
            const [orientation, content] = horizontal ? ['horizontal', horizontal] : ['vertical', vertical];
            result = {[orientation]: content.map((child: any) => this.updateSelections(child, tabbedContainerId, viewId)), ...other};
        }
        return result;
    }

    updateWeights(layout: any, pathToStart: string, startRatio: number, endRatio: number): any {
        const {horizontal, vertical, weight, ...other} = layout;
        const [orientation, subLayout] = pathToStart[0] === 'h' ? ['horizontal', horizontal] : ['vertical', vertical];
        const indexStr = pathToStart.match('^[hv](\\d+)')[1];
        const nextPathPointer = indexStr.length + 1;
        const index = parseInt(indexStr);
        const startLayout = subLayout[index];
        if (pathToStart.length > nextPathPointer) {
            return {
                [orientation]: [
                    ...subLayout.slice(0, index),
                    this.updateWeights(startLayout, pathToStart.substring(nextPathPointer), startRatio, endRatio),
                    ...subLayout.slice(index + 1),
                ],
                weight,
                ...other,
            };
        } else {
            const endLayout = subLayout[index + 1];
            return {
                [orientation]: [
                    ...subLayout.slice(0, index),
                    {...startLayout, weight: startRatio},
                    {...endLayout, weight: endRatio},
                    ...subLayout.slice(index + 2),
                ],
                weight,
                ...other,
            }
        }
    }

    render() {
        const layout = this.state.layout;
        return (
            <Perspective
                label="Ventas"
                className="sales"
                shortcutKey="aV"
                menuSections={[
                    <MenuSection key="section0">
                        <PerspectiveMenuItem key="op-type" title="Tipo de operación" label="Oper." shortcutKey="F3"/>
                        <PerspectiveMenuItem key="def-vals" title="Valores por defecto" label="V.Defe." shortcutKey="F12"/>
                        <PerspectiveMenuItem key="last-ops" title="Consulta de operaciones anteriores" label="Consul." shortcutKey="F11"/>
                        <PerspectiveMenuItem key="repeat" title="Repetir condiciones de la operación anterior" label="Repetir" shortcutKey="cF12"/>
                        <PerspectiveMenuItem key="save-temp" title="Guarda operación en curso de forma temporal" label="G.Tem." shortcutKey="cF10"/>
                        <PerspectiveMenuItem key="sum" title="Visualizar suma de operaciones previas" label="Suma" shortcutKey="a+"/>
                        <PerspectiveMenuItem key="expiration" title="Cambiar fecha de vencimiento (Presupuesto)" label="Vto." shortcutKey="cF"/>
                        <PerspectiveMenuItem key="client-log" title="Histórico Cliente" label="Histór." shortcutKey="cH"/>
                    </MenuSection>,
                    <MenuSection key="section1">
                        <PerspectiveMenuItem key="load-obs" title="Cargar observaciones" label="Observ." shortcutKey="cO"/>
                        <PerspectiveMenuItem key="stock-deposit" title="Depósitos de Stock" label="Depós." shortcutKey="cP"/>
                        <PerspectiveMenuItem key="stock-query" title="Interconsulta de Stock" label="Interc." shortcutKey="cS"/>
                        <PerspectiveMenuItem key="load-temp" title="Rescata temporal" label="R.Tem." shortcutKey="cT"/>
                        <PerspectiveMenuItem key="save-op" title="Guarda operación en curso de forma pendiente" label="G.Pend." shortcutKey="aF10"/>
                        <PerspectiveMenuItem key="print-prev" title="Vista previa impresión" label="V.Impr." shortcutKey="csP"/>
                        <PerspectiveMenuItem key="print-prev-temp" title="Vista previa impresión temporal" label="V.Tem." shortcutKey="csT"/>
                    </MenuSection>,
                ]}
            >
                <ViewSetLayout layout={layout} onLayoutDivisionChange={this.handleLayoutDivisionChange} onViewSelected={this.handleViewSelection}>
                    <View key="items" viewId="items" label="Items" className="items" shortcutKey={{key: 'I', ctrlKey: true}} actions={[]}>
                        Items
                    </View>
                    <View key="file" viewId="file" label="Ficha" className="file" shortcutKey={{key: 'F5'}} actions={[]}>
                        Ficha
                    </View>
                    <View key="icons" viewId="icons" label="Íconos" className="icons" shortcutKey={{key: 'F6'}} actions={[]}>
                        Íconos
                    </View>
                    <View key="clients" viewId="clients" label="Clientes" className="clients" shortcutKey={{key: 'F7'}} actions={[]}>
                        Clientes
                    </View>
                    <View key="agreements" viewId="agreements" label="Convenios" className="agreements" shortcutKey={{key: 'F8'}} actions={[]}>
                        Convenios
                    </View>
                    <View key="payments" viewId="payments" label="Pagos" className="payments" shortcutKey={{key: 'F9'}} actions={[]}>
                        Pagos
                    </View>
                    <View key="news" viewId="news" label="Noticias" className="news" shortcutKey={{key: 'N', ctrlKey: true}} actions={[]}>
                        Noticias
                    </View>
                    <View key="assistant" viewId="assistant" label="Asistente" className="assistant" shortcutKey={{key: 'A', ctrlKey: true}} actions={[]}>
                        Asistente
                    </View>
                </ViewSetLayout>
            </Perspective>
        );
    }
};
