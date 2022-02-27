import React from 'react';

import Menu from './Menu';
import MenuSection from './MenuSection';
import PerspectiveSelector from "./PerspectiveSelector";
import './Perspective.scss';

export default function Perspective({name, shortcutKeys, className, menuSections, children}) {
    return (
        <div className={`perspective ${className}`}>
            <Menu>
                <MenuSection>
                    <PerspectiveSelector name={name}/>
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
};
