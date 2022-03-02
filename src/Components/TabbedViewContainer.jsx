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
        onViewSelected(containerId, viewKey);
    }

    render() {
        const {children, selectedViewKey} = this.props;
        const childrenCount = Children.count(children);
        // Horrid patch to find a child without using 'toArray' that contextualise keys:
        const indexOfSelected = Children.map(children, (child, index) => child.props.viewId === selectedViewKey ? index : null).find(i => i !== null);
        return (
            <div className="tabbed-view-container">
                <div className="tabbed-top">
                    <div className="tabs">
                        {Children.map(children, (child, index) =>
                            <ViewTab
                                key={child.props.viewId}
                                actions={child.props.actions}
                                label={child.props.label}
                                selected={index === indexOfSelected}
                                shortcutKey={child.props.shortcutKey}
                                viewId={child.props.viewId}
                                zIndex={index < indexOfSelected ? index : index === indexOfSelected ? childrenCount : childrenCount - index + indexOfSelected}
                                onSelected={this.handleViewSelection}
                            />
                        )}
                    </div>
                </div>
                <div className="tabbed-view-content">
                    <div className="tab-content" tabIndex="1">
                        {children[indexOfSelected]}
                    </div>
                </div>
            </div>
        );
    }
};
