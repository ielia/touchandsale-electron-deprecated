import React from 'react';

import './TabbedViewContainer.scss';
import ViewTab from './ViewTab';

export default function TabbedViewContainer({children}) {
    return (
        <div className="tabbed-view-container">
            <div className="tabbed-top">
                <div className="tabs">
                    {React.Children.map(children, (child, index) =>
                        <ViewTab
                            key={child.key}
                            label={child.props.label}
                            shortcutKeys={child.props.shortcutKeys}
                            actions={child.props.actions}
                            zIndex={(children.length ?? 0) - index}
                            selected={child.props.selected}
                        />
                    )}
                </div>
            </div>
            <div className="content">
                {React.Children.toArray(children).filter(child => child.props.selected)}
            </div>
        </div>
    );
};
