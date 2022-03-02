import {PureComponent} from 'react';

export default class View extends PureComponent {
    render() {
        // const {label, className, shortcutKey, actions, selected, maximized, children} = this.props;
        const children = this.props.children;
        return (
            <div className="className">
                {children}
            </div>
        );
    }
};
