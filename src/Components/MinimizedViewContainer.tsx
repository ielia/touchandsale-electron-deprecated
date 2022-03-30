import React, {ReactElement} from 'react';

import './_MinimizedViewContainer.scss';

import BaseRestoreButton from './RestoreButton';
import BaseMenuSection, {Props as BaseMenuSectionProps} from './MenuSection';
import BaseView from './View';
import BaseViewIcon from './ViewIcon';
import getBrandedComponent from './branding';
const RestoreButton = getBrandedComponent<InstanceType<typeof BaseRestoreButton>>('RestoreButton') as typeof BaseRestoreButton;
const MenuSection = getBrandedComponent<InstanceType<typeof BaseMenuSection>>('MenuSection') as typeof BaseMenuSection;
const ViewIcon = getBrandedComponent<InstanceType<typeof BaseViewIcon>>('ViewIcon') as typeof BaseViewIcon;

export type Props<V extends BaseView = BaseView> = BaseMenuSectionProps & {
    children: ReactElement<V> | ReactElement<V>[];
    onRestore: (sectionId: string) => void;
    onViewSelected: (sectionId: string, viewId: string) => void;
    open?: boolean;
    selectedView: string;
};

export default class MinimizedViewContainer<V extends BaseView = BaseView> extends MenuSection<BaseView, Props<V>> {
    static defaultProps = {
        type: 'view-container',
    };

    constructor(props: Props<V>) {
        super(props);

        this.handleRestoreButtonClick = this.handleRestoreButtonClick.bind(this);
        this.handleViewSelection = this.handleViewSelection.bind(this);
    }

    buildContent(): ReactElement {
        const {children, selectedView} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        return (<>
            <RestoreButton onClick={this.handleRestoreButtonClick}/>
            {childArray.map(({props: {color, iconLabel, label, shortcutKey, viewId}}) => (
                <ViewIcon key={viewId} viewId={viewId} color={color} label={iconLabel} selected={viewId === selectedView} shortcutKey={shortcutKey} title={label} onClick={this.handleViewSelection}/>
            ))}
        </>);
    }

    getMainClassName(): string {
        const {className, open} = this.props;
        return `minimized-view-container menu-section ${open ? 'open' : ''} ${className ?? ''}`;
    }

    handleRestoreButtonClick(): void {
        const {onRestore, sectionId} = this.props;
        onRestore(sectionId);
    }

    handleViewSelection(viewId: string): void {
        const {sectionId, onViewSelected} = this.props;
        onViewSelected(sectionId, viewId);
    }
};
