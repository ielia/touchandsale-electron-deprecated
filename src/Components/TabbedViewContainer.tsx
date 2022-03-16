import React, {createRef, LegacyRef, PureComponent, ReactElement} from 'react';

import './_TabbedViewContainer.scss';

import BaseMaximizeButton from './MaximizeButton';
import BaseMinimizeButton from './MinimizeButton';
import BaseRestoreButton from './RestoreButton';
import BaseView from './View';
import BaseViewTab from './ViewTab';
import getBrandedComponent from './branding';
const MaximizeButton = getBrandedComponent<BaseMaximizeButton>('MaximizeButton') as typeof BaseMaximizeButton;
const MinimizeButton = getBrandedComponent<BaseMinimizeButton>('MinimizeButton') as typeof BaseMinimizeButton;
const RestoreButton = getBrandedComponent<BaseRestoreButton>('RestoreButton') as typeof BaseRestoreButton;
// const View = getBrandedComponent<BaseView>('View') as typeof BaseView;
const ViewTab = getBrandedComponent<BaseViewTab>('ViewTab') as typeof BaseViewTab;

export interface Props {
    children: ReactElement<BaseView> | ReactElement<BaseView>[];
    containerId: string;
    focused?: boolean;
    onMaximize: (containerId: string) => any;
    onMinimize: (containerId: string) => any;
    onRestore: (containerId: string) => any;
    onViewSelected: (containerId: string, viewId: string) => any;
    selectedViewId: string;
    state: ViewContainerStateOrFloating;
}

export default class TabbedViewContainer extends PureComponent<Props> {
    selectedTabRef: LegacyRef<typeof ViewTab>;

    constructor(props: Props) {
        super(props);

        this.handleMaximization = this.handleMaximization.bind(this);
        this.handleMinimization = this.handleMinimization.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
        this.selectedTabRef = createRef();
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
        const {children, focused, selectedViewId, state} = this.props;
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
                                focused={focused && index === indexOfSelected}
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
                        {state === 'normal' || state === 'maximized' ? <MinimizeButton onClick={this.handleMinimization}/> : null}
                        {state === 'normal' ? <MaximizeButton onClick={this.handleMaximization}/> : <RestoreButton onClick={this.handleRestore}/>}
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
