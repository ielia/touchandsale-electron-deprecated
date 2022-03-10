import {Component} from 'react';

export default function BrandedComponentFactory<T extends Component>(brandPackage: string, component: string): { new(): T } {
    return require(`${brandPackage}/${component}`).default;
};
