import Color from 'color';
import React, {PureComponent, ReactElement} from 'react';
import WindowIcon from '@mui/icons-material/Window';

import './_MinimizedViewContainer.scss';
import MenuSection from './MenuSection';
import View from './View';
import ViewIcon from './ViewIcon';

interface Props {
    children: ReactElement<View> | ReactElement<View>[];
    containerId: string;
    onRestore: (containerId: string) => void;
}

export default class MinimizedViewContainer extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.handleRestoreIconClick = this.handleRestoreIconClick.bind(this);
    }

    handleRestoreIconClick() {
        this.props.onRestore(this.props.containerId);
    }

    render() {
        const {children} = this.props;
        const childArray = Array.isArray(children) ? children : [children];
        return (
            <MenuSection className="minimized-view-container">
                <WindowIcon className="restore-button" onClick={this.handleRestoreIconClick}/>
                {childArray.map(({props: {color, iconLabel, label, shortcutKey, viewId}}) => (
                    <ViewIcon key={viewId} color={color} label={iconLabel} title={label} shortcutKey={shortcutKey}/>
                ))}
            </MenuSection>
        );
    }
};
