import React, {ReactElement, RefObject} from 'react';

import './_MinimizedViewContainer.scss';

import BaseRestoreButton from './RestoreButton';
import BaseMenuSection, {Props as BaseMenuSectionProps} from './MenuSection';
import BaseView from './View';
import BaseViewIcon from './ViewIcon';
import getBrandedComponent from './branding';
const RestoreButton = getBrandedComponent<BaseRestoreButton>('RestoreButton') as typeof BaseRestoreButton;
const MenuSection = getBrandedComponent<BaseMenuSection>('MenuSection') as typeof BaseMenuSection;
const ViewIcon = getBrandedComponent<BaseViewIcon>('ViewIcon') as typeof BaseViewIcon;

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

    handleRestoreButtonClick(): void {
        const {onRestore, sectionId} = this.props;
        onRestore(sectionId);
    }

    handleViewSelection(viewId: string): void {
        const {sectionId, onViewSelected} = this.props;
        onViewSelected(sectionId, viewId);
    }

    render() {
        const {children, className, draggable = true, open, selectedView, wrapperRef} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        // What can one do if the component receives a ref to a more basic object? Cast it? Well, there it is below:
        const attrs = this.getContainerAttributes(`minimized-view-container ${open ? 'open' : ''} ${className ?? ''}`, draggable, wrapperRef as RefObject<HTMLDivElement>);
        return (
            <div {...attrs}>
                {this.buildDragHandle()}
                <RestoreButton onClick={this.handleRestoreButtonClick}/>
                {childArray.map(({props: {color, iconLabel, label, shortcutKey, viewId}}) => (
                    <ViewIcon key={viewId} viewId={viewId} color={color} label={iconLabel} selected={viewId === selectedView} shortcutKey={shortcutKey} title={label} onClick={this.handleViewSelection}/>
                ))}
            </div>
        );
    }
};
