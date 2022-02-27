import React from 'react';

export default function View({label, className, shortcutKeys, actions, focused, maximized, children}) {
    return (
        <div className="className">
            {children}
        </div>
    );
};
