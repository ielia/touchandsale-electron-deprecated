import React, {Component, RefObject, createRef} from 'react';
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';

import './_ResizableContainer.scss';

import {getCompassHeadingDotProduct, getCompassOctoHeadingClassName, getOrthogonalCompassHeadings} from '../commons';

type OrientedHandleDragFunctionsObject = {[orientation in CompassOctoHeading]?: (event: DraggableEvent, data: DraggableData) => void};

export interface Props {
    bottom?: number | string;
    className?: string;
    height?: number;
    initiallyTryResizeToFit?: boolean;
    left?: number | string;
    resizableEdges: CompassHeading[];
    right?: number | string;
    width?: number;
    top?: number | string;
    onFocusOut?: (event: FocusEvent) => void;
    onResizeEnd?: (height: number, width: number) => void;
}

export interface State {
    height?: number;
    width?: number;
}

// TODO: Look for a better name other than "magnitude".
function magnitude(value: number | string) {
    return typeof value === 'number'? `${value}px` : value ? value : 'unset';
}

const CORNER_RESIZING_PREFERENCE_ORDER: CompassOctoHeading[] = ['sw', 'se', 'nw', 'ne'];
const HORIZONTAL_RESIZING_PREFERENCE_ORDER: CompassOctoHeading[] = ['w', 'e'];
const VERTICAL_RESIZING_PREFERENCE_ORDER: CompassOctoHeading[] = ['s', 'n'];
const ORIENTATION_DATA: {[orientation in CompassOctoHeading]: {xMultiplier: number, yMultiplier: number, axis: 'x' | 'y' | 'both'}} = {
    'n': {xMultiplier: 0, yMultiplier: -1, axis: 'y'},
    'ne': {xMultiplier: 1, yMultiplier: -1, axis: 'both'},
    'e': {xMultiplier: 1, yMultiplier: 0, axis: 'x'},
    'se': {xMultiplier: 1, yMultiplier: 1, axis: 'both'},
    's': {xMultiplier: 0, yMultiplier: 1, axis: 'y'},
    'sw': {xMultiplier: -1, yMultiplier: 1, axis: 'both'},
    'w': {xMultiplier: -1, yMultiplier: 0, axis: 'x'},
    'nw': {xMultiplier: -1, yMultiplier: -1, axis: 'both'},
};

export default class ResizableContainer extends Component<Props, State> {
    // TODO: See if it is worth cloning these.
    readonly cornerResizingPreferenceOrder = CORNER_RESIZING_PREFERENCE_ORDER;
    readonly horizontalResizingPreferenceOrder = HORIZONTAL_RESIZING_PREFERENCE_ORDER;
    readonly verticalResizingPreferenceOrder = VERTICAL_RESIZING_PREFERENCE_ORDER;
    readonly orientationData = ORIENTATION_DATA;

    contentRef: RefObject<HTMLDivElement>;
    edgesAndCorners: {[orientation in CompassOctoHeading]?: boolean};
    handleOrientedDrag: OrientedHandleDragFunctionsObject;
    parentResizeObserver: ResizeObserver;
    selfRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.selfRef = createRef<HTMLDivElement>();
        this.contentRef = createRef<HTMLDivElement>();
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleFocusOut = this.handleFocusOut.bind(this);

