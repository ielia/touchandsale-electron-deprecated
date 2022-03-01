import {PureComponent} from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';

import './MenuSection.scss';

export default class MenuSection extends PureComponent {
    render() {
        return (
            <div className="menu-section">
                <DragIndicator className="handle"/>
                {this.props.children}
            </div>
        );
    }
};
