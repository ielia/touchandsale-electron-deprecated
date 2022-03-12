import React, {MouseEvent, PureComponent, TouchEvent} from 'react';
import MinimizeIcon from '@mui/icons-material/Minimize';

interface Props {
    onClick: (event: MouseEvent | TouchEvent) => any;
}

export default class MinimizeButton extends PureComponent<Props> {
    render() {
        const {onClick} = this.props;
        return (
            <MinimizeIcon onClick={onClick} onTouchEnd={onClick}/>
        );
    }
};
