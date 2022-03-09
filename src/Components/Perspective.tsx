import React, {PureComponent, ReactElement} from 'react';

import '../commons';
import './Perspective.scss';
import Menu from './Menu';
import MenuSection from './MenuSection';
import PerspectiveSelector from './PerspectiveSelector';

interface Props {
    className: string;
    label: string;
    menuSections: ReactElement<MenuSection>[];
    shortcutKey: string;
}

export default class Perspective extends PureComponent<Props> {
    render() {
        const {children, className, label, menuSections} = this.props;
        return (
            <div className={`perspective ${className}`}>
                <Menu>
                    <MenuSection>
                        <PerspectiveSelector label={label}/>
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
