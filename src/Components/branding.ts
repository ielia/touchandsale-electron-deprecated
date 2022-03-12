import {Component} from 'react';

export default function BrandedComponentFactory(brandPackage: string): <T extends Component>(componentName: string) => { new(): T } {
    return <T extends Component>(componentName: string) => {
        let component: { new(): T };
        try {
            component = require(`${brandPackage}/${componentName}`).default;
        } catch (exception) {
            try {
                component = require(`./brands/basic/${componentName}`).default;
            } catch (exception) {
                component = require(`./${componentName}`).default;
            }
        }
        return component;
    }
};
