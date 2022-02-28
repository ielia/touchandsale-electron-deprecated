import {RecoilRoot} from 'recoil';

import './App.css';
import SalesPerspective from './Components/modules/SalesPerspective';

export default function App() {
    return (
        <RecoilRoot>
            <div className="app">
                <SalesPerspective/>
                {/*<Perspective label="Caja" className="Checkout" shortcutKeys="aJ" color="#ea7c0e" actions={[]}/>*/}
                {/*<Perspective label="Expedición" className="Issuance" shortcutKeys="aE" color="#744f81" actions={[]}/>*/}
                {/*<Perspective label="Compras" className="Purchases" shortcutKeys="aC" color="#80a414" actions={[]}/>*/}
                {/*<Perspective label="Stock" className="Stock" shortcutKeys="aS" color="#ac7851" actions={[]}/>*/}
                {/*<Perspective label="T&SWeb" className="TnSWeb" shortcutKeys="aZ" color="#98bf01" actions={[]}/>*/}
                {/*<Perspective label="WWW" className="WWW" shortcutKeys="aW" color="#257b76" actions={[]}/>*/}
                {/*<Perspective label="Ing/Egr Pers." className="Personnel" shortcutKeys="aI" color="#797344" actions={[]}/>*/}
                {/*<Perspective label="Mensajería" className="Messaging" shortcutKeys="aM" color="#d9b00c" actions={[]}/>*/}
                {/*<Perspective label="Impresiones" className="Printing" shortcutKeys="aP" color="#5c5c5b" actions={[]}/>*/}
                {/*<Perspective label="ECF" className="ECF" shortcutKeys="aP" color="#5c5c5b" actions={[]}/>*/}
                {/*<Perspective label="Servicios Web" className="WebServices" shortcutKeys="aK" color="#42506e" actions={[]}/>*/}
                {/*<Perspective label="Trazabilidad" className="Auditing" shortcutKeys="aT" color="#70a07a" actions={[]}/>*/}
                {/*<Perspective label="Symmetric" className="Symmetric" shortcutKeys="aY" color="#972953" actions={[]}/>*/}
                {/*<Perspective label="Autoconsulta" className="SelfConsultation" shortcutKeys="aA" color="#d071ac" actions={[]}/>*/}
                {/*<Perspective label="Productos" className="Products" shortcutKeys="aR" color="#934c7c" actions={[]}/>*/}
                {/*<Perspective label="Imagen" className="Image" shortcutKeys="aN" color="#c90017" actions={[]}/>*/}
            </div>
        </RecoilRoot>
    );
};
