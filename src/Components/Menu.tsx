import React, {MouseEvent, PureComponent, ReactElement, RefObject, createRef} from 'react';
import mergeRefs from 'react-merge-refs';

import './_Menu.scss';

import {getChildArray} from '../commons';
import Wrapped from './mixins/WrappedComponent';
import BaseMenuSection from './MenuSection';

/*
export class ChildrenNotAcceptable extends Error {
    children: ReactElement[];

    constructor(children:ReactElement[], message: string) {
        super(message);
        this.children = children;
    }
}
*/

export interface Props {
    // accepts?: string[];
    children?: ReactElement<InstanceType<typeof BaseMenuSection>> | ReactElement<InstanceType<typeof BaseMenuSection>>[];
    draggingSection?: ReactElement<InstanceType<typeof BaseMenuSection>>;
    menuId: string;
    onSectionDropIn?: (type: string, menuId: string, sections: {sectionId: string, type: string}[]) => void;
    orientation?: ComponentOrientation;
    wrapperRef?: RefObject<HTMLElement>;
}

class Menu extends PureComponent<Props> {
    selfRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.selfRef = createRef();

        /* TODO: See if this makes sense...
        const {accepts} = this.props;
        if (accepts) {
            const childArray = getChildArray(this);
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
        */
    }

    handleMouseOver(event: MouseEvent<HTMLDivElement>): void {
        if (this.props.draggingSection) {
            console.log('<><><><><> Menu.handleMouseOver:', event);
        }
    }

    handleMouseUp(event: MouseEvent<HTMLDivElement>): void {
        const {draggingSection, onSectionDropIn} = this.props;
        if (draggingSection && onSectionDropIn) {
            const {menuId} = this.props;
            // const childArray = getChildArray(this);
            const childArray = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
            console.log('<><><><><> Menu.handleMouseUp:', event);
            // onSectionDropIn(draggingSection.props.type, menuId, childArray.map(child => ({sectionId: child.props.sectionId, type: child.props.type})));
        }
    }

    render() {
        const {children, orientation = 'horizontal', wrapperRef} = this.props;
        const ref = mergeRefs<HTMLDivElement>([this.selfRef, wrapperRef as RefObject<HTMLDivElement>]);
        return (
            <div className={`menu ${orientation}`} onMouseOver={this.handleMouseOver} onMouseUp={this.handleMouseOver} ref={ref}>
                {children}
            </div>
        );
    }
}
export default Wrapped(Menu);
