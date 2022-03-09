import React, {PureComponent} from 'react';

import './PerspectiveMenuItem.scss';
import {shortcutKeyToString} from '../commons';

interface Props {
    label: string;
    shortcutKey: ShortcutKey;
    title: string;
}

export default class PerspectiveMenuItem extends PureComponent<Props> {
    render() {
        const {label, shortcutKey, title} = this.props;
        return (
            <button className="perspective-menu-item" title={title}>
                <div className="label">{label}</div>
                <div className="shortcut">{shortcutKeyToString(shortcutKey)}</div>
            </button>
        );
    }
};
