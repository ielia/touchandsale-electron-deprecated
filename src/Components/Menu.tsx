import React, {PureComponent} from 'react';

import './Menu.scss';

export default class Menu extends PureComponent {
    render() {
        return (
            <div className="menu">
                {this.props.children}
            </div>
        );
    }
};
