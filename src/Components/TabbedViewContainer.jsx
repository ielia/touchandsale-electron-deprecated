import {Children, PureComponent} from 'react';

import './TabbedViewContainer.scss';
import ViewTab from './ViewTab';

export default class TabbedViewContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.handleViewSelection = this.handleViewSelection.bind(this);
    }

    handleViewSelection(viewKey) {
        const {onViewSelected, containerId} = this.props;
        console.log('handleViewSelection:', viewKey, 'containerId:', containerId);
        onViewSelected(containerId, viewKey);
    }

    render() {
        const {children, selectedViewKey} = this.props;
        return (
            <div className="tabbed-view-container">
                <div className="tabbed-top">
                    <div className="tabs">
                        {Children.map(children, (child, index) =>
                            <ViewTab
                                key={child.props.viewId}
                                actions={child.props.actions}
                                label={child.props.label}
                                selected={child.key === selectedViewKey}
                                shortcutKeys={child.props.shortcutKeys}
                                viewId={child.props.viewId}
                                zIndex={(Children.count(children) ?? 0) - index}
                                onSelected={this.handleViewSelection}
                            />
                        )}
                    </div>
                </div>
                <div className="tabbed-view-content">
                    <div className="tab-content" tabIndex="1">
                        {Children.map(children, child => child.key === selectedViewKey ? child : null).find(child => child) /* horrid patch to use 'find' */}
                    </div>
                </div>
            </div>
        );
    }
};
