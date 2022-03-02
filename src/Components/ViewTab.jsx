import {PureComponent, createRef} from 'react';

import './ViewTab.scss';
import {shortcutKeyToString} from '../commons';

export default class ViewTab extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleShortcutKey = this.handleShortcutKey.bind(this);
        this.selfRef = createRef();
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

    handleClick() {
        const {onSelected, viewId} = this.props;
        onSelected(viewId);
    }

    handleKeyDown(event) {
        const key = event.key;
        const {onSelected, viewId} = this.props;
        if (key === ' ' || key === 'Enter') {
            onSelected(viewId);
        } else if (['ArrowLeft', 'ArrowRight', 'Left', 'Right'].indexOf(key) >= 0) {
            const current = this.selfRef.current;
            const sibling = (key === 'ArrowLeft' || key === 'Left') ? current.previousSibling : current.nextSibling;
            if (sibling) {
                sibling.focus();
            }
        }
    }

    handleShortcutKey(event) {
        const {onSelected, shortcutKey, viewId} = this.props;
        // TODO: See what to do with the metaKey.
        if (event.key.toUpperCase() === shortcutKey.key.toUpperCase()
            && !!event.altKey === !!shortcutKey.altKey
            && !!event.ctrlKey === !!shortcutKey.ctrlKey
            && !!event.metaKey === !!shortcutKey.metaKey
            && !!event.shiftKey === !!shortcutKey.shiftKey
        ) {
            this.selfRef.current.focus();
            onSelected(viewId);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render() {
        const {label, selected, shortcutKey, zIndex} = this.props;
        return (
            <div className={`view-tab${selected ? ' selected' : ''}`} tabIndex={selected ? 1 : -1} style={{zIndex}} onClick={this.handleClick} onKeyDown={this.handleKeyDown} ref={this.selfRef}>
                <div className="outline">
                    <div className="label">{label}</div>
                    <div className="shortcut">{shortcutKeyToString(shortcutKey)}</div>
                </div>
                <svg className="selection-tail" viewBox="0 0 100 100">
                    <path className="shape" d="M 0 0 C 25 0, 75 100, 100 100 H 100 0 Z"/>
                    <path className="line" d="M 0 0 C 25 0, 75 100, 100 100" fill="transparent" strokeWidth="2"/>
                </svg>
            </div>
        );
    }
};
