import React, {MouseEvent, PureComponent, TouchEvent} from 'react';
import MaximizeIcon from '@mui/icons-material/Maximize';

export interface Props {
    onClick: (event: MouseEvent | TouchEvent) => void;
}

export default class MaximizeButton extends PureComponent<Props> {
    render() {
        const {onClick} = this.props;
        return (
            <MaximizeIcon onClick={onClick} onTouchEnd={onClick}/>
        );
    }
};
