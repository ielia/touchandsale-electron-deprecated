import React from 'react';

import './ViewSetLayout.scss';
import TabbedViewContainer from './TabbedViewContainer';

const buildRecursively = (currentKey, {horizontal, group, keys, selected, vertical, weight}, keyedChildren) => {
    const [orientation, subLayouts] = horizontal ? ['horizontal', horizontal] : vertical ? ['vertical', vertical] : [null, null];
    const style = {flex: `1 1 ${100.0 * weight}%`};
    if (orientation) {
        const nextKey = `${currentKey}${orientation[0]}`;
        return (
            <div className={`layout ${orientation}`} key={nextKey} style={style}>
                {subLayouts.map((subLayout, index) => buildRecursively(`${nextKey}${index}`, subLayout, keyedChildren))}
            </div>
        );
    } else {
        return (
            <div className="layout-content" key={group} style={style}>
                <TabbedViewContainer selectedViewKey={selected}>
                    {keys.map(key => keyedChildren[key])}
                </TabbedViewContainer>
            </div>
        );
    }
}

export default function ViewSetLayout({layout, children}) {
    const keyedChildren = children.reduce((acc, child) => {
        acc[child.key] = child;
        return acc;
    }, {});
    return buildRecursively('', layout, keyedChildren);
}
