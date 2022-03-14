import Color from 'color';
import React, {PureComponent} from 'react';

import './_ViewIcon.scss';

import {appendShortcutString, isShortcutKeyPressed, shortcutKeyToShortString} from '../commons';

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
        this.handleShortcutKey = this.handleShortcutKey.bind(this);
    }

    handleClick() {
        const {onClick, viewId} = this.props;
        onClick(viewId);
    }

    handleShortcutKey(event: KeyboardEvent) {
        if (isShortcutKeyPressed(event, this.props.shortcutKey)) {
            this.handleClick();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    componentDidMount() {
        const {shortcutKey, viewId} = this.props;
        if (shortcutKey && viewId) {
            document.addEventListener('keydown', this.handleShortcutKey);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleShortcutKey);
    }

    render() {
        const {className, color, label, selected, shortcutKey, title} = this.props;
        const fullTitle = appendShortcutString(title, shortcutKey);
        return (
            <div className={`view-icon ${selected ? 'selected' : ''} ${className ?? ''}`} tabIndex={0} title={fullTitle} onClick={this.handleClick} onTouchEnd={this.handleClick}>
                <div className="view-icon-label">{label}</div>
                <div className="view-icon-shortcut" style={{backgroundColor: color.hexa()}}>{shortcutKeyToShortString(shortcutKey)}</div>
            </div>
        );
    }
};
