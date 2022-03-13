import React, {Component, RefObject, createRef} from 'react';
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';

import './_ResizableContainer.scss';
import {getCompassHeadingDotProduct, getCompassOctoHeadingClassNameString, getOrthogonalCompassHeadings} from '../commons';

interface Props {
    bottom?: number | string;
    className?: string;
    height?: number;
    left?: number | string;
    resizableEdges: CompassHeading[];
    right?: number | string;
    width?: number;
    top?: number | string;
}

interface State {
    height?: number;
    width?: number;
}

function coord(value: number | string) {
    return typeof value === 'number'? `${value}px` : value ? value : 'unset';
}

export default class ResizableContainer extends Component<Props, State> {
    containerRef: RefObject<HTMLDivElement>;
    parentResizeObserver: ResizeObserver;

    constructor(props: Props) {
        super(props);
        this.state = {
            height: this.props.height ?? 100,
            width: this.props.width ?? 100,
        };
        this.containerRef = createRef<HTMLDivElement>();
        this.handleDrag = this.handleDrag.bind(this);
        this.handleStartDrag = this.handleStartDrag.bind(this);
        this.handleStopDrag = this.handleStopDrag.bind(this);
    }

    buildHandle(
        key: string,
        axis: 'x' | 'y' | 'both',
        onStart: (event: DraggableEvent, data: DraggableData) => void,
        onDrag: (event: DraggableEvent, data: DraggableData) => void,
        onStop: (event: DraggableEvent, data: DraggableData) => void
    ) {
        const handleRef = createRef<HTMLDivElement>();
        return (
            <Draggable
                key={`separator-${key}`}
                axis={axis}
                handle={`.resize-edge.${key}`}
                nodeRef={handleRef}
                position={{x: 0, y: 0}}
                onStart={onStart}
                onDrag={onDrag}
                onStop={onStop}
            >
                <div className={`resize-edge ${key}`} ref={handleRef}/>
            </Draggable>
        );
    }

    handleDrag(xMultiplier: number, yMultiplier: number, event: DraggableEvent, data: DraggableData) {
        const currentContainer = this.containerRef.current;
        const originalHeight = parseInt(currentContainer.getAttribute('originalHeight'));
        const originalWidth = parseInt(currentContainer.getAttribute('originalWidth'));
        const {height, width} = this.restrictSize(
            currentContainer,
            originalHeight + data.y * yMultiplier,
            originalWidth + data.x * xMultiplier,
            xMultiplier,
            yMultiplier);
        currentContainer.style.height = `${height}px`;
        currentContainer.style.width = `${width}px`;
    }

    handleStartDrag(event: DraggableEvent, data: DraggableData) {
        const currentContainer = this.containerRef.current;
        const computedStyle = getComputedStyle(currentContainer);
        currentContainer.setAttribute('originalHeight', computedStyle.height);
        currentContainer.setAttribute('originalWidth', computedStyle.width);
    }

    handleStopDrag(event: DraggableEvent, data: DraggableData) {
        const currentContainer = this.containerRef.current;
        currentContainer.removeAttribute('originalHeight');
        currentContainer.removeAttribute('originalWidth');
        const computedStyle = getComputedStyle(currentContainer);
        this.setState(({height, width, ...other}) => ({height: parseInt(computedStyle.height), width: parseInt(computedStyle.width), ...other}));
    }

    restrictSize(currentContainer: HTMLElement, proposedHeight: number, proposedWidth: number, xMultiplier: number, yMultiplier: number): {height: number, width: number} {
        let height: number = proposedHeight;
        let width: number = proposedWidth;
        const containerParent = currentContainer.parentElement;
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
        // TODO: Figure out edges
        const parentElement = this.containerRef.current.parentElement;
        this.parentResizeObserver = new ResizeObserver(entries => {
            const edges = this.props.resizableEdges;
            const currentContainer = this.containerRef.current;
            const containerRect = currentContainer.getBoundingClientRect();
            const {height, width} = this.restrictSize(currentContainer, containerRect.height, containerRect.width, 1, 1);
            if (height !== containerRect.height) {
                currentContainer.style.height = `${height}px`;
            }
            if (width !== containerRect.width) {
                currentContainer.style.width = `${width}px`;
            }
        });
        this.parentResizeObserver.observe(parentElement);
    }

    componentWillUnmount() {
        this.parentResizeObserver.disconnect();
        this.parentResizeObserver = null;
    }

    render() {
        const {bottom, children, className, left, resizableEdges, right, top} = this.props;
        const {height, width} = this.state;
        const edgesAndCorners = resizableEdges.reduce(
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
            <div className={`resizable-container ${className ?? ''} ${resizableEdges.map(edge => getCompassOctoHeadingClassNameString(edge)).join(' ')}`}
                 style={{bottom: coord(bottom), height: coord(height), left: coord(left), right: coord(right), top: coord(top), width: coord(width)}}
                 ref={this.containerRef}>
                <div className="horizontal-arrangement top">
                    {edgesAndCorners['nw'] ? this.buildHandle('top-top-left', 'both', this.handleStartDrag, this.handleDrag.bind(this, -1, -1), this.handleStopDrag) : null}
                    {edgesAndCorners['n'] ? this.buildHandle('top', 'y', this.handleStartDrag, this.handleDrag.bind(this, 0, -1), this.handleStopDrag) : null}
                    {edgesAndCorners['ne'] ? this.buildHandle('top-top-right', 'both', this.handleStartDrag, this.handleDrag.bind(this, 1, -1), this.handleStopDrag) : null}
                </div>
                <div className="horizontal-arrangement inline">
                    <div className="vertical-arrangement left">
                        {edgesAndCorners['nw'] ? this.buildHandle('left-top-left', 'both', this.handleStartDrag, this.handleDrag.bind(this, -1, -1), this.handleStopDrag) : null}
                        {edgesAndCorners['w'] ? this.buildHandle('left', 'x', this.handleStartDrag, this.handleDrag.bind(this, -1, 0), this.handleStopDrag) : null}
                        {edgesAndCorners['sw'] ? this.buildHandle('left-bottom-left', 'both', this.handleStartDrag, this.handleDrag.bind(this, -1, -1), this.handleStopDrag) : null}
                    </div>
                    <div className="resizable-container-content">
                        {children}
                    </div>
                    <div className="vertical-arrangement right">
                        {edgesAndCorners['ne'] ? this.buildHandle('right-top-right', 'both', this.handleStartDrag, this.handleDrag.bind(this, 1, 1), this.handleStopDrag) : null}
                        {edgesAndCorners['e'] ? this.buildHandle('right', 'x', this.handleStartDrag, this.handleDrag.bind(this, 1, 0), this.handleStopDrag) : null}
                        {edgesAndCorners['se'] ? this.buildHandle('right-bottom-right', 'both', this.handleStartDrag, this.handleDrag.bind(this, 1, 1), this.handleStopDrag) : null}
                    </div>
                </div>
                <div className="horizontal-arrangement bottom">
                    {edgesAndCorners['sw'] ? this.buildHandle('bottom-bottom-left', 'both', this.handleStartDrag, this.handleDrag.bind(this, -1, 1), this.handleStopDrag) : null}
                    {edgesAndCorners['s'] ? this.buildHandle('bottom', 'y', this.handleStartDrag, this.handleDrag.bind(this, 0, 1), this.handleStopDrag) : null}
                    {edgesAndCorners['se'] ? this.buildHandle('bottom-bottom-right', 'both', this.handleStartDrag, this.handleDrag.bind(this, 1, 1), this.handleStopDrag) : null}
                </div>
            </div>
        );
    }
};
