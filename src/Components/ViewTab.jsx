import {PureComponent, createRef} from 'react';

import './ViewTab.scss';

export default class ViewTab extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.selfRef = createRef();
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
            const sibling = (key === 'ArrowLeft' || key === 'Left')
                ? this.selfRef.current.previousSibling
                : this.selfRef.current.nextSibling;
            if (sibling) {
                sibling.focus();
            }
        }
    }

    render() {
        const {label, shortcutKeys, zIndex, selected} = this.props;
        return (
            <div className={`view-tab${selected ? ' selected' : ''}`} tabIndex={1} style={{zIndex}} onClick={this.handleClick} onKeyDown={this.handleKeyDown} ref={this.selfRef}>
                <div className="outline">
                    <div className="label">{label}</div>
                    <div className="shortcut">{shortcutKeys}</div>
                </div>
                <svg className="selection-tail" viewBox="0 0 100 100">
                    <path className="shape" d="M 0 0 C 25 0, 75 100, 100 100 H 100 0 Z"/>
                    <path className="line" d="M 0 0 C 25 0, 75 100, 100 100" fill="transparent" strokeWidth="2"/>
                </svg>
            </div>
        );
    }
};
