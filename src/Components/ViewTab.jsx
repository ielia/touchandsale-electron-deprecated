import React from 'react';

import './ViewTab.scss';

export default class ViewTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handleFocus() {
    }

    render() {
        const {label, shortcutKeys, zIndex, selected} = this.props;
        return (
            <div className={`view-tab${selected ? ' selected' : ''}`} tabIndex={selected ? 1 : -1} style={{zIndex}}>
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
