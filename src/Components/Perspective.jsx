import {PureComponent} from 'react';

import '../commons';
import './Perspective.scss';
import Menu from './Menu';
import MenuSection from './MenuSection';
import PerspectiveSelector from './PerspectiveSelector';

export default class Perspective extends PureComponent {
    render() {
        // const {children, className, label, menuSections, shortcutKey} = this.props;
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
