import React, {Children, PureComponent} from 'react';

import './ViewSetLayout.scss';
import TabbedViewContainer from './TabbedViewContainer';
import View from './View';

type ViewSelectedListener = (containerId: string, viewId: string) => boolean | void;

interface Props {
    layout: any;
    onViewSelected: ViewSelectedListener;
}

export default class ViewSetLayout extends PureComponent<Props> {
    buildTree(currentKey: string, {
        horizontal,
        group,
        keys,
        selected,
        vertical,
        weight
    }: { horizontal?: any[], group?: string, keys?: string[], selected?: string, vertical?: any[], weight?: number }, keyedChildren: any, onViewSelected: ViewSelectedListener) {
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
                    <TabbedViewContainer containerId={group} selectedViewId={selected} onViewSelected={onViewSelected}>
                        {keys.map(key => keyedChildren[key])}
                    </TabbedViewContainer>
                </div>
            );
        }
    }

    render() {
        const {layout, children, onViewSelected} = this.props;
        const keyedChildren = Children.toArray(children).reduce((acc: any, child: View) => {
            acc[child.props.viewId] = child;
            return acc;
        }, {});
        return this.buildTree('', layout, keyedChildren, onViewSelected);
    }
};
