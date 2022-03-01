import {PureComponent} from 'react';

export default class View extends PureComponent {
    render() {
        // const {label, className, shortcutKeys, actions, selected, maximized, children} = this.props;
        const children = this.props.children;
        return (
            <div className="className">
                {children}
            </div>
        );
    }
};
