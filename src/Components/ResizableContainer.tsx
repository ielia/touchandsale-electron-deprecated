import React, {Component, RefObject, createRef} from 'react';
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';

import './_ResizableContainer.scss';
import {getCompassHeadingDotProduct, getCompassOctoHeadingClassName, getOrthogonalCompassHeadings} from '../commons';

type OrientedHandleDragFunctionsObject = {[orientation in CompassOctoHeading]?: (event: DraggableEvent, data: DraggableData) => void};

interface Props {
    bottom?: number | string;
    className?: string;
    height?: number;
    left?: number | string;
    resizableEdges: CompassHeading[];
    right?: number | string;
    width?: number;
    top?: number | string;
    onBlur?: (event: FocusEvent) => any;
}

interface State {
    height?: number;
    width?: number;
}

function magnitude(value: number | string) {
    return typeof value === 'number'? `${value}px` : value ? value : 'unset';
}

export default class ResizableContainer extends Component<Props, State> {
    static cornerResizingPreferenceOrder: CompassOctoHeading[] = ['sw', 'se', 'nw', 'ne'];
    static horizontalResizingPreferenceOrder: CompassOctoHeading[] = ['w', 'e'];
    static verticalResizingPreferenceOrder: CompassOctoHeading[] = ['s', 'n'];
    static orientationData: {[orientation in CompassOctoHeading]: {xMult: number, yMult: number, axis: 'x' | 'y' | 'both'}} = {
        'n': {xMult: 0, yMult: -1, axis: 'y'},
        'ne': {xMult: 1, yMult: -1, axis: 'both'},
        'e': {xMult: 1, yMult: 0, axis: 'x'},
        'se': {xMult: 1, yMult: 1, axis: 'both'},
        's': {xMult: 0, yMult: 1, axis: 'y'},
        'sw': {xMult: -1, yMult: 1, axis: 'both'},
        'w': {xMult: -1, yMult: 0, axis: 'x'},
        'nw': {xMult: -1, yMult: -1, axis: 'both'},
    };

