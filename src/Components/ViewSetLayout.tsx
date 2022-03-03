import React, {Children, PureComponent, RefObject, createRef} from 'react';
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';

import './ViewSetLayout.scss';
import {addSeparatorElement} from '../commons';
import TabbedViewContainer from './TabbedViewContainer';
import View from './View';

type ViewSelectedListener = (containerId: string, viewId: string) => boolean | void;
type LayoutDivisionChangeListener = (pathToStart: string, startRatio: number, endRatio: number) => boolean | void;

interface Props {
    layout: any;
    onLayoutDivisionChange: LayoutDivisionChangeListener;
    onViewSelected: ViewSelectedListener;
}

function calculateHorizontallyWeightedFlexes(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): {startRatio: number, endRatio: number} {
    const localWidth = (start.current.offsetWidth + data.node.offsetWidth + end.current.offsetWidth);
    const fullWidth = data.node.parentElement.offsetWidth;
    const relativeLocation = parseInt(data.node.getAttribute('originalLeft')) + data.node.offsetWidth / 2 + data.x - start.current.offsetLeft;
    const {start: startFlex, startRatio, end: endFlex, endRatio} = calculateWeightedFlexes(localWidth, fullWidth, relativeLocation);
    start.current.style.flex = startFlex;
    end.current.style.flex = endFlex;
    return {startRatio, endRatio};
}

function calculateVerticallyWeightedFlexes(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): {startRatio: number, endRatio: number} {
    const localHeight = (start.current.offsetHeight + data.node.offsetHeight + end.current.offsetHeight);
    const fullHeight = data.node.parentElement.offsetHeight;
    const relativeLocation = parseInt(data.node.getAttribute('originalTop')) + data.node.offsetHeight / 2 + data.y - start.current.offsetTop;
    const {start: startFlex, startRatio, end: endFlex, endRatio} = calculateWeightedFlexes(localHeight, fullHeight, relativeLocation);
    start.current.style.flex = startFlex;
    end.current.style.flex = endFlex;
    return {startRatio, endRatio};
}

function calculateWeightedFlexes(localSize: number, fullSize: number, relativeLocation: number): { start: string, startRatio: number, end: string, endRatio: number } {
    let localRatio = relativeLocation / localSize;
    localRatio = localRatio < 0 ? 0 : localRatio > 1 ? 1 : localRatio;
    let localToFullRatio = localSize / fullSize;
    localToFullRatio = localToFullRatio > 1 ? 1 : localToFullRatio;
    const startRatio = localRatio * localToFullRatio;
    const endRatio = (1 - localRatio) * localToFullRatio;
    return {start: `1 1 ${100.0 * startRatio}%`, startRatio, end: `1 1 ${100.0 * endRatio}%`, endRatio};
}

function onDragHorizontally(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
    calculateHorizontallyWeightedFlexes(start, end, event, data);
}

function onDragVertically(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
    calculateVerticallyWeightedFlexes(start, end, event, data);
}

function onStart(event: DraggableEvent, data: DraggableData): void {
    data.node.setAttribute('originalLeft', `${data.node.offsetLeft}`);
    data.node.setAttribute('originalTop', `${data.node.offsetTop}`);
}

function onStopHorizontally(onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
    data.node.setAttribute('originalLeft', `${data.node.offsetLeft - data.x}`);
    const {startRatio, endRatio} = calculateHorizontallyWeightedFlexes(start, end, event, data);
    data.node.removeAttribute('originalLeft');
    data.node.removeAttribute('originalTop');
    data.node.removeAttribute('style');
    onLayoutDivisionChange(pathToStart, startRatio, endRatio);
}

function onStopVertically(onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
    data.node.setAttribute('originalTop', `${data.node.offsetTop - data.y}`);
    const {startRatio, endRatio} = calculateVerticallyWeightedFlexes(start, end, event, data);
    data.node.removeAttribute('originalLeft');
    data.node.removeAttribute('originalTop');
    data.node.removeAttribute('style');
    onLayoutDivisionChange(pathToStart, startRatio, endRatio);
}

export default class ViewSetLayout extends PureComponent<Props> {
    buildTree(currentKey: string, {
        horizontal,
        group,
        keys,
        selected,
        vertical,
        weight,
    }: { horizontal?: any[], group?: string, keys?: string[], selected?: string, vertical?: any[], weight?: number }, keyedChildren: any) {
        const {onLayoutDivisionChange, onViewSelected} = this.props;
        const [orientation, subLayouts, axis, onDrag, onStop]:
            [string, any[], 'x' | 'y' | 'both' | 'none',
                (start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData) => void,
                (onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData) => void] =
            horizontal
                ? ['horizontal', horizontal, 'x', onDragHorizontally, onStopHorizontally]
                : vertical
                    ? ['vertical', vertical, 'y', onDragVertically, onStopVertically]
                    : [null, null, 'none', null, null];
        const style = {flex: `1 1 ${100.0 * weight}%`};
        if (orientation) {
            const nextKey = `${currentKey}${orientation[0]}`;
            const containerRef = createRef<HTMLDivElement>();
            return (
                <div className={`layout ${orientation}`} key={nextKey} style={style} ref={containerRef}>
                    {addSeparatorElement(
                        (i, list) => (
                            <Draggable
                                key={`separator-${i}`}
                                axis={axis}
                                handle=".layout-separator"
                                position={{x: 0, y: 0}}
                                onStart={onStart}
                                onDrag={onDrag.bind(null, list[i].ref, list[i + 1].ref)}
                                onStop={onStop.bind(null, onLayoutDivisionChange, `${nextKey}${i}`, list[i].ref, list[i + 1].ref)}
                            >
                                <div className="layout-separator"/>
                            </Draggable>
                        ),
                        subLayouts.map((subLayout, index) => this.buildTree(`${nextKey}${index}`, subLayout, keyedChildren))
                    )}
                </div>
            );
        } else {
            return (
                <div className="layout-content" key={group} style={style} ref={createRef()}>
                    <TabbedViewContainer containerId={group} selectedViewId={selected} onViewSelected={onViewSelected}>
                        {keys.map(key => keyedChildren[key])}
                    </TabbedViewContainer>
                </div>
            );
        }
    }

    render() {
        const {layout, children} = this.props;
        const keyedChildren = Children.toArray(children).reduce((acc: any, child: View) => {
            acc[child.props.viewId] = child;
            return acc;
        }, {});
        return this.buildTree('', layout, keyedChildren);
    }
};
