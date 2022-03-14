import Color from 'color';
import React, {PureComponent, RefObject, createRef} from 'react';

import {appendShortcutString, isShortcutKeyPressed, shortcutKeyToShortString} from '../commons';

interface Props {
    actions: any; // TODO: See what to do with these actions.
    color: Color;
    focused?: boolean;
    label: string;
    onSelected: (viewId: string) => void;
    selected?: boolean;
    shortcutKey?: ShortcutKey;
    viewId: string;
    zIndex?: number;
}
export {Props};

export default abstract class ViewTab extends PureComponent<Props> {
    selfRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleShortcutKey = this.handleShortcutKey.bind(this);
        this.selfRef = createRef();
    }

    handleClick() {
        const {onSelected, viewId} = this.props;
        onSelected(viewId);
    }

    handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        const key = event.key;
        const {onSelected, viewId} = this.props;
        if (key === ' ' || key === 'Enter') {
            onSelected(viewId);
        } else if (['ArrowLeft', 'ArrowRight', 'Left', 'Right'].indexOf(key) >= 0) {
            const selfElement = this.selfRef.current;
            const sibling = (key === 'ArrowLeft' || key === 'Left') ? selfElement.previousElementSibling : selfElement.nextElementSibling;
            if (sibling) {
                (sibling as HTMLElement).focus();
            }
        }
    }

    handleShortcutKey(event: KeyboardEvent) {
        const {onSelected, shortcutKey, viewId} = this.props;
        if (isShortcutKeyPressed(event, shortcutKey)) {
            this.selfRef.current.focus();
            onSelected(viewId);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    componentDidMount() {
        const {focused, shortcutKey, viewId} = this.props;
        if (shortcutKey && viewId) {
            document.addEventListener('keydown', this.handleShortcutKey);
        }
        if (focused) {
            this.selfRef.current.focus();
        }
    }

    componentDidUpdate() {
        if (this.props.focused) {
            this.selfRef.current.focus();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleShortcutKey);
    }

    render() {
        const {color, label, selected, shortcutKey, zIndex} = this.props;
        const title = appendShortcutString(label, shortcutKey);
        return (
            <div className={`view-tab ${selected ? 'selected' : ''}`} tabIndex={selected ? 1 : -1} style={{zIndex: `${zIndex}`}} title={title} onClick={this.handleClick}
                 onKeyDown={this.handleKeyDown} ref={this.selfRef}>
                <div className="outline">
                    <div className="label">{label}</div>
                    <div className="shortcut" style={{backgroundColor: color.hexa()}}>{shortcutKeyToShortString(shortcutKey)}</div>
                </div>
            </div>
        );
    }
};
