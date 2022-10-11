import React, {Component, DragEvent, PureComponent, ReactElement, RefObject, createRef} from 'react';
import Draggable, {DraggableData} from 'react-draggable';
import mergeRefs from 'react-merge-refs';
import DragIndicator from '@mui/icons-material/DragIndicator';

import './_MenuSection.scss';

import Wrapped from './mixins/WrappedComponent';

export interface Props<C extends Component = Component> {
    className?: string;
    children: ReactElement<C> | ReactElement<C>[];
    draggable?: boolean;
    hung?: boolean;
    onDrag?: (type: string, sectionId: string, x: number, y: number, elementRectangle: {bottom: number, left: number, right: number, top: number}) => void;
    onDragStart?: (type: string, sectionId: string) => void;
    onDragEnd?: (type: string, sectionId: string) => void;
    sectionId: string;
    type?: string;
    wrapperRef?: RefObject<HTMLElement>;
}

class MenuSection<C extends Component = Component, P extends Props<C> = Props<C>> extends PureComponent<P> {
    static defaultProps = {
        type: 'menu-section',
    };

    dragStartLeft: number;
    dragStartTop: number;
    handleRef: RefObject<HTMLElement>;
    lastPositionOffsetX: number;
    lastPositionOffsetY: number;
    selfRef: RefObject<HTMLElement>;

    constructor(props: P) {
        super(props);

        this.buildContent = this.buildContent.bind(this);
        this.buildDragHandle = this.buildDragHandle.bind(this);
        this.buildPositionOffsetObject = this.buildPositionOffsetObject.bind(this);
        this.buildVariableBoundsObject = this.buildVariableBoundsObject.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleRef = createRef();
        this.selfRef = createRef();
    }

    buildContent(): ReactElement {
        return <>{this.props.children}</>;
    }

    buildDragHandle(ref: RefObject<Element>) {
        return (
            <DragIndicator key="handle" className="handle" ref={ref as RefObject<SVGSVGElement>}/>
        );
    }

    buildPositionOffsetObject(): {x: number, y: number} {
        const self = this;
        const selfRef = this.selfRef;
        return {
            get x() { return Number.isFinite(self.dragStartLeft) ? self.dragStartLeft - (selfRef.current ? selfRef.current.offsetLeft : 0) : 0; },
            get y() { return Number.isFinite(self.dragStartTop) ? self.dragStartTop - (selfRef.current ? selfRef.current.offsetTop : 0) : 0; },
        }
    }

    buildVariableBoundsObject(): {bottom: number, left: number, right: number, top: number} {
        const self = this;
        const selfRef = this.selfRef;
        return {
            get bottom() { return document.documentElement.scrollHeight - (selfRef.current ? self.dragStartTop + selfRef.current.offsetHeight : 0) - 1; },
            get left() { return -(self.dragStartLeft ?? 0); },
            get right() { return document.documentElement.scrollWidth - (selfRef.current ? self.dragStartLeft + selfRef.current.offsetWidth : 0) - 1; },
            get top() { return -(self.dragStartTop ?? 0); },
        };
    }

    getMainClassName() {
        return `menu-section ${this.props.className ?? ''} ${this.props.hung ? 'hung' : ''}`;
    }

    handleDrag(event: DragEvent<HTMLDivElement>, data: DraggableData): void {
        const {onDrag, sectionId, type} = this.props;
        // console.log('MenuSection.onDrag (', this.props.sectionId, ') event:', event, '| data:', data, '| pageX:', event.pageX, '| pageY:', event.pageY);
        const selfElement = this.selfRef.current;
        selfElement.style.marginBottom = `${-selfElement.offsetHeight}px`;
        selfElement.style.marginRight = `${-selfElement.offsetWidth}px`;
        this.lastPositionOffsetX = this.dragStartLeft;
        this.lastPositionOffsetY = this.dragStartTop;
        if (onDrag) {
            const {left, right, top, bottom} = selfElement.getBoundingClientRect()
            onDrag(type, sectionId, event.pageX, event.pageY, {bottom, left, right, top});
        }
    }

    handleDragEnd(event: DragEvent<HTMLDivElement>, data: DraggableData): void {
        const {onDragEnd, sectionId, type} = this.props;
        console.log('MenuSection.onDragEnd (', sectionId, ') event:', event);
        if (onDragEnd) {
            onDragEnd(type, sectionId);
        }
    }

    handleDragStart(event: DragEvent<HTMLDivElement>, data: DraggableData): void {
        const {onDragStart, sectionId, type} = this.props;
        console.log('MenuSection.onDragStart (', sectionId, ') event:', event);
        if (onDragStart) {
            onDragStart(type, sectionId);
        }
    }

    handleMouseDown(event: MouseEvent) {
        console.log('MenuSection.onMouseDown (', this.props.sectionId, ') event:', event);
        const selfElement = this.selfRef.current;
        this.dragStartLeft = this.lastPositionOffsetX ?? selfElement.offsetLeft;
        this.dragStartTop = this.lastPositionOffsetY ?? selfElement.offsetTop;
    }

    render() {
        const {draggable = true, sectionId, type, wrapperRef} = this.props;
        // What can one do if the component receives a ref to a more basic object? Cast it? Well, there it is below:
        const wrapperRefAttr = {ref: mergeRefs<HTMLDivElement>([
            wrapperRef as RefObject<HTMLDivElement>,
            this.selfRef as RefObject<HTMLDivElement>,
        ])};
        if (draggable) {
            return (
                <Draggable axis="both" defaultClassNameDragging="dragging" handle=".handle" nodeRef={this.selfRef}
                           bounds={this.buildVariableBoundsObject()} positionOffset={this.buildPositionOffsetObject()}
                           onDrag={this.handleDrag} onStart={this.handleDragStart} onStop={this.handleDragEnd} onMouseDown={this.handleMouseDown}
                >
                    <div className={this.getMainClassName()} data-section-id={sectionId} data-section-type={type} {...wrapperRefAttr}>
                        {this.buildDragHandle(this.handleRef)}
                        <div className="menu-section-body">
                            {this.buildContent()}
                        </div>
                    </div>
                </Draggable>
            );
        } else {
            return (
                <div className={this.getMainClassName()} data-section-id={sectionId} data-section-type={type} {...wrapperRefAttr}>
                    <div className="menu-section-body">
                        {this.buildContent()}
                    </div>
                </div>
            );
        }
    }
}
export default Wrapped(MenuSection);
