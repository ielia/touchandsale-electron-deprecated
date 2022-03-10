import Color from 'color';
import React, {PureComponent} from 'react';

import './_PerspectiveMenuItem.scss';
import {appendShortcutString, shortcutKeyToShortString} from '../commons';

interface Props {
    accentColor: Color;
    label: string;
    shortcutKey: ShortcutKey;
    title: string;
}

export default class PerspectiveMenuItem extends PureComponent<Props> {
    render() {
        const {accentColor, label, shortcutKey, title} = this.props;
        const fullTitle = appendShortcutString(title, shortcutKey);
        return (
            <button className="perspective-menu-item" title={fullTitle}>
                <div className="label">{label}</div>
                <div className="shortcut" style={{backgroundColor: accentColor.hexa()}}>{shortcutKeyToShortString(shortcutKey)}</div>
            </button>
        );
    }
};
