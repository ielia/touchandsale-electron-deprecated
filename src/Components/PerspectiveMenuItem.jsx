import React from 'react';

import './PerspectiveMenuItem.scss';

export default function PerspectiveMenuItem({title, label, shortcutKeys}) {
    return (
        <button className="perspective-menu-item" title={title}>
            <div className="label">{label}</div>
            <div className="shortcut">{shortcutKeys}</div>
        </button>
    );
};
