import React from 'react';

import './TabbedViewContainer.scss';
import ViewTab from './ViewTab';

export default function TabbedViewContainer({selectedViewKey, children}) {
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
                            selected={child.key === selectedViewKey}
                        />
                    )}
                </div>
            </div>
            <div className="tabbed-view-content">
                <div className="tab-content" tabIndex="1">
                    {React.Children.map(children, child => child.key === selectedViewKey ? child : null).find(child => child) /* horrid patch to use 'find' */}
                </div>
            </div>
        </div>
    );
};
