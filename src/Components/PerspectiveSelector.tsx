import Color from 'color';
import React, {PureComponent} from 'react';

import './_PerspectiveSelector.scss';

interface Props {
    accentColor: Color;
    label: string;
}

export default class PerspectiveSelector extends PureComponent<Props> {
    render() {
        const {accentColor, label} = this.props;
        return (
            <div className="perspective-selector" title="Lista todas las funciones habilitadas para la lista activa." style={{backgroundColor: accentColor.hexa()}}>
                <div className="label">{label}</div>
                <div className="shortcut">F1</div>
            </div>
        );
    }
};
