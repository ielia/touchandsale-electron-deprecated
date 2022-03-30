import React, {DragEvent, PureComponent, ReactElement, RefObject, createRef} from 'react';
import mergeRefs from 'react-merge-refs';

import './_Menu.scss';

import Wrapped from './mixins/WrappedComponent';
import BaseMenuSection from './MenuSection';

export class ChildrenNotAcceptable extends Error {
    children: ReactElement[];

    constructor(children:ReactElement[], message: string) {
        super(message);
        this.children = children;
    }
}

export interface Props<M extends InstanceType<typeof BaseMenuSection> = InstanceType<typeof BaseMenuSection>> {
    accepts?: string[];
    children?: ReactElement<M> | ReactElement<M>[];
    menuId: string;
    onDragEnter?: (type: string, menuId: string) => void;
    onDragLeave?: (type: string, menuId: string) => void;
    onDragOver?: (type: string, menuId: string, x: number, y: number) => void;
    orientation?: ComponentOrientation;
    wrapperRef?: RefObject<HTMLElement>;
}

class Menu<M extends InstanceType<typeof BaseMenuSection> = InstanceType<typeof BaseMenuSection>> extends PureComponent<Props<M>> {
    selfRef: RefObject<HTMLDivElement>;

    constructor(props: Props<M>) {
        super(props);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.selfRef = createRef();

        const {accepts, children} = this.props;
        if (accepts) {
            const childArray = Array.isArray(children) ? children : [children];
            const faultyChildren = childArray.filter(child => accepts.indexOf(child.props.type) < 0);
            if (faultyChildren.length) {
                const unacceptableTypes = faultyChildren.map(child => child.props.type);
                const alsoOrNothing = faultyChildren.length === childArray.length ? '' : ' also'
                throw new ChildrenNotAcceptable(
                    faultyChildren,
                    `This menu can only accept sections of types ${accepts}, but it${alsoOrNothing} got children with the following types: ${unacceptableTypes}.`
                );
            }
        }
    }

    handleDragEnter(event: DragEvent<HTMLDivElement>): void {
        const {accepts, menuId, onDragEnter} = this.props;
        // console.log('Menu.onDragEnter data:', event.dataTransfer.getData('text/html'), '| event:', event);
        console.log('Menu.onDragEnter event:', event);
        // event.dataTransfer.dropEffect = 'move';
        const draggable = event.relatedTarget as HTMLElement;
        const sectionType = draggable.dataset['section-type'];
        if (!accepts || accepts.indexOf(sectionType) >= 0) {
            if (onDragEnter) {
                onDragEnter(sectionType, menuId);
            }
        }
    }

    handleDragLeave(event: DragEvent<HTMLDivElement>): void {
        const {accepts, menuId, onDragLeave} = this.props;
        console.log('Menu.onDragLeave event:', event);
        // event.dataTransfer.dropEffect = 'none';
        const draggable = event.relatedTarget as HTMLElement;
        const sectionType = draggable.dataset['section-type'];
        if (!accepts || accepts.indexOf(sectionType) >= 0) {
            if (onDragLeave) {
                onDragLeave(sectionType, menuId);
            }
        }
    }

    handleDragOver(event: DragEvent<HTMLDivElement>): void {
        const {accepts, menuId, onDragOver} = this.props;
        const {clientX, clientY} = event;
        console.log('Menu.onDragOver event:', event);
        const draggable = event.relatedTarget as HTMLElement;
        const sectionType = draggable.dataset['section-type'];
        if (!accepts || accepts.indexOf(sectionType) >= 0) {
            if (onDragOver) {
                onDragOver(sectionType, menuId, clientX, clientY);
            }
        }
    }

    render() {
        const {children, orientation = 'horizontal', wrapperRef} = this.props;
        const ref = mergeRefs<HTMLDivElement>([this.selfRef, wrapperRef as RefObject<HTMLDivElement>]);
        return (
            <div className={`menu ${orientation}`}
                 onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver}
                 ref={ref}
            >
                {children}
            </div>
        );
    }
}

export default Wrapped(Menu);
