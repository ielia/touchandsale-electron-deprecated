import React, {PureComponent, ReactElement, ReactHTMLElement, ReactNode, RefObject, createRef} from 'react';
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';

import './_ViewSetLayout.scss';
import {addSeparatorElement} from '../commons';
import TabbedViewContainer from './TabbedViewContainer';
import View from './View';

type LayoutDivisionChangeListener = (pathToStart: string, startRatio: number, endRatio: number) => any;
type MaximizeContainerListener = (containerId: string) => any;
type MinimizeContainerListener = (containerId: string) => any;
type OrientedDragListener = (start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData) => any;
type OrientedDragStopListener = (onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData) => any;
type RestoreContainerListener = (containerId: string) => any;
type ViewSelectedListener = (containerId: string, viewId: string) => any;

interface Props {
    children: ReactElement<View> | ReactElement<View>[];
    layout: LayoutSpec;
    onLayoutDivisionChange: LayoutDivisionChangeListener;
    onMaximizeContainer: MaximizeContainerListener;
    onMinimizeContainer: MinimizeContainerListener;
    onRestoreContainer: RestoreContainerListener;
    onViewSelected: ViewSelectedListener;
    shownState?: NonMinimizedViewContainerState;
}

export default class ViewSetLayout extends PureComponent<Props> {
    protected onDrag: {[orientation in ComponentOrientation]: OrientedDragListener};
    protected onStop: {[orientation in ComponentOrientation]: OrientedDragStopListener};

    constructor(props: Props) {
        super(props);
        this.buildTree = this.buildTree.bind(this);
        this.onDrag = {
            horizontal: this.onDragHorizontally.bind(this),
            vertical: this.onDragVertically.bind(this),
        };
        this.onStart = this.onStart.bind(this);
        this.onStop = {
            horizontal: this.onStopHorizontally.bind(this),
            vertical: this.onStopVertically.bind(this),
        };
    }

    buildTree(currentKey: string, shownState: NonMinimizedViewContainerState, layoutSpec: LayoutSpec, keyedChildren: {[viewId: string]: ReactElement<View> & ReactNode}): ReactHTMLElement<HTMLDivElement> {
        const {onLayoutDivisionChange, onMaximizeContainer, onMinimizeContainer, onRestoreContainer, onViewSelected} = this.props;
        const style = {flex: `1 1 ${100.0 * layoutSpec.weight}%`};
        let result: React.ReactHTMLElement<HTMLDivElement> = null;
        if ('orientation' in layoutSpec) {
            const {orientation, children: subLayouts} = layoutSpec;
            const axis = layoutSpec.orientation === 'horizontal' ? 'x' : 'y';
            const nextKey = `${currentKey}${orientation[0]}`;
            const containerRef = createRef<HTMLDivElement>();
            const handleRef = createRef<HTMLDivElement>();
            const subLayoutElements = subLayouts.reduce((acc, subLayout, index) => {
                const subtree = this.buildTree(`${nextKey}${index}`, shownState, subLayout, keyedChildren);
                if (subtree) {
                    acc.push(subtree);
                }
                return acc;
            }, []);
            if (subLayoutElements.length) {
                result = (
                    <div className={`layout ${orientation}`} key={nextKey} style={style} ref={containerRef}>
                        {addSeparatorElement(
                            (i, list) => (
                                <Draggable
                                    key={`separator-${i}`}
                                    axis={axis}
                                    handle=".layout-separator"
                                    nodeRef={handleRef}
                                    position={{x: 0, y: 0}}
                                    onStart={this.onStart}
                                    onDrag={this.onDrag[orientation].bind(null, list[i].ref, list[i + 1].ref)}
                                    onStop={this.onStop[orientation].bind(null, onLayoutDivisionChange, `${nextKey}${i}`, list[i].ref, list[i + 1].ref)}
                                >
                                    <div className="layout-separator" ref={handleRef}/>
                                </Draggable>
                            ),
                            subLayoutElements
                        )}
                    </div>
                ) as React.ReactHTMLElement<HTMLDivElement>;
            }
        } else if ('groupId' in layoutSpec && layoutSpec.state === shownState) {
            const {groupId, selected, state, children} = layoutSpec;
            result = (
                <div className="layout-content" key={groupId} style={style} ref={createRef()}>
                    <TabbedViewContainer containerId={groupId} selectedViewId={selected} state={state} onMaximize={onMaximizeContainer} onMinimize={onMinimizeContainer} onRestore={onRestoreContainer} onViewSelected={onViewSelected}>
                        {children.map(child => keyedChildren[child])}
                    </TabbedViewContainer>
                </div>
            ) as React.ReactHTMLElement<HTMLDivElement>;
        }
        return result;
    }

