import React from 'react';

import './App.scss';
import SalesPerspective from './Components/modules/SalesPerspective';

export default function App() {
    // ====
    // Items [cI] => "0/0    Venta con factura B (ELE)" => Inser. ["+" insert] Insertar línea | Supr. ["<-" backspace] Suprimir línea | (lupa) [F4] Buscar por filtro | (???) [cl?] Activar prototipos | (???) [cM] Activar prototipos comprobante
    // ----
    // Ficha [F5]
    // Íconos [F6]
    // Clientes [F7]
    // Convenios [F8] => Rec.B. [F4] Recetas Beneficiario | V.Rec. [cF4] Consulta Receta
    // ====
    // Pagos [F9] => (flechas abajo+derecha?) [cU] ??? | (???) [cM] ??? | (prohibido) [cR] ???
    // ----
    // Noticias [cN]
    // Asistente [cA] => filters
    // ===
    return (
        <div className="app">
            <SalesPerspective/>
            {/*<Perspective label="Caja" className="Checkout" shortcutKey="aJ" color="#ea7c0e" actions={[]}/>*/}
            {/*<Perspective label="Expedición" className="Issuance" shortcutKey="aE" color="#744f81" actions={[]}/>*/}
            {/*<Perspective label="Compras" className="Purchases" shortcutKey="aC" color="#80a414" actions={[]}/>*/}
            {/*<Perspective label="Stock" className="Stock" shortcutKey="aS" color="#ac7851" actions={[]}/>*/}
            {/*<Perspective label="T&SWeb" className="TnSWeb" shortcutKey="aZ" color="#98bf01" actions={[]}/>*/}
            {/*<Perspective label="WWW" className="WWW" shortcutKey="aW" color="#257b76" actions={[]}/>*/}
            {/*<Perspective label="Ing/Egr Pers." className="Personnel" shortcutKey="aI" color="#797344" actions={[]}/>*/}
            {/*<Perspective label="Mensajería" className="Messaging" shortcutKey="aM" color="#d9b00c" actions={[]}/>*/}
            {/*<Perspective label="Impresiones" className="Printing" shortcutKey="aP" color="#5c5c5b" actions={[]}/>*/}
            {/*<Perspective label="ECF" className="ECF" shortcutKey="aP" color="#5c5c5b" actions={[]}/>*/}
            {/*<Perspective label="Servicios Web" className="WebServices" shortcutKey="aK" color="#42506e" actions={[]}/>*/}
            {/*<Perspective label="Trazabilidad" className="Auditing" shortcutKey="aT" color="#70a07a" actions={[]}/>*/}
            {/*<Perspective label="Symmetric" className="Symmetric" shortcutKey="aY" color="#972953" actions={[]}/>*/}
            {/*<Perspective label="Autoconsulta" className="SelfConsultation" shortcutKey="aA" color="#d071ac" actions={[]}/>*/}
            {/*<Perspective label="Productos" className="Products" shortcutKey="aR" color="#934c7c" actions={[]}/>*/}
            {/*<Perspective label="Imagen" className="Image" shortcutKey="aN" color="#c90017" actions={[]}/>*/}
        </div>
    );
};
