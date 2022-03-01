import {PureComponent} from 'react';

import './SalesPerspective.scss';
import MenuSection from '../MenuSection';
import Perspective from '../Perspective';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import View from '../View';
import ViewSetLayout from '../ViewSetLayout';

export default class SalesPerspective extends PureComponent {
    constructor(props) {
        super(props);
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

    handleViewSelection(tabbedContainerId, viewId) {
        console.log('tabbedContainerId:', tabbedContainerId, 'viewId:', viewId);
        const layout = this.updateSelections(this.state.layout, tabbedContainerId, viewId);
        this.setState({layout});
    }

    updateSelections(layout, tabbedContainerId, viewId) {
        const {horizontal, group, selected, vertical, ...other} = layout;
        let result;
        if (group) {
            result = {group, selected: (group === tabbedContainerId) ? viewId : selected, ...other};
        } else {
            const [orientation, content] = horizontal ? ['horizontal', horizontal] : ['vertical', vertical];
            console.log('updateSelections - layout:', layout, '- orientation:', orientation, '- content:', content);
            result = {[orientation]: content.map(c => this.updateSelections(c, tabbedContainerId, viewId)), ...other};
        }
        return result;
    }

    render() {
        const layout = this.state.layout;
        return (
            <Perspective
                label="Ventas"
                className="sales"
                shortcutKeys="aV"
                menuSections={[
                    <MenuSection key="section0">
                        <PerspectiveMenuItem key="op-type" title="Tipo de operación" label="Oper." shortcutKeys="F3"/>
                        <PerspectiveMenuItem key="def-vals" title="Valores por defecto" label="V.Defe." shortcutKeys="F12"/>
                        <PerspectiveMenuItem key="last-ops" title="Consulta de operaciones anteriores" label="Consul." shortcutKeys="F11"/>
                        <PerspectiveMenuItem key="repeat" title="Repetir condiciones de la operación anterior" label="Repetir" shortcutKeys="cF12"/>
                        <PerspectiveMenuItem key="save-temp" title="Guarda operación en curso de forma temporal" label="G.Tem." shortcutKeys="cF10"/>
                        <PerspectiveMenuItem key="sum" title="Visualizar suma de operaciones previas" label="Suma" shortcutKeys="a+"/>
                        <PerspectiveMenuItem key="expiration" title="Cambiar fecha de vencimiento (Presupuesto)" label="Vto." shortcutKeys="cF"/>
                        <PerspectiveMenuItem key="client-log" title="Histórico Cliente" label="Histór." shortcutKeys="cH"/>
                    </MenuSection>,
                    <MenuSection key="section1">
                        <PerspectiveMenuItem key="load-obs" title="Cargar observaciones" label="Observ." shortcutKeys="cO"/>
                        <PerspectiveMenuItem key="stock-deposit" title="Depósitos de Stock" label="Depós." shortcutKeys="cP"/>
                        <PerspectiveMenuItem key="stock-query" title="Interconsulta de Stock" label="Interc." shortcutKeys="cS"/>
                        <PerspectiveMenuItem key="load-temp" title="Rescata temporal" label="R.Tem." shortcutKeys="cT"/>
                        <PerspectiveMenuItem key="save-op" title="Guarda operación en curso de forma pendiente" label="G.Pend." shortcutKeys="aF10"/>
                        <PerspectiveMenuItem key="print-prev" title="Vista previa impresión" label="V.Impr." shortcutKeys="csP"/>
                        <PerspectiveMenuItem key="print-prev-temp" title="Vista previa impresión temporal" label="V.Tem." shortcutKeys="csT"/>
                    </MenuSection>,
                ]}
            >
                <ViewSetLayout layout={layout} onViewSelected={this.handleViewSelection}>
                    <View key="items" viewId="items" label="Items" className="items" shortcutKeys="cI" actions={[]}>
                        Items
                    </View>
                    <View key="file" viewId="file" label="Ficha" className="file" shortcutKeys="F5" actions={[]}>
                        Ficha
                    </View>
                    <View key="icons" viewId="icons" label="Íconos" className="icons" shortcutKeys="F6" actions={[]}>
                        Íconos
                    </View>
                    <View key="clients" viewId="clients" label="Clientes" className="clients" shortcutKeys="F7" actions={[]}>
                        Clientes
                    </View>
                    <View key="agreements" viewId="agreements" label="Convenios" className="agreements" shortcutKeys="F8" actions={[]}>
                        Convenios
                    </View>
                    <View key="payments" viewId="payments" label="Pagos" className="payments" shortcutKeys="F9" actions={[]}>
                        Pagos
                    </View>
                    <View key="news" viewId="news" label="Noticias" className="news" shortcutKeys="cN" actions={[]}>
                        Noticias
                    </View>
                    <View key="assistant" viewId="assistant" label="Asistente" className="assistant" shortcutKeys="cA" actions={[]}>
                        Asistente
                    </View>
                </ViewSetLayout>
            </Perspective>
        );
    }
};
