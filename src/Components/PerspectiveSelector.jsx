import {PureComponent} from 'react';

import './PerspectiveSelector.scss';

export default class PerspectiveSelector extends PureComponent {
    render() {
        const label = this.props.label;
        return (
            <div className="perspective-selector" title="Lista todas las funciones habilitadas para la lista activa.">
                <div className="label">{label}</div>
                <div className="shortcut">F1</div>
            </div>
        );
    }
};
