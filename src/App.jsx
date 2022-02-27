import { RecoilRoot } from 'recoil';
// import logo from './logo.svg';
import './App.css';
import SalesPerspective from './Components/modules/SalesPerspective';

function App() {
    return (
        <RecoilRoot>
            <div className="app">
                <SalesPerspective/>
                {/*<Perspective name="Caja" className="Checkout" shortcutKeys="aJ" color="#ea7c0e" actions={[]}/>*/}
                {/*<Perspective name="Expedición" className="Issuance" shortcutKeys="aE" color="#744f81" actions={[]}/>*/}
                {/*<Perspective name="Compras" className="Purchases" shortcutKeys="aC" color="#80a414" actions={[]}/>*/}
                {/*<Perspective name="Stock" className="Stock" shortcutKeys="aS" color="#ac7851" actions={[]}/>*/}
                {/*<Perspective name="T&SWeb" className="TnSWeb" shortcutKeys="aZ" color="#98bf01" actions={[]}/>*/}
                {/*<Perspective name="WWW" className="WWW" shortcutKeys="aW" color="#257b76" actions={[]}/>*/}
                {/*<Perspective name="Ing/Egr Pers." className="Personnel" shortcutKeys="aI" color="#797344" actions={[]}/>*/}
                {/*<Perspective name="Mensajería" className="Messaging" shortcutKeys="aM" color="#d9b00c" actions={[]}/>*/}
                {/*<Perspective name="Impresiones" className="Printing" shortcutKeys="aP" color="#5c5c5b" actions={[]}/>*/}
                {/*<Perspective name="ECF" className="ECF" shortcutKeys="aP" color="#5c5c5b" actions={[]}/>*/}
                {/*<Perspective name="Servicios Web" className="WebServices" shortcutKeys="aK" color="#42506e" actions={[]}/>*/}
                {/*<Perspective name="Trazabilidad" className="Auditing" shortcutKeys="aT" color="#70a07a" actions={[]}/>*/}
                {/*<Perspective name="Symmetric" className="Symmetric" shortcutKeys="aY" color="#972953" actions={[]}/>*/}
                {/*<Perspective name="Autoconsulta" className="SelfConsultation" shortcutKeys="aA" color="#d071ac" actions={[]}/>*/}
                {/*<Perspective name="Productos" className="Products" shortcutKeys="aR" color="#934c7c" actions={[]}/>*/}
                {/*<Perspective name="Imagen" className="Image" shortcutKeys="aN" color="#c90017" actions={[]}/>*/}
            </div>
        </RecoilRoot>
    );
}

export default App;
