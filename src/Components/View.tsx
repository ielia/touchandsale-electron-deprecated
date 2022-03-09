import React, {PureComponent} from 'react';

interface Props {
    actions?: any; // TODO: See what to do with this.
    className?: string;
    label: string;
    iconLabel?: string;
    selected?: boolean;
    shortcutKey?: ShortcutKey;
    viewId?: string;
}

export default class View extends PureComponent<Props> {
    render() {
        const children = this.props.children;
        return (
            <div className="className">
                {children}
            </div>
        );
    }
};
