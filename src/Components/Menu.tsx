import React, {DragEvent, PureComponent, ReactElement, RefObject, createRef} from 'react';

import './_Menu.scss';

import BaseMenuSection from './MenuSection';

export class ChildrenNotAcceptable extends Error {
    children: ReactElement[];

    constructor(children:ReactElement[], message: string) {
        super(message);
        this.children = children;
    }
}

export interface Props<M extends BaseMenuSection = BaseMenuSection> {
    accepts?: string[];
    children?: ReactElement<M> | ReactElement<M>[];
    menuId: string;
    onDragEnter?: (menuId: string) => void;
    onDragLeave?: (menuId: string) => void;
    onDragOver?: (menuId: string, x: number, y: number) => void;
    orientation?: ComponentOrientation;
}

export default class Menu<M extends BaseMenuSection = BaseMenuSection> extends PureComponent<Props<M>> {
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
        const {menuId, onDragEnter} = this.props;
        // console.log('Menu.onDragEnter data:', event.dataTransfer.getData('text/html'), '| event:', event);
        // event.dataTransfer.dropEffect = 'move';
        if (onDragEnter) {
            onDragEnter(menuId);
        }
    }

    handleDragLeave(event: DragEvent<HTMLDivElement>): void {
        const {menuId, onDragLeave} = this.props;
        // console.log('Menu.onDragLeave event:', event);
        // event.dataTransfer.dropEffect = 'none';
        if (onDragLeave) {
            onDragLeave(menuId);
        }
    }

    handleDragOver(event: DragEvent<HTMLDivElement>): void {
        const {menuId, onDragOver} = this.props;
        const {clientX, clientY} = event;
        // console.log('Menu.onDragOver event:', event);
        if (onDragOver) {
            onDragOver(menuId, clientX, clientY);
        }
    }

    render() {
        const {orientation = 'horizontal', children} = this.props;
        return (
            <div className={`menu ${orientation}`}
                 onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver}
                 ref={this.selfRef}
            >
                {children}
            </div>
        );
    }
};
