import React from 'react';

import './MenuSection.scss';

export default function MenuSection({children}) {
    return (
        <div className="menu-section">
            <div className="handle">...</div>
            {children}
        </div>
    );
};
