import React from 'react';

export default function View({label, className, shortcutKeys, actions, selected, maximized, children}) {
    return (
        <div className="className">
            {children}
        </div>
    );
};
