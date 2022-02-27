import React from 'react';

export default function Layout({children, orientation}) {
    return (
        <div className={`layout ${orientation}`}>
            {children}
        </div>
    );
}