    protected calculateHorizontallyWeightedFlexes(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): { startRatio: number, endRatio: number } {
        const localWidth = start.current.outerWidth(true) + end.current.outerWidth(true);
        const fullWidth = data.node.parentElement.outerWidth(true);
        const relativeLocation = parseInt(data.node.getAttribute('originalLeft')) + data.x - start.current.offsetLeft;
        return this.calculateOrientedWeightedFlexes(localWidth, fullWidth, relativeLocation, start, end);
    }

    protected calculateOrientedWeightedFlexes(localSize: number, fullSize: number, relativeLocation: number, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>): { startRatio: number, endRatio: number } {
        const {start: startFlex, startRatio, end: endFlex, endRatio} = this.calculateWeightedFlexes(localSize, fullSize, relativeLocation);
        start.current.style.flex = startFlex;
        end.current.style.flex = endFlex;
        return {startRatio, endRatio};
    }

    protected calculateVerticallyWeightedFlexes(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): { startRatio: number, endRatio: number } {
        const localHeight = start.current.outerHeight(true) + end.current.outerHeight(true);
        const fullHeight = data.node.parentElement.outerHeight(true);
        const relativeLocation = parseInt(data.node.getAttribute('originalTop')) + data.y - start.current.offsetTop;
        return this.calculateOrientedWeightedFlexes(localHeight, fullHeight, relativeLocation, start, end);
    }

    protected calculateWeightedFlexes(localSize: number, fullSize: number, relativeLocation: number): { start: string, startRatio: number, end: string, endRatio: number } {
        let localRatio = relativeLocation / localSize;
        localRatio = localRatio < 0 ? 0 : localRatio > 1 ? 1 : localRatio;
        let localToFullRatio = localSize / fullSize;
        localToFullRatio = localToFullRatio > 1 ? 1 : localToFullRatio;
        const startRatio = localRatio * localToFullRatio;
        const endRatio = (1 - localRatio) * localToFullRatio;
        return {start: `1 1 ${100.0 * startRatio}%`, startRatio, end: `1 1 ${100.0 * endRatio}%`, endRatio};
    }

    protected onDragHorizontally(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
        this.calculateHorizontallyWeightedFlexes(start, end, event, data);
    }

    protected onDragVertically(start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
        this.calculateVerticallyWeightedFlexes(start, end, event, data);
    }

    protected onStart(event: DraggableEvent, data: DraggableData): void {
        data.node.setAttribute('originalLeft', `${data.node.offsetLeft}`);
        data.node.setAttribute('originalTop', `${data.node.offsetTop}`);
    }

    protected onStopCommon(onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, data: DraggableData, startRatio: number, endRatio: number): void {
        data.node.removeAttribute('originalLeft');
        data.node.removeAttribute('originalTop');
        data.node.removeAttribute('style');
        onLayoutDivisionChange(pathToStart, startRatio, endRatio);
    }

    protected onStopHorizontally(onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
        data.node.setAttribute('originalLeft', `${data.node.offsetLeft - data.x}`);
        const {startRatio, endRatio} = this.calculateHorizontallyWeightedFlexes(start, end, event, data);
        this.onStopCommon(onLayoutDivisionChange, pathToStart, data, startRatio, endRatio);
    }

    protected onStopVertically(onLayoutDivisionChange: LayoutDivisionChangeListener, pathToStart: string, start: RefObject<HTMLDivElement>, end: RefObject<HTMLDivElement>, event: DraggableEvent, data: DraggableData): void {
        data.node.setAttribute('originalTop', `${data.node.offsetTop - data.y}`);
        const {startRatio, endRatio} = this.calculateVerticallyWeightedFlexes(start, end, event, data);
        this.onStopCommon(onLayoutDivisionChange, pathToStart, data, startRatio, endRatio);
    }

    render() {
        const {layout, shownState = 'normal', children} = this.props;
        let childArray = Array.isArray(children) ? children : [children];
        const keyedChildren = childArray.reduce((acc: {[viewId: string]: ReactElement<View> & ReactNode}, child: ReactElement<View> & ReactNode) => {
            acc[child.props.viewId] = child;
            return acc;
        }, {});
        return this.buildTree('', shownState, layout, keyedChildren) ?? <div className="layout empty"/>;
    }
};
