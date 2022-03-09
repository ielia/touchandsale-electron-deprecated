import React, {Children, PureComponent, ReactElement} from 'react';
// TODO: Change these icons
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';
import WindowIcon from '@mui/icons-material/Window';

import './TabbedViewContainer.scss';
import View from './View';
import ViewTab from './ViewTab';

interface Props {
    children: ReactElement<View> | ReactElement<View>[];
    containerId: string;
    onMaximize: (containerId: string) => any;
    onMinimize: (containerId: string) => any;
    onRestore: (containerId: string) => any;
    onViewSelected: (containerId: string, viewId: string) => any;
    selectedViewId: string;
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
        const {children, selectedViewId} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        const childrenCount = Children.count(childArray);
        const indexOfSelected = childArray.findIndex(child => child.props.viewId === selectedViewId);
        const selectedChild = childArray[indexOfSelected] as ReactElement;
        return (
            <div className="tabbed-view-container">
                <div className="tabbed-top">
                    <div className="tabs">
                        {childArray.map((child, index) =>
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
                    <div className="actions">&nbsp;</div>
                    <div className="decorations">
                        <MinimizeIcon onClick={this.handleMinimization}/>
                        {selectedChild.props.maximized ? <WindowIcon onClick={this.handleRestore}/> : <MaximizeIcon onClick={this.handleMaximization}/>}
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
