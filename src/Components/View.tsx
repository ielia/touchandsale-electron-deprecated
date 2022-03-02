import React, {PureComponent} from 'react';

import {ShortcutKey} from '../commons';

interface Props {
    actions?: any;
    className?: string;
    label: string;
    maximized?: boolean;
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
