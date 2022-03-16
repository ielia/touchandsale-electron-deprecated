import {Component} from 'react';

// TODO: Should I use a namespace?
const BRANDS: string[] = [];

export class ComponentNotFoundException extends Error {}

export class InvalidBrandSpecTypeException extends Error {}

export function setBrands(...brands: string[]) {
    brands.forEach(brand => {
        if (typeof brand !== 'string') {
            throw new InvalidBrandSpecTypeException();
        }
    });
    BRANDS.splice(0, BRANDS.length, ...brands);
}

export function BrandedComponentFactory(...brandPackages: string[]): <T extends Component>(componentName: string) => { new(): T } {
    return <T extends Component>(componentName: string): { new(): T } => {
        let component: { new(): T };
        const brandPackagesSearchedFor = brandPackages.concat(['./brands/basic', '.']);
        let i = 0;
        while (!component && i < brandPackagesSearchedFor.length) {
            const brandPackage = brandPackagesSearchedFor[i++];
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
}

const getBrandedComponent = <T extends Component>(componentName: string): { new(): T } => BrandedComponentFactory(...BRANDS)(componentName);
export default getBrandedComponent;
