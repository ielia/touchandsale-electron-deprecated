import React, {PureComponent, ReactElement, RefObject} from 'react';

import './_MinimizedViewContainer.scss';

import BaseRestoreButton from './RestoreButton';
import BaseMenuSection from './MenuSection';
import BaseView from './View';
import BaseViewIcon from './ViewIcon';
import getBrandedComponent from './branding';
const RestoreButton = getBrandedComponent<BaseRestoreButton>('RestoreButton') as typeof BaseRestoreButton;
const MenuSection = getBrandedComponent<BaseMenuSection>('MenuSection') as typeof BaseMenuSection;
// const View = getBrandedComponent<BaseView>('View') as typeof BaseView;
const ViewIcon = getBrandedComponent<BaseViewIcon>('ViewIcon') as typeof BaseViewIcon;

export interface Props {
    children: ReactElement<BaseView> | ReactElement<BaseView>[];
    containerId: string;
    wrapperRef?: RefObject<HTMLElement>;
    onRestore: (containerId: string) => any;
    onViewSelected: (containerId: string, viewId: string) => any;
    open?: boolean;
    selectedView: string;
}

export default class MinimizedViewContainer extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);

        this.handleRestoreButtonClick = this.handleRestoreButtonClick.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
    }

    handleRestoreButtonClick(): void {
        this.props.onRestore(this.props.containerId);
    }

    handleViewSelection(viewId: string): void {
        const {containerId, onViewSelected} = this.props;
        onViewSelected(containerId, viewId);
    }

    render() {
        const {children, open, selectedView, wrapperRef} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        const wrapperRefAttr = wrapperRef ? {wrapperRef} : {};
        return (
            <MenuSection className={`minimized-view-container ${open ? 'open' : ''}`} {...wrapperRefAttr}>
                <RestoreButton onClick={this.handleRestoreButtonClick}/>
                {childArray.map(({props: {color, iconLabel, label, shortcutKey, viewId}}) => (
                    <ViewIcon key={viewId} viewId={viewId} color={color} label={iconLabel} selected={viewId === selectedView} shortcutKey={shortcutKey} title={label} onClick={this.handleViewSelection}/>
                ))}
            </MenuSection>
        );
    }
};
