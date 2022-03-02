import React, {Children, PureComponent} from 'react';

import './TabbedViewContainer.scss';
import {ShortcutKey} from '../commons';
import ViewTab from './ViewTab';

interface Props {
    children: React.ReactNode[];
    containerId: string;
    onViewSelected: Function;
    selectedViewId: string;
}

export default class TabbedViewContainer extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.handleViewSelection = this.handleViewSelection.bind(this);
    }

    handleViewSelection(viewId: string) {
        const {onViewSelected, containerId} = this.props;
        onViewSelected(containerId, viewId);
    }

    render() {
        const {children, selectedViewId} = this.props;
        const childrenCount = Children.count(children);
        // Horrid patch to find a child without using 'toArray' that contextualise keys:
        const indexOfSelected = Children.map(children, (child: { props: { viewId: string } }, index) => child.props.viewId === selectedViewId ? index : null).find(i => i !== null);
        return (
            <div className="tabbed-view-container">
                <div className="tabbed-top">
                    <div className="tabs">
                        {Children.map(children, (child: { props: { actions: any, label: string, shortcutKey: ShortcutKey, viewId: string } }, index) =>
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
                    <div className="tab-content" tabIndex={1}>
                        {children[indexOfSelected]}
                    </div>
                </div>
            </div>
        );
    }
};
