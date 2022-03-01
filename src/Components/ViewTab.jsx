import {PureComponent} from 'react';

import './ViewTab.scss';

export default class ViewTab extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleClick() {
        const {onSelected, viewId} = this.props;
        console.log('handleClick viewId:', viewId);
        onSelected(viewId);
    }

    handleKeyDown(event) {
        const {onSelected, viewId} = this.props;
        console.log('handleKeyDown:', event, 'viewId:', viewId);
        if (event.key === ' ' || event.key === '\n') {
            onSelected(viewId);
        }
    }

    render() {
        const {label, shortcutKeys, zIndex, selected} = this.props;
        return (
            <div className={`view-tab${selected ? ' selected' : ''}`} tabIndex={selected ? 1 : -1} style={{zIndex}} onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
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
