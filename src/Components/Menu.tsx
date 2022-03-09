import React, {PureComponent} from 'react';

import './Menu.scss';

interface Props {
    orientation?: ComponentOrientation;
}

export default class Menu extends PureComponent<Props> {
    render() {
        const {orientation = 'horizontal', children} = this.props;
        return (
            <div className={`menu ${orientation}`}>
                {children}
            </div>
        );
    }
};
