import React from 'react';

import './Menu.scss';

export default function Menu({children}) {
    return (
        <div className="menu">
            {children}
        </div>
    );
}
