import {RefObject} from 'react';

type Constructor<C = {}> = new (...args: any[]) => C;

type WrappedType<T, E> = T & Constructor<{ selfRef: RefObject<E>, offsetBottom: number, offsetLeft: number, offsetRight: number, offsetTop: number }>;

// TODO: Find a better name for these.
export default function Wrapped<T extends Constructor<{ selfRef: RefObject<E> }>, E extends HTMLElement>(Base: T): WrappedType<T, E> {
    return class WrappedComponent extends Base {
        get offsetBottom(): number {
            const selfElement = this.selfRef.current;
            return selfElement ? selfElement.offsetTop + selfElement.offsetHeight : null;
        }

        get offsetLeft(): number {
            const selfElement = this.selfRef.current;
            return selfElement ? selfElement.offsetLeft : null;
        }

        get offsetRight(): number {
            const selfElement = this.selfRef.current;
            return selfElement ? selfElement.offsetLeft + selfElement.offsetWidth : null;
        }

        get offsetTop(): number {
            const selfElement = this.selfRef.current;
            return selfElement ? selfElement.offsetTop : null;
        }
    }
}
