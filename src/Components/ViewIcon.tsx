import React, {PureComponent} from 'react';

import './ViewIcon.scss';
import {shortcutKeyToString} from '../commons';

interface Props {
    className?: string;
    label?: string;
    shortcutKey?: ShortcutKey;
    title: string;
}

export default class ViewIcon extends PureComponent<Props> {
    render() {
        const {className, label, shortcutKey, title} = this.props;
        return (
            <div className={`view-icon ${className}`} title={title}>
                <div className="view-icon-label">{label}</div>
                <div className="view-icon-shortcut">{shortcutKeyToString(shortcutKey)}</div>
            </div>
        );
    }
}
