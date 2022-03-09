import React, {PureComponent} from 'react';

import './ViewIcon.scss';
import {appendShortcutString, shortcutKeyToShortString} from '../commons';

interface Props {
    className?: string;
    label?: string;
    shortcutKey?: ShortcutKey;
    title: string;
}

export default class ViewIcon extends PureComponent<Props> {
    render() {
        const {className, label, shortcutKey, title} = this.props;
        const fullTitle = appendShortcutString(title, shortcutKey);
        return (
            <div className={`view-icon ${className}`} title={fullTitle}>
                <div className="view-icon-label">{label}</div>
                <div className="view-icon-shortcut">{shortcutKeyToShortString(shortcutKey)}</div>
            </div>
        );
    }
}
