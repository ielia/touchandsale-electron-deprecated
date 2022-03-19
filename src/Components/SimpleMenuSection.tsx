import React from 'react';

import BaseMenuSection, {Props} from './MenuSection';
import getBrandedComponent from './branding';
const MenuSection = getBrandedComponent<BaseMenuSection>('MenuSection') as typeof BaseMenuSection;

export default class SimpleMenuSection extends MenuSection {
    static defaultProps = {
        type: 'simple-menu-section',
    };

    constructor(props: Props) {
        super(props);
    }
};
