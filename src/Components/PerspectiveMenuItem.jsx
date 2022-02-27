import React from 'react';

import './PerspectiveMenuItem.scss';

export default function PerspectiveMenuItem({fullName, shortName, shortcutKeys}) {
    return (
        <div className="perspective-menu-item" title={fullName}>
            <div className="name">{shortName}</div>
            <div className="shortcut">{shortcutKeys}</div>
        </div>
    );
};
