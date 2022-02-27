import React from 'react';

import './SalesPerspective.scss';
import Layout from "../Layout";
import Perspective from '../Perspective';
import MenuSection from '../MenuSection';
import PerspectiveMenuItem from '../PerspectiveMenuItem';
import TabbedViewContainer from '../TabbedViewContainer';
import View from '../View';

export default function SalesPerspective() {
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
            <Layout key="horizontal0" orientation="horizontal">
                <Layout key="vertical0" orientation="vertical">
                    <TabbedViewContainer key="tabbed0">
                        <View key="items" label="Items" className="items" shortcutKeys="cI" actions={[]} selected={true} maximized={false}>
                            Items
                        </View>
                    </TabbedViewContainer>
                    <TabbedViewContainer key="tabbed1">
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
                    </TabbedViewContainer>
                </Layout>
                <Layout key="vertical1" orientation="vertical">
                    <TabbedViewContainer key="tabbed0">
                        <View key="payments" label="Pagos" className="payments" shortcutKeys="F9" actions={[]} selected={true} maximized={false}>
                            Pagos
                        </View>
                    </TabbedViewContainer>
                    <TabbedViewContainer key="tabbed1">
                        <View key="news" label="Noticias" className="news" shortcutKeys="cN" actions={[]} selected={true} maximized={false}>
                            Noticias
                        </View>
                        <View key="assistant" label="Asistente" className="assistant" shortcutKeys="cA" actions={[]} selected={false} maximized={false}>
                            Asistente
                        </View>
                    </TabbedViewContainer>
                </Layout>
            </Layout>
        </Perspective>
    );
};
