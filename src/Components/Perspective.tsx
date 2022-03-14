import Color from 'color';
import React, {PureComponent, ReactElement} from 'react';

import './_Perspective.scss';

import '../commons';
import Menu from './Menu';
import MenuSection from './MenuSection';
import PerspectiveSelector from './PerspectiveSelector';

interface Props {
    accentColor: Color;
    className: string;
    label: string;
    menuSections: ReactElement<MenuSection>[];
    shortcutKey: string;
}

export default class Perspective extends PureComponent<Props> {
    render() {
        const {accentColor, children, className, label, menuSections} = this.props;
        return (
            <div className={`perspective ${className}`}>
                <Menu>
                    <MenuSection>
                        <PerspectiveSelector accentColor={accentColor} label={label}/>
                    </MenuSection>
                    {menuSections}
                    <MenuSection>
                        <div className="TnS-about"/>
                        <div className="zWeb-link"/>
                    </MenuSection>
                </Menu>
                <div className="body">
                    {children}
                </div>
            </div>
        );
    }
};
