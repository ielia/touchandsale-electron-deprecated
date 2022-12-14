import React, {MouseEvent, PureComponent, TouchEvent} from 'react';
import WindowIcon from '@mui/icons-material/Window';

export interface Props {
    onClick: (event: MouseEvent | TouchEvent) => void;
}

export default class RestoreButton extends PureComponent<Props> {
    render() {
        const {onClick} = this.props;
        return (
            <WindowIcon onClick={onClick} onTouchEnd={onClick}/>
        );
    }
};
