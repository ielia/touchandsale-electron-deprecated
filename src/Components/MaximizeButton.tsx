import React, {MouseEvent, PureComponent, TouchEvent} from 'react';
import MaximizeIcon from '@mui/icons-material/Maximize';

interface Props {
    onClick: (event: MouseEvent | TouchEvent) => any;
}

export default class MaximizeButton extends PureComponent<Props> {
    render() {
        const {onClick} = this.props;
        return (
            <MaximizeIcon onClick={onClick} onTouchEnd={onClick}/>
        );
    }
};
