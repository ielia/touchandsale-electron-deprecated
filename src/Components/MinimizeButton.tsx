import React, {MouseEvent, PureComponent, TouchEvent} from 'react';
import MinimizeIcon from '@mui/icons-material/Minimize';

export interface Props {
    onClick: (event: MouseEvent | TouchEvent) => void;
}

export default class MinimizeButton extends PureComponent<Props> {
    render() {
        const {onClick} = this.props;
        return (
            <MinimizeIcon onClick={onClick} onTouchEnd={onClick}/>
        );
    }
};
