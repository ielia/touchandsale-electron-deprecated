import {PureComponent} from 'react';

export default class View extends PureComponent {
    componentDidMount() {
        const {perspective, shortcutKey, viewId} = this.props;
        if (perspective && shortcutKey && viewId) {
            perspective.registerViewShortcut(shortcutKey, viewId);
        }
    }

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
