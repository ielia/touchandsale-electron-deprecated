import React from 'react';

import './TabbedViewContainer.scss';
import ViewTab from './ViewTab';

export default function TabbedViewContainer({children}) {
    return (
        <div className="tabbed-view-container">
            <div className="tabbed-top">
                <div className="tabs">
                    {React.Children.map(children, child =>
                        <ViewTab
                            key={child.key}
                            name={child.props.name}
                            shortcutKeys={child.props.shortcutKeys}
                            actions={child.props.actions}
                            focused={child.props.focused}
                        />
                    )}
                </div>
            </div>
            <div className="content">
                {React.Children.toArray(children).filter(child => child.props.focused)}
            </div>
        </div>
    );
};
