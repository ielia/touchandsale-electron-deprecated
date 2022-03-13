import React, {MouseEvent, PureComponent, TouchEvent} from 'react';
import WindowIcon from '@mui/icons-material/Window';

interface Props {
    onClick: (event: MouseEvent | TouchEvent) => any;
}

export default class RestoreButton extends PureComponent<Props> {
    render() {
        const {onClick} = this.props;
        return (
            <WindowIcon onClick={onClick} onTouchEnd={onClick}/>
        );
    }
};
