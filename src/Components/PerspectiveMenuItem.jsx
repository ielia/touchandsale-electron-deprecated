import {PureComponent} from 'react';

import './PerspectiveMenuItem.scss';

export default class PerspectiveMenuItem extends PureComponent {
    render() {
        const {title, label, shortcutKeys} = this.props;
        return (
            <button className="perspective-menu-item" title={title}>
                <div className="label">{label}</div>
                <div className="shortcut">{shortcutKeys}</div>
            </button>
        );
    }
};
