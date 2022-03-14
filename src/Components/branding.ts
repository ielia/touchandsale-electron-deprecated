import {Component} from 'react';

export class ComponentNotFoundException extends Error {
}

export default function BrandedComponentFactory(...brandPackages: string[]): <T extends Component>(componentName: string) => { new(): T } {
    return <T extends Component>(componentName: string) => {
        let component: { new(): T };
        const brandPackagesSearchedFor = brandPackages.concat(['./brands/basic/', './']);
        let i = 0;
        while (!component && i < brandPackagesSearchedFor.length) {
            const brandPackage = brandPackagesSearchedFor[i];
            try {
                component = require(`${brandPackage}/${componentName}`).default;
            } catch (exception) {
            }
        }
        if (!component) {
            throw new ComponentNotFoundException(`Couldn't find ${componentName} under packages ${brandPackages}, nor in the internal ones.`);
        }
        return component;
    }
};
