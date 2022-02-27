import React from 'react';

export default function ViewTab({label, shortcutKeys, actions, focused}) {
    return (
        <div className={`view-tab${focused ? ' focused' : ''}`}>
            <div className="outline">
                <div className="label">{label}</div>
                <div className="shortcut">{shortcutKeys}</div>
            </div>
            <svg className="selection-tail" viewBox="0 0 100 100">
                <path className="line" d="M 0 0 C 25 0, 75 100, 100 100" fill="transparent" stroke="black" strokeWidth="2"/>
            </svg>
        </div>
    );
};