    edgesAndCorners: {[orientation in CompassOctoHeading]?: boolean};
    handleOrientedDrag: OrientedHandleDragFunctionsObject;
    parentResizeObserver: ResizeObserver;
    selfRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            height: this.props.height ?? 100,
            width: this.props.width ?? 100,
        };

        this.selfRef = createRef<HTMLDivElement>();
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleFocusOut = this.handleFocusOut.bind(this);

        this.handleOrientedDrag = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].reduce((acc: OrientedHandleDragFunctionsObject, heading: CompassOctoHeading) => {
            const {xMult, yMult} = ResizableContainer.orientationData[heading];
            acc[heading] = this.handleDrag.bind(this, xMult, yMult);
            return acc;
        }, {});

        this.edgesAndCorners = this.props.resizableEdges.reduce(
            (acc: {[heading in CompassOctoHeading]?: boolean}, edge) => {
                acc[edge] = true;
                getOrthogonalCompassHeadings(edge).forEach(side => {
                    if (acc[side]) {
                        acc[getCompassHeadingDotProduct(edge, side)] = true;
                    }
                });
                return acc;
            },
            {}
        );
    }

    buildHandle(orientation: CompassOctoHeading, keyPrefix: string = '') {
        const key = keyPrefix + getCompassOctoHeadingClassName(orientation);
        const axis = ResizableContainer.orientationData[orientation].axis
        const handleDrag = this.handleOrientedDrag[orientation];
        const handleRef = createRef<HTMLDivElement>();
        return (
            <Draggable
                key={`separator-${key}`}
                axis={axis}
                handle={`.resize-edge.${key}`}
                nodeRef={handleRef}
                position={{x: 0, y: 0}}
                onStart={this.handleDragStart}
                onDrag={handleDrag}
                onStop={this.handleDragStop}
            >
                <div className={`resize-edge ${key}`} ref={handleRef}/>
            </Draggable>
        );
    }

    handleDrag(xMultiplier: number, yMultiplier: number, event: DraggableEvent, data: DraggableData) {
        const selfElement = this.selfRef.current;
        const originalHeight = parseInt(selfElement.getAttribute('originalHeight'));
        const originalWidth = parseInt(selfElement.getAttribute('originalWidth'));
        const {height, width} = this.restrictSize(
            selfElement,
            originalHeight + data.y * yMultiplier,
            originalWidth + data.x * xMultiplier,
            xMultiplier,
            yMultiplier);
        selfElement.style.height = `${height}px`;
        selfElement.style.width = `${width}px`;
    }

    handleDragStart() {
        const selfElement = this.selfRef.current;
        const computedStyle = getComputedStyle(selfElement);
        selfElement.setAttribute('originalHeight', computedStyle.height);
        selfElement.setAttribute('originalWidth', computedStyle.width);
    }

    handleDragStop() {
        const selfElement = this.selfRef.current;
        selfElement.removeAttribute('originalHeight');
        selfElement.removeAttribute('originalWidth');
        const computedStyle = getComputedStyle(selfElement);
        this.setState(({height, width, ...other}) => ({height: parseInt(computedStyle.height), width: parseInt(computedStyle.width), ...other}));
    }

    handleFocusOut(event: FocusEvent) {
        const onBlur = this.props.onBlur;
        const selfElement = this.selfRef.current;
        if (onBlur && (!event.relatedTarget || !selfElement.contains(event.relatedTarget as Node))) {
            onBlur(event);
        }
    }

    restrictSize(currentContainer: HTMLElement, proposedHeight: number, proposedWidth: number, xMultiplier: number, yMultiplier: number): {height: number, width: number} {
        // TODO: See how to avoid scrollbars from reducing the size of this container any further.
        let height: number = proposedHeight;
        let width: number = proposedWidth;
        const containerParent = currentContainer.parentElement; // Using parentElement instead of having to pass a ref... Is it a bad practice?
        if (containerParent) {
            const containerRect = currentContainer.getBoundingClientRect();
            const parentRect = containerParent.getBoundingClientRect();
            if (xMultiplier < 0 && containerRect.right - width < parentRect.left) {
                width = containerRect.right - parentRect.left;
            } else if (xMultiplier > 0 && containerRect.left + width > parentRect.right) {
                width = parentRect.right - containerRect.left;
            }
            if (yMultiplier < 0 && containerRect.bottom - height < parentRect.top) {
                height = containerRect.bottom - parentRect.top;
            } else if (yMultiplier > 0 && containerRect.top + height > parentRect.bottom) {
                height = parentRect.bottom - containerRect.top;
            }
        }
        return {height, width};
    }

    componentDidMount() {
        const selfElement = this.selfRef.current;
        const parentElement = selfElement.parentElement; // Using parentElement instead of having to pass a ref... Is it a bad practice?
        if (parentElement) {
            this.parentResizeObserver = new ResizeObserver(entries => {
                const edges = this.edgesAndCorners;
                let edge = ResizableContainer.cornerResizingPreferenceOrder.find(o => edges[o]) ??
                    ResizableContainer.horizontalResizingPreferenceOrder.find(o => edges[o]) ??
                    ResizableContainer.verticalResizingPreferenceOrder.find(o => edges[o]);
                const selfElement = this.selfRef.current;
                const containerRect = selfElement.getBoundingClientRect();
                const {xMult, yMult} = ResizableContainer.orientationData[edge];
                const {height, width} = this.restrictSize(selfElement, containerRect.height, containerRect.width, xMult, yMult);
                if (height !== containerRect.height) {
                    selfElement.style.height = `${height}px`;
                }
                if (width !== containerRect.width) {
                    selfElement.style.width = `${width}px`;
                }
            });
            this.parentResizeObserver.observe(parentElement);
        }
        selfElement.addEventListener('focusout', this.handleFocusOut);
    }

    componentWillUnmount() {
        if (this.parentResizeObserver) {
            this.parentResizeObserver.disconnect();
            this.parentResizeObserver = null;
        }
        this.selfRef.current.removeEventListener('focusout', this.handleFocusOut);
    }

    render() {
        const {bottom, children, className, left, resizableEdges, right, top} = this.props;
        const {height, width} = this.state;

        return (
            <div className={`resizable-container ${className ?? ''} ${resizableEdges.map(edge => getCompassOctoHeadingClassName(edge)).join(' ')}`}
                 style={{bottom: magnitude(bottom), height: magnitude(height), left: magnitude(left), right: magnitude(right), top: magnitude(top), width: magnitude(width)}}
                 tabIndex={0}
                 ref={this.selfRef}>
                <div className="horizontal-arrangement top">
                    {this.edgesAndCorners['nw'] ? this.buildHandle('nw', 'top-') : null}
                    {this.edgesAndCorners['n'] ? this.buildHandle('n') : null}
                    {this.edgesAndCorners['ne'] ? this.buildHandle('ne', 'top-') : null}
                </div>
                <div className="horizontal-arrangement inline">
                    <div className="vertical-arrangement left">
                        {this.edgesAndCorners['nw'] ? this.buildHandle('nw', 'left-') : null}
                        {this.edgesAndCorners['w'] ? this.buildHandle('w') : null}
                        {this.edgesAndCorners['sw'] ? this.buildHandle('sw', 'left-') : null}
                    </div>
                    <div className="resizable-container-content">
                        {children}
                    </div>
                    <div className="vertical-arrangement right">
                        {this.edgesAndCorners['ne'] ? this.buildHandle('ne', 'right-') : null}
                        {this.edgesAndCorners['e'] ? this.buildHandle('e') : null}
                        {this.edgesAndCorners['se'] ? this.buildHandle('se', 'right-') : null}
                    </div>
                </div>
                <div className="horizontal-arrangement bottom">
                    {this.edgesAndCorners['sw'] ? this.buildHandle('sw', 'bottom-') : null}
                    {this.edgesAndCorners['s'] ? this.buildHandle('s') : null}
                    {this.edgesAndCorners['se'] ? this.buildHandle('se', 'bottom-') : null}
                </div>
            </div>
        );
    }
};
