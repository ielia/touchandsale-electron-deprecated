import React, {PureComponent} from 'react';

import './PerspectiveMenuItem.scss';
import {appendShortcutString, shortcutKeyToShortString} from '../commons';

interface Props {
    label: string;
    shortcutKey: ShortcutKey;
    title: string;
}

export default class PerspectiveMenuItem extends PureComponent<Props> {
    render() {
        const {label, shortcutKey, title} = this.props;
        const fullTitle = appendShortcutString(title, shortcutKey);
        return (
            <button className="perspective-menu-item" title={fullTitle}>
                <div className="label">{label}</div>
                <div className="shortcut">{shortcutKeyToShortString(shortcutKey)}</div>
            </button>
        );
    }
};
