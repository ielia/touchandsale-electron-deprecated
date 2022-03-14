import Color from 'color';
import React, {PureComponent} from 'react';

import './_ViewIcon.scss';

import {appendShortcutString, shortcutKeyToShortString} from '../commons';

interface Props {
    className?: string;
    color: Color;
    label?: string;
    onClick: (viewId: string) => any;
    selected?: boolean;
    shortcutKey?: ShortcutKey;
    title: string;
    viewId: string;
}

export default class ViewIcon extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {onClick, viewId} = this.props;
        onClick(viewId);
    }

    render() {
        const {className, color, label, selected, shortcutKey, title} = this.props;
        const fullTitle = appendShortcutString(title, shortcutKey);
        return (
            <div className={`view-icon ${selected ? 'selected' : ''} ${className ?? ''}`} title={fullTitle} onClick={this.handleClick} onTouchEnd={this.handleClick}>
                <div className="view-icon-label">{label}</div>
                <div className="view-icon-shortcut" style={{backgroundColor: color.hexa()}}>{shortcutKeyToShortString(shortcutKey)}</div>
            </div>
        );
    }
};
