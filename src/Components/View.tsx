import Color from 'color';
import React, {PureComponent} from 'react';

interface Props {
    actions?: any; // TODO: See what to do with these actions.
    className?: string;
    color: Color;
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
