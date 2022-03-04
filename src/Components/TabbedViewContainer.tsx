import React, {Children, PureComponent} from 'react';
// TODO: Change these icons
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';
import WindowIcon from '@mui/icons-material/Window';

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
        this.handleMaximization = this.handleMaximization.bind(this);
        this.handleMinimization = this.handleMinimization.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
    }

    handleMaximization() {
        console.log('maximize');
    }

    handleMinimization() {
        console.log('minimize')
    }

    handleRestore() {
        console.log('restore');
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
        const selectedChild = children[indexOfSelected] as React.ReactElement;
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
                    <div className="actions"/>
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
