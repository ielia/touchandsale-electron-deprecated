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
    constructor(props: Props) {
        super(props);
        this.state = {
            height: this.props.height ?? 100,
            width: this.props.width ?? 100,
        };
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

    handleDrag(containerRef: RefObject<HTMLDivElement>, xMultiplier: number, yMultiplier: number, event: DraggableEvent, data: DraggableData) {
        const currentContainer = containerRef.current;
        const height = parseInt(currentContainer.getAttribute('originalHeight'));
        const width = parseInt(currentContainer.getAttribute('originalWidth'));
        currentContainer.style.height = `${height + data.y * yMultiplier}px`;
        currentContainer.style.width = `${width + data.x * xMultiplier}px`;
    }

    handleStartDrag(containerRef: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData) {
        const currentContainer = containerRef.current;
        const computedStyle = getComputedStyle(currentContainer);
        currentContainer.setAttribute('originalHeight', computedStyle.height);
        currentContainer.setAttribute('originalWidth', computedStyle.width);
    }

    handleStopDrag(containerRef: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData) {
        const currentContainer = containerRef.current;
        currentContainer.removeAttribute('originalHeight');
        currentContainer.removeAttribute('originalWidth');
        const computedStyle = getComputedStyle(currentContainer);
        this.setState(({height, width, ...other}) => ({height: parseInt(computedStyle.height), width: parseInt(computedStyle.width), ...other}));
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

        const containerRef = createRef<HTMLDivElement>();
        const handleDrag = this.handleDrag.bind(this, containerRef);
        const handleStartDrag = this.handleStartDrag.bind(this, containerRef);
        const handleStopDrag = this.handleStopDrag.bind(this, containerRef);
        return (
            <div className={`resizable-container ${className ?? ''} ${resizableEdges.map(edge => getCompassOctoHeadingClassNameString(edge)).join(' ')}`}
                 style={{bottom: coord(bottom), height: coord(height), left: coord(left), right: coord(right), top: coord(top), width: coord(width)}}
                 ref={containerRef}>
                <div className="horizontal-arrangement top">
                    {edgesAndCorners['nw'] ? this.buildHandle('top-left', 'both', handleStartDrag, handleDrag.bind(this, -1, -1), handleStopDrag) : null}
                    {edgesAndCorners['n'] ? this.buildHandle('top', 'y', handleStartDrag, handleDrag.bind(this, 0, -1), handleStopDrag) : null}
                    {edgesAndCorners['ne'] ? this.buildHandle('top-right', 'both', handleStartDrag, handleDrag.bind(this, 1, -1), handleStopDrag) : null}
                </div>
                <div className="horizontal-arrangement inline">
                    {edgesAndCorners['w'] ? this.buildHandle('left', 'x', handleStartDrag, handleDrag.bind(this, -1, 0), handleStopDrag) : null}
                    <div className="resizable-container-content">
                        {children}
                    </div>
                    {edgesAndCorners['e'] ? this.buildHandle('right', 'x', handleStartDrag, handleDrag.bind(this, 1, 0), handleStopDrag) : null}
                </div>
                <div className="horizontal-arrangement bottom">
                    {edgesAndCorners['sw'] ? this.buildHandle('bottom-left', 'both', handleStartDrag, handleDrag.bind(this, -1, 1), handleStopDrag) : null}
                    {edgesAndCorners['s'] ? this.buildHandle('bottom', 'y', handleStartDrag, handleDrag.bind(this, 0, 1), handleStopDrag) : null}
                    {edgesAndCorners['se'] ? this.buildHandle('bottom-right', 'both', handleStartDrag, handleDrag.bind(this, 1, 1), handleStopDrag) : null}
                </div>
            </div>
        );
    }
};
