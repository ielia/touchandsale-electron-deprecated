import React, {Component, DragEvent, PureComponent, ReactElement, RefObject} from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';

import './_MenuSection.scss';

export interface Props<C extends Component = Component> {
    className?: string;
    children: ReactElement<C> | ReactElement<C>[];
    draggable?: boolean;
    onDragStart?: (sectionId: string, type: string) => void;
    onDragEnd?: (sectionId: string, type: string) => void;
    sectionId: string;
    type?: string;
    wrapperRef?: RefObject<HTMLElement>;
}

export default class MenuSection<C extends Component = Component, P extends Props<C> = Props<C>> extends PureComponent<P> {
    static defaultProps = {
        type: 'menu-section',
    };

    constructor(props: P) {
        super(props);

        this.buildDragHandle = this.buildDragHandle.bind(this);
        this.getContainerAttributes = this.getContainerAttributes.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    buildDragHandle() {
        return (
            <DragIndicator className="handle" onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}/>
        );
    }

    getContainerAttributes<T>(className: string, draggable: boolean, wrapperRef: RefObject<T>) {
        const draggableAttr = draggable ? {draggable: true} : {};
        const wrapperRefAttr = wrapperRef ? {ref: wrapperRef} : {};
        return {className: `menu-section ${className ?? ''}`, ...draggableAttr, ...wrapperRefAttr};
    }

    handleDragStart(event: DragEvent<SVGElement>): void {
        const {onDragStart, sectionId, type} = this.props;
        // console.log('MenuSection.onDragStart (', sectionId, ') event:', event);
        (event.target as HTMLDivElement).classList.add('dragging');
        event.dataTransfer.setData('text/html', sectionId);
        event.dataTransfer.effectAllowed = 'move';
        if (onDragStart) {
            onDragStart(sectionId, type);
        }
    }

    handleDragEnd(event: DragEvent<SVGElement>): void {
        const {onDragEnd, sectionId, type} = this.props;
        // console.log('MenuSection.onDragEnd event:', event);
        (event.target as HTMLDivElement).classList.remove('dragging');
        if (onDragEnd) {
            onDragEnd(sectionId, type);
        }
    }

    render() {
        const {children, className, draggable = true, wrapperRef} = this.props;
        // What can one do if the component receives a ref to a more basic object? Cast it? Well, there it is below:
        const attrs = this.getContainerAttributes(className, draggable, wrapperRef as RefObject<HTMLDivElement>);
        return (
            <div {...attrs}>
                {this.buildDragHandle()}
                {children}
            </div>
        );
    }
};
