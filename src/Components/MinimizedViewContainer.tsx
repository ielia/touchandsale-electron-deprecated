import React, {PureComponent, ReactElement} from 'react';

import './_MinimizedViewContainer.scss';

import BaseRestoreButton from './RestoreButton';
import MenuSection from './MenuSection';
import View from './View';
import ViewIcon from './ViewIcon';
import BrandedComponentFactory from './branding';
const EclipseRCPComponentFactory = BrandedComponentFactory('./brands/EclipseRCP');
const RestoreButton = EclipseRCPComponentFactory<BaseRestoreButton>('RestoreButton');

interface Props {
    children: ReactElement<View> | ReactElement<View>[];
    containerId: string;
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
        const {children, open, selectedView} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        return (
            <MenuSection className={`minimized-view-container ${open ? 'open' : ''}`}>
                <RestoreButton onClick={this.handleRestoreButtonClick}/>
                {childArray.map(({props: {color, iconLabel, label, shortcutKey, viewId}}) => (
                    <ViewIcon key={viewId} viewId={viewId} color={color} label={iconLabel} selected={viewId === selectedView} shortcutKey={shortcutKey} title={label} onClick={this.handleViewSelection}/>
                ))}
            </MenuSection>
        );
    }
};
