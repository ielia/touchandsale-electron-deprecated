import React from 'react';

import './_ViewTab.scss';
import {appendShortcutString, shortcutKeyToShortString} from '../../../commons';
import ViewTab from '../../ViewTab';

export default class EclipseRCPViewTab extends ViewTab {
    render() {
        const {color, label, selected, shortcutKey, zIndex} = this.props;
        const title = appendShortcutString(label, shortcutKey);
        return (
            <div className={`view-tab${selected ? ' selected' : ''}`} tabIndex={selected ? 1 : -1} style={{zIndex: `${zIndex}`}} title={title} onClick={this.handleClick}
                 onKeyDown={this.handleKeyDown} ref={this.selfRef}>
                <div className="outline">
                    <div className="label">{label}</div>
                    <div className="shortcut" style={{backgroundColor: color.hexa()}}>{shortcutKeyToShortString(shortcutKey)}</div>
                </div>
            </div>
        );
    }
};
