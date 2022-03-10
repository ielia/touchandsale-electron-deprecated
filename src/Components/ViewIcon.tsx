import Color from 'color';
import React, {PureComponent} from 'react';

import './_ViewIcon.scss';
import {appendShortcutString, shortcutKeyToShortString} from '../commons';

interface Props {
    className?: string;
    color: Color;
    label?: string;
    shortcutKey?: ShortcutKey;
    title: string;
}

export default class ViewIcon extends PureComponent<Props> {
    render() {
        const {className, color, label, shortcutKey, title} = this.props;
        const fullTitle = appendShortcutString(title, shortcutKey);
        return (
            <div className={`view-icon ${className}`} title={fullTitle}>
                <div className="view-icon-label">{label}</div>
                <div className="view-icon-shortcut" style={{backgroundColor: color.hexa()}}>{shortcutKeyToShortString(shortcutKey)}</div>
            </div>
        );
    }
}
