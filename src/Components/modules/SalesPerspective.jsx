import React from 'react';

import './SalesPerspective.scss';
import MenuSection from '../MenuSection';
import Perspective from '../Perspective';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import View from '../View';
import ViewSetLayout from '../ViewSetLayout';

export default function SalesPerspective() {
    const layout = {
        horizontal: [
            {
                vertical: [
                    {group: 'top-left', keys: ['items'], selected: 'items', weight: 0.6},
                    {group: 'bottom-left', keys: ['file', 'icons', 'clients', 'agreements'], selected: 'clients', weight: 0.4}
                ],
                weight: 0.65,
            },
            {
                vertical: [
                    {group: 'top-right', keys: ['payments'], selected: 'payments', weight: 0.6},
                    {group: 'bottom-right', keys: ['news', 'assistant'], selected: 'news', weight: 0.4}
                ],
                weight: 0.35,
            },
        ],
        weight: 1
    };
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
            <ViewSetLayout layout={layout}>
                <View key="items" label="Items" className="items" shortcutKeys="cI" actions={[]} selected={true} maximized={false}>
                    Items
                </View>
                <View key="file" label="Ficha" className="file" shortcutKeys="F5" actions={[]} selected={false} maximized={false}>
                    Ficha
                </View>
                <View key="icons" label="Íconos" className="icons" shortcutKeys="F6" actions={[]} selected={false} maximized={false}>
                    Íconos
                </View>
                <View key="clients" label="Clientes" className="clients" shortcutKeys="F7" actions={[]} selected={true} maximized={false}>
                    Clientes
                </View>
                <View key="agreements" label="Convenios" className="agreements" shortcutKeys="F8" actions={[]} selected={false} maximized={false}>
                    Convenios
                </View>
                <View key="payments" label="Pagos" className="payments" shortcutKeys="F9" actions={[]} selected={true} maximized={false}>
                    Pagos
                </View>
                <View key="news" label="Noticias" className="news" shortcutKeys="cN" actions={[]} selected={true} maximized={false}>
                    Noticias
                </View>
                <View key="assistant" label="Asistente" className="assistant" shortcutKeys="cA" actions={[]} selected={false} maximized={false}>
                    Asistente
                </View>
            </ViewSetLayout>
        </Perspective>
    );
};
