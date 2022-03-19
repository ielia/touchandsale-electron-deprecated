import Color from 'color';
import React, {PureComponent} from 'react';

import './_SalesPerspective.scss';

import {Perspective, PerspectiveMenuItem, SimpleMenuSection, View} from '..';

export default class SalesPerspective extends PureComponent {
    static accentColor = Color('#006bb5');

    render() {
        const layoutConfig: {layout: LayoutSpec, minimizedGroups: MinimizedGroups} = {
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
                left: [
                    {containerId: 'top-left', corner: 'nw', height: 100, floating: false, width: 100},
                    {containerId: 'bottom-left', corner: 'nw', height: 100, floating: false, width: 100},
                ],
                right: [
                    {containerId: 'top-right', corner: 'ne', height: 100, floating: false, width: 100},
                    {containerId: 'bottom-right', corner: 'ne', height: 100, floating: false, width: 100},
                ],
            },
        };

        return (
            <Perspective
                label="Ventas"
                className="sales"
                accentColor={SalesPerspective.accentColor}
                {...layoutConfig}
                shortcutKey="aV"
                menuSections={[
                    <SimpleMenuSection key="section0" sectionId="section0">
                        <PerspectiveMenuItem key="op-type" accentColor={SalesPerspective.accentColor} title="Tipo de operación" label="Oper." shortcutKey={{key: 'F3'}}/>
                        <PerspectiveMenuItem key="def-vals" accentColor={SalesPerspective.accentColor} title="Valores por defecto" label="V.Defe." shortcutKey={{key: 'F12'}}/>
                        <PerspectiveMenuItem key="last-ops" accentColor={SalesPerspective.accentColor} title="Consulta de operaciones anteriores" label="Consul." shortcutKey={{key: 'F11'}}/>
                        <PerspectiveMenuItem key="repeat" accentColor={SalesPerspective.accentColor} title="Repetir condiciones de la operación anterior" label="Repetir" shortcutKey={{key: 'F12', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="save-temp" accentColor={SalesPerspective.accentColor} title="Guarda operación en curso de forma temporal" label="G.Tem." shortcutKey={{key: 'F10', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="sum" accentColor={SalesPerspective.accentColor} title="Visualizar suma de operaciones previas" label="Suma" shortcutKey={{key: '+', altKey: true}}/>
                        <PerspectiveMenuItem key="expiration" accentColor={SalesPerspective.accentColor} title="Cambiar fecha de vencimiento (Presupuesto)" label="Vto." shortcutKey={{key: 'F', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="client-log" accentColor={SalesPerspective.accentColor} title="Histórico Cliente" label="Histór." shortcutKey={{key: 'H', ctrlKey: true}}/>
                    </SimpleMenuSection>,
                    <SimpleMenuSection key="section1" sectionId="section1">
                        <PerspectiveMenuItem key="load-obs" accentColor={SalesPerspective.accentColor} title="Cargar observaciones" label="Observ." shortcutKey={{key: 'O', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="stock-deposit" accentColor={SalesPerspective.accentColor} title="Depósitos de Stock" label="Depós." shortcutKey={{key: 'P', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="stock-query" accentColor={SalesPerspective.accentColor} title="Interconsulta de Stock" label="Interc." shortcutKey={{key: 'S', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="load-temp" accentColor={SalesPerspective.accentColor} title="Rescata temporal" label="R.Tem." shortcutKey={{key: 'T', ctrlKey: true}}/>
                        <PerspectiveMenuItem key="save-op" accentColor={SalesPerspective.accentColor} title="Guarda operación en curso de forma pendiente" label="G.Pend." shortcutKey={{key: 'F10', altKey: true}}/>
                        <PerspectiveMenuItem key="print-prev" accentColor={SalesPerspective.accentColor} title="Vista previa impresión" label="V.Impr." shortcutKey={{key: 'P', ctrlKey: true, shiftKey: true}}/>
                        <PerspectiveMenuItem key="print-prev-temp" accentColor={SalesPerspective.accentColor} title="Vista previa impresión temporal" label="V.Tem." shortcutKey={{key: 'T', ctrlKey: true, shiftKey: true}}/>
                    </SimpleMenuSection>,
                    <SimpleMenuSection key="section2" sectionId="section2">
                        <div className="TnS-about"/>
                        <div className="zWeb-link"/>
                    </SimpleMenuSection>
                ]}
            >
                <View key="agreements" viewId="agreements" color={Color('#006bb5')} iconLabel="Cnv" label="Convenios" className="agreements" shortcutKey={{key: 'F8'}} actions={[]}>
                    Convenios
                </View>
                <View key="assistant" viewId="assistant" color={Color('#006bb5')} iconLabel="Ast" label="Asistente" className="assistant" shortcutKey={{key: 'A', ctrlKey: true}} actions={[]}>
                    Asistente
                </View>
                <View key="clients" viewId="clients" color={Color('#1cbbee')} iconLabel="Cli" label="Clientes" className="clients" shortcutKey={{key: 'F7'}} actions={[]}>
                    Clientes
                </View>
                <View key="file" viewId="file" color={Color('#d7af00')} iconLabel="Fic" label="Ficha" className="file" shortcutKey={{key: 'F5'}} actions={[]}>
                    Ficha
                </View>
                <View key="icons" viewId="icons" color={Color('#ef7f1a')} iconLabel="Ico" label="Íconos" className="icons" shortcutKey={{key: 'F6'}} actions={[]}>
                    Íconos
                </View>
                <View key="items" viewId="items" color={Color('#006bb5')} iconLabel="Its" label="Items" className="items" shortcutKey={{key: 'I', ctrlKey: true}} actions={[]}>
                    Items
                </View>
                <View key="news" viewId="news" color={Color('#006bb5')} iconLabel="Ntc" label="Noticias" className="news" shortcutKey={{key: 'N', ctrlKey: true}} actions={[]}>
                    Noticias
                </View>
                <View key="payments" color={Color('#006bb5')} viewId="payments" iconLabel="Pgs" label="Pagos" className="payments" shortcutKey={{key: 'F9'}} actions={[]}>
                    Pagos
                </View>
            </Perspective>
        );
    }
};
