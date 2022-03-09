import React, {PureComponent} from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';

import './MenuSection.scss';

interface Props {
    className?: string;
}

export default class MenuSection extends PureComponent<Props> {
    render() {
        const {className, children} = this.props;
        return (
            <div className={`menu-section ${className}`}>
                <DragIndicator className="handle"/>
                {children}
            </div>
        );
    }
};
