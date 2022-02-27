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
            name="Ventas"
            className="sales"
            shortcutKeys="aV"
            menuSections={[
                <MenuSection key="section0">
                    <PerspectiveMenuItem key="op-type" fullName="Tipo de operación" shortName="Oper." shortcutKeys="F3"/>
                    <PerspectiveMenuItem key="def-vals" fullName="Valores por defecto" shortName="V.Defe." shortcutKeys="F12"/>
                    <PerspectiveMenuItem key="last-ops" fullName="Consulta de operaciones anteriores" shortName="Consul." shortcutKeys="F11"/>
                    <PerspectiveMenuItem key="repeat" fullName="Repetir condiciones de la operación anterior" shortName="Repetir" shortcutKeys="cF12"/>
                    <PerspectiveMenuItem key="save-temp" fullName="Guarda operación en curso de forma temporal" shortName="G.Tem." shortcutKeys="cF10"/>
                    <PerspectiveMenuItem key="sum" fullName="Visualizar suma de operaciones previas" shortName="Suma" shortcutKeys="a+"/>
                    <PerspectiveMenuItem key="expiration" fullName="Cambiar fecha de vencimiento (Presupuesto)" shortName="Vto." shortcutKeys="cF"/>
                    <PerspectiveMenuItem key="client-log" fullName="Histórico Cliente" shortName="Histór." shortcutKeys="cH"/>
                </MenuSection>,
                <MenuSection key="section1">
                    <PerspectiveMenuItem key="load-obs" fullName="Cargar observaciones" shortName="Observ." shortcutKeys="cO"/>
                    <PerspectiveMenuItem key="stock-deposit" fullName="Depósitos de Stock" shortName="Depós." shortcutKeys="cP"/>
                    <PerspectiveMenuItem key="stock-query" fullName="Interconsulta de Stock" shortName="Interc." shortcutKeys="cS"/>
                    <PerspectiveMenuItem key="load-temp" fullName="Rescata temporal" shortName="R.Tem." shortcutKeys="cT"/>
                    <PerspectiveMenuItem key="save-op" fullName="Guarda operación en curso de forma pendiente" shortName="G.Pend." shortcutKeys="aF10"/>
                    <PerspectiveMenuItem key="print-prev" fullName="Vista previa impresión" shortName="V.Impr." shortcutKeys="csP"/>
                    <PerspectiveMenuItem key="print-prev-temp" fullName="Vista previa impresión temporal" shortName="V.Tem." shortcutKeys="csT"/>
                </MenuSection>,
            ]}
        >
            <Layout key="horizontal0" orientation="horizontal">
                <Layout key="vertical0" orientation="vertical">
                    <TabbedViewContainer key="tabbed0">
                        <View key="items" name="Items" className="items" shortcutKeys="cI" actions={[]} focused={true} maximized={false}>
                            Items
                        </View>
                    </TabbedViewContainer>
                    <TabbedViewContainer key="tabbed1">
                        <View key="file" name="Ficha" className="file" shortcutKeys="F5" actions={[]} focused={false} maximized={false}>
                            Ficha
                        </View>
                        <View key="icons" name="Íconos" className="icons" shortcutKeys="F6" actions={[]} focused={false} maximized={false}>
                            Íconos
                        </View>
                        <View key="clients" name="Clientes" className="clients" shortcutKeys="F7" actions={[]} focused={true} maximized={false}>
                            Clientes
                        </View>
                        <View key="agreements" name="Convenios" className="agreements" shortcutKeys="F8" actions={[]} focused={false} maximized={false}>
                            Convenios
                        </View>
                    </TabbedViewContainer>
                </Layout>
                <Layout key="vertical1" orientation="vertical">
                    <TabbedViewContainer key="tabbed0">
                        <View key="payments" name="Pagos" className="payments" shortcutKeys="F9" actions={[]} focused={true} maximized={false}>
                            Pagos
                        </View>
                    </TabbedViewContainer>
                    <TabbedViewContainer key="tabbed1">
                        <View key="news" name="Noticias" className="news" shortcutKeys="cN" actions={[]} focused={true} maximized={false}>
                            Noticias
                        </View>
                        <View key="assistant" name="Asistente" className="assistant" shortcutKeys="cA" actions={[]} focused={false} maximized={false}>
                            Asistente
                        </View>
                    </TabbedViewContainer>
                </Layout>
            </Layout>
        </Perspective>
    );
};
