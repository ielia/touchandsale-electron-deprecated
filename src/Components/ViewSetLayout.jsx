import {PureComponent} from 'react';

import './ViewSetLayout.scss';
import TabbedViewContainer from './TabbedViewContainer';

export default class ViewSetLayout extends PureComponent {
    buildTree(currentKey, {horizontal, group, keys, selected, vertical, weight}, keyedChildren, onViewSelected) {
        const [orientation, subLayouts] = horizontal ? ['horizontal', horizontal] : vertical ? ['vertical', vertical] : [null, null];
        const style = {flex: `1 1 ${100.0 * weight}%`};
        if (orientation) {
            const nextKey = `${currentKey}${orientation[0]}`;
            return (
                <div className={`layout ${orientation}`} key={nextKey} style={style}>
                    {subLayouts.map((subLayout, index) => this.buildTree(`${nextKey}${index}`, subLayout, keyedChildren, onViewSelected))}
                </div>
            );
        } else {
            return (
                <div className="layout-content" key={group} style={style}>
                    <TabbedViewContainer containerId={group} selectedViewKey={selected} onViewSelected={onViewSelected}>
                        {keys.map(key => keyedChildren[key])}
                    </TabbedViewContainer>
                </div>
            );
        }
    }

    render() {
        const {layout, children, onViewSelected} = this.props;
        const keyedChildren = children.reduce((acc, child) => {
            acc[child.key] = child;
            return acc;
        }, {});
        return this.buildTree([], layout, keyedChildren, onViewSelected);
    }
};
