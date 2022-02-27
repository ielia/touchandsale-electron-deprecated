import React from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';

import './MenuSection.scss';

export default function MenuSection({children}) {
    return (
        <div className="menu-section">
            <DragIndicator className="handle"/>
            {children}
        </div>
    );
};