        this.handleOrientedDrag = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].reduce((acc: OrientedHandleDragFunctionsObject, heading: CompassOctoHeading) => {
            const {xMultiplier, yMultiplier} = this.orientationData[heading];
            acc[heading] = this.handleDrag.bind(this, xMultiplier, yMultiplier);
            return acc;
        }, {});

        const {height, width} = this.props;
        this.state = {
            height: !height || height < 100 ? 100 : height,
            width: !width || width < 100 ? 100 : width,
        };
    }

    buildHandle(orientation: CompassOctoHeading, keyPrefix: string = '') {
        const key = keyPrefix + getCompassOctoHeadingClassName(orientation);
        const axis = this.orientationData[orientation].axis
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
        const {left: currentLeft, top: currentTop} = selfElement.getBoundingClientRect();
        const originalHeight = parseInt(selfElement.getAttribute('originalHeight'));
        const originalLeft = parseInt(selfElement.getAttribute('originalLeft'));
        const originalTop = parseInt(selfElement.getAttribute('originalTop'));
        const originalWidth = parseInt(selfElement.getAttribute('originalWidth'));
        let deltaX = (xMultiplier < 0 ? data.x + currentLeft - originalLeft : data.x) * xMultiplier;
        let deltaY = (yMultiplier < 0 ? data.y + currentTop - originalTop : data.y) * yMultiplier;
        this.restrictSize(selfElement, originalHeight + deltaY, originalWidth + deltaX, xMultiplier, yMultiplier);
    }

    handleDragStart() {
        const selfElement = this.selfRef.current;
        const {height, left, top, width} = selfElement.getBoundingClientRect();
        selfElement.setAttribute('originalHeight', magnitude(height));
        selfElement.setAttribute('originalLeft', magnitude(left));
        selfElement.setAttribute('originalTop', magnitude(top));
        selfElement.setAttribute('originalWidth', magnitude(width));
    }

    handleDragStop() {
        const selfElement = this.selfRef.current;
        selfElement.removeAttribute('originalHeight');
        selfElement.removeAttribute('originalLeft');
        selfElement.removeAttribute('originalTop');
        selfElement.removeAttribute('originalWidth');
        const computedStyle = getComputedStyle(selfElement);
        const [height, width] = [parseInt(computedStyle.height), parseInt(computedStyle.width)];
        this.setState(({height: oldHeight, width: oldWidth, ...other}) => ({height, width, ...other}));
        if (this.props.onResizeEnd) {
            this.props.onResizeEnd(height, width);
        }
    }

    handleFocusOut(event: FocusEvent) {
        const onFocusOut = this.props.onFocusOut;
        const selfElement = this.selfRef.current;
        if (onFocusOut && event.relatedTarget && !selfElement.contains(event.relatedTarget as Node)) {
            onFocusOut(event);
        } else if (event.target !== selfElement && (!event.relatedTarget || event.relatedTarget === selfElement)) {
            (event.target as HTMLElement).focus();
        }
    }

    restrictSize(element: HTMLElement, proposedHeight: number, proposedWidth: number, xMultiplier: number, yMultiplier: number): void {
        // TODO: See how to avoid scrollbars from reducing the size of this container any further.
        let height: number = proposedHeight;
        let width: number = proposedWidth;
        const elementParent = element.parentElement; // Using parentElement instead of having to pass a ref... Is it a bad practice?
        if (elementParent) {
            const elementRect = element.getBoundingClientRect();
            const parentRect = elementParent.getBoundingClientRect();
            if (xMultiplier < 0 && elementRect.right - width < parentRect.left) {
                width = elementRect.right - parentRect.left;
            } else if (xMultiplier > 0 && elementRect.left + width > parentRect.right) {
                width = parentRect.right - elementRect.left;
            }
            if (yMultiplier < 0 && elementRect.bottom - height < parentRect.top) {
                height = elementRect.bottom - parentRect.top;
            } else if (yMultiplier > 0 && elementRect.top + height > parentRect.bottom) {
                height = parentRect.bottom - elementRect.top;
            }
        }
        element.style.height = `${height}px`;
        element.style.width = `${width}px`;
    }

    componentDidMount() {
        const {initiallyTryResizeToFit, onResizeEnd} = this.props;
        const selfElement = this.selfRef.current;
        const parentElement = selfElement.parentElement; // Using parentElement instead of having to pass a ref... Is it a bad practice?
        const edges = this.edgesAndCorners;
        const preferredResizeEdge = this.cornerResizingPreferenceOrder.find(o => edges[o]) ??
            this.horizontalResizingPreferenceOrder.find(o => edges[o]) ??
            this.verticalResizingPreferenceOrder.find(o => edges[o]);
        const {xMultiplier, yMultiplier} = this.orientationData[preferredResizeEdge];
        if (parentElement) {
            this.parentResizeObserver = new ResizeObserver(() => {
                const selfElement = this.selfRef.current;
                const selfRect = selfElement.getBoundingClientRect();
                this.restrictSize(selfElement, selfRect.height, selfRect.width, xMultiplier, yMultiplier);
            });
            this.parentResizeObserver.observe(parentElement);
        }
        if (initiallyTryResizeToFit) {
            const contentElement = this.contentRef.current;
            const selfRect = selfElement.getBoundingClientRect();
            const contentRect = contentElement.getBoundingClientRect();
            this.restrictSize(selfElement, selfRect.height + contentElement.scrollHeight - contentRect.height, selfRect.width + contentElement.scrollWidth - contentRect.width, xMultiplier, yMultiplier);
        }
        if (onResizeEnd) {
            const {height, width} = selfElement.getBoundingClientRect();
            onResizeEnd(height, width);
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

        this.edgesAndCorners = resizableEdges.reduce(
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

        return (
            <div className={`resizable-container ${className ?? ''} ${resizableEdges.map(edge => getCompassOctoHeadingClassName(edge)).join(' ')}`}
                 style={{bottom: magnitude(bottom), height: magnitude(height), left: magnitude(left), right: magnitude(right), top: magnitude(top), width: magnitude(width)}}
                 tabIndex={0}
                 ref={this.selfRef}>
                <div className="horizontal-arrangement top">
                    {this.edgesAndCorners['nw'] && this.buildHandle('nw', 'top-')}
                    {this.edgesAndCorners['n'] && this.buildHandle('n')}
                    {this.edgesAndCorners['ne'] && this.buildHandle('ne', 'top-')}
                </div>
                <div className="horizontal-arrangement inline">
                    <div className="vertical-arrangement left">
                        {this.edgesAndCorners['nw'] && this.buildHandle('nw', 'left-')}
                        {this.edgesAndCorners['w'] && this.buildHandle('w')}
                        {this.edgesAndCorners['sw'] && this.buildHandle('sw', 'left-')}
                    </div>
                    <div className="resizable-container-content" ref={this.contentRef}>
                        {children}
                    </div>
                    <div className="vertical-arrangement right">
                        {this.edgesAndCorners['ne'] && this.buildHandle('ne', 'right-')}
                        {this.edgesAndCorners['e'] && this.buildHandle('e')}
                        {this.edgesAndCorners['se'] && this.buildHandle('se', 'right-')}
                    </div>
                </div>
                <div className="horizontal-arrangement bottom">
                    {this.edgesAndCorners['sw'] && this.buildHandle('sw', 'bottom-')}
                    {this.edgesAndCorners['s'] && this.buildHandle('s')}
                    {this.edgesAndCorners['se'] && this.buildHandle('se', 'bottom-')}
                </div>
            </div>
        );
    }
};
