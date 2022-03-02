import React, {PureComponent} from 'react';

import './PerspectiveSelector.scss';

interface Props {
    label: string;
}

export default class PerspectiveSelector extends PureComponent<Props> {
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
