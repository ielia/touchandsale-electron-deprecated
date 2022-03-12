import React, {PureComponent, ReactElement} from 'react';

import './_TabbedViewContainer.scss';
import BaseMaximizeButton from './MaximizeButton';
import BaseMinimizeButton from './MinimizeButton';
import BaseRestoreButton from './RestoreButton';
import View from './View';
import BaseViewTab from './ViewTab';
import BrandedComponentFactory from './branding';
const EclipseRCPComponentFactory = BrandedComponentFactory('./brands/EclipseRCP');
const MaximizeButton = EclipseRCPComponentFactory<BaseMaximizeButton>('MaximizeButton');
const MinimizeButton = EclipseRCPComponentFactory<BaseMinimizeButton>('MinimizeButton');
const RestoreButton = EclipseRCPComponentFactory<BaseRestoreButton>('RestoreButton');
const ViewTab = EclipseRCPComponentFactory<BaseViewTab>('ViewTab');

interface Props {
    children: ReactElement<View> | ReactElement<View>[];
    containerId: string;
    onMaximize: (containerId: string) => any;
    onMinimize: (containerId: string) => any;
    onRestore: (containerId: string) => any;
    onViewSelected: (containerId: string, viewId: string) => any;
    selectedViewId: string;
    state: ViewContainerState;
}

export default class TabbedViewContainer extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.handleMaximization = this.handleMaximization.bind(this);
        this.handleMinimization = this.handleMinimization.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
    }

    handleMaximization() {
        this.props.onMaximize(this.props.containerId);
    }

    handleMinimization() {
        this.props.onMinimize(this.props.containerId);
    }

    handleRestore() {
        this.props.onRestore(this.props.containerId);
    }

    handleViewSelection(viewId: string) {
        const {onViewSelected, containerId} = this.props;
        onViewSelected(containerId, viewId);
    }

    render() {
        const {children, selectedViewId, state} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        const childrenCount = childArray.length;
        const indexOfSelected = childArray.findIndex(child => child.props.viewId === selectedViewId);
        const selectedChild = childArray[indexOfSelected];
        return (
            <div className="tabbed-view-container">
                <div className="tabbed-top">
                    <div className="tabs">
                        {childArray.map((child, index) =>
                            <ViewTab
                                key={child.props.viewId}
                                actions={child.props.actions}
                                color={child.props.color}
                                label={child.props.label}
                                selected={index === indexOfSelected}
                                shortcutKey={child.props.shortcutKey}
                                viewId={child.props.viewId}
                                zIndex={index < indexOfSelected ? index : index === indexOfSelected ? childrenCount : childrenCount - index + indexOfSelected}
                                onSelected={this.handleViewSelection}
                            />
                        )}
                    </div>
                    <div className="actions">&nbsp;</div>
                    <div className="decorations">
                        <MinimizeButton onClick={this.handleMinimization}/>
                        {state === 'maximized' ? <RestoreButton onClick={this.handleRestore}/> : <MaximizeButton onClick={this.handleMaximization}/>}
                    </div>
                </div>
                <div className="tabbed-view-content">
                    <div className="tab-content" tabIndex={1}>
                        {selectedChild}
                    </div>
                </div>
            </div>
        );
    }
};
