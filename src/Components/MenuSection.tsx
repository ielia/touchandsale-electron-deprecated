import React, {PureComponent, RefObject} from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';

import './_MenuSection.scss';

interface Props {
    className?: string;
    wrapperRef?: RefObject<HTMLElement>;
}

export default class MenuSection extends PureComponent<Props> {
    render() {
        const {children, className, wrapperRef} = this.props;
        // What can one do if the component receives a ref to a more basic object? Cast it? Well, there it is below:
        const wrapperRefAttr = wrapperRef ? {ref: wrapperRef as RefObject<HTMLDivElement>} : {};
        return (
            <div className={`menu-section ${className ?? ''}`} {...wrapperRefAttr}>
                <DragIndicator className="handle"/>
                {children}
            </div>
        );
    }
};
