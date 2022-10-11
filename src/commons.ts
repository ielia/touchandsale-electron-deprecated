import React, {Component, JSXElementConstructor, PropsWithChildren, ReactComponentElement, ReactElement, ReactNode} from 'react';
// import {EmotionJSX} from '@emotion/react/types/jsx-namespace';
// import IntrinsicElements = EmotionJSX.IntrinsicElements;

/**
 * Add separator element interleaved in the list. This function does NOT modify the list passed as parameter,
 * but creates a new one with the elements of the original.
 * @param createSeparator Function which takes an integer zero-based index and the full original list of elements and returns a separator element (must be individual objects).
 * @param list List of elements to separate.
 * @returns The new list of elements.
 */
export function addSeparatorElement<T, S>(createSeparator: (index?: number, list?: T[]) => S, list: T[]): (T | S)[] {
    return list
        ? list.reduce((acc, e, i) => {
            if (i) acc.push(createSeparator(i - 1, list));
            acc.push(e);
            return acc;
        }, [])
        : list;
}

/**
 * Append shortcut key spec to the end of a string.
 * @param str Main string.
 * @param shortcutKey Shortcut key.
 * @returns A string composed by the main string passed as parameter and the shortcut key representation in parentheses.
 */
export function appendShortcutString(str: string, shortcutKey: ShortcutKey): string {
    return shortcutKey ? `${str} (${shortcutKeyToString(shortcutKey)})` : str;
}

/**
 * Filter members of an object into another. Leave members in the target untouched if not defined on the source.
 * @param source Source object.
 * @param target Target object.
 * @returns The target instance with filtered members from the source.
 */
export function filterMembers<S extends T, T>(source: S, target: T): T {
    for (const member in target) {
        if (member in source) {
            target[member] = source[member];
        }
    }
    return target;
}

export function getChildArray<T extends Component>(component: Component<{props: ReactElement<T> | ReactElement<T>[]}>): ReactElement<T>[] {
    const {children} = component.props;
    return Array.isArray(children) ? children : [children];
}

/**
 * Gets the "dot product" (actually, just the combined heading) of the two headings passed as parameters.
 * E.g., 'n', 'e' -> 'ne'.
 * @param a Heading A.
 * @param b Heading B.
 * @returns The dot product of the two compass headings passed as parameters.
 *          If headings are the same, will return a matching one.
 *          If opposite, will return null.
 *          If one or both either null or undefined, will also return null.
 */
export function getCompassHeadingDotProduct(a: CompassHeading, b: CompassHeading): CompassHeading | CompassCornerHeading {
    let result: CompassHeading | CompassCornerHeading = null;
    if (b !== getOppositeCompassHeading(a)) {
        if (a === b) {
            result = a ? a : null;
        } else if (a && b) {
            result = (a === 'n' || a === 's' ? a + b : b + a) as CompassCornerHeading;
        }
    }
    return result;
}

const COMPASS_OCTO_HEADING_CLASS_NAME_STRINGS: {[key in CompassOctoHeading]: string} = {
    n: 'top', ne: 'top-right', e: 'right', se: 'bottom-right', s: 'bottom', sw: 'bottom-left', w: 'left', nw: 'top-left',
};
/**
 * Gets the compass heading class name string representation.
 * E.g., 'ne' -> 'top-right'.
 * @param heading Heading.
 * @returns The class name string representation of the heading.
 */
export function getCompassOctoHeadingClassName(heading: CompassOctoHeading): string {
    return COMPASS_OCTO_HEADING_CLASS_NAME_STRINGS[heading];
}

const COMPASS_OCTO_HEADING_COMPONENTS: {[key in CompassOctoHeading]: CompassHeading[]} = {
    n: ['n'], ne: ['n', 'e'], e: ['e'], se: ['s', 'e'], s: ['s'], sw: ['s', 'w'], w: ['w'], nw: ['n', 'w'],
};
/**
 * Gets the compass octo-heading components.
 * E.g., 'ne' -> ['n', 'e'].
 * @param heading Heading.
 * @returns The compass heading (n/s/e/w) components.
 */
export function getCompassOctoHeadingComponents(heading: CompassOctoHeading): CompassHeading[] {
    return COMPASS_OCTO_HEADING_COMPONENTS[heading];
}

const OPPOSITE_COMPASS_HEADINGS: {[key in CompassHeading]: CompassHeading} = { e: 'w', n: 's', s: 'n', w: 'e' };
/**
 * Gets the opposite compass heading.
 * E.g., 'n' -> 's'.
 * @param heading Heading.
 * @returns The opposite heading to the one passed as parameter. Or undefined, if the parameter was of the same kind.
 */
export function getOppositeCompassHeading(heading: CompassHeading): CompassHeading {
    return OPPOSITE_COMPASS_HEADINGS[heading];
}

const ORTHOGONAL_COMPASS_HEADINGS: {[key in CompassHeading]: CompassHeading[]} = { e: ['n', 's'], n: ['e', 'w'], s: ['e', 'w'], w: ['n', 's'] };
/**
 * Gets the orthogonal compass headings.
 * E.g., 'n' -> ['e', 'w'].
 * @param heading Heading.
 * @returns The orthogonal headings to the one passed as parameter. Or undefined, if the parameter was of the same kind.
 */
export function getOrthogonalCompassHeadings(heading: CompassHeading): CompassHeading[] {
    return ORTHOGONAL_COMPASS_HEADINGS[heading];
}

/**
 * Checks in a KeyboardEvent for a shortcut key.
 * @param event Context keyboard event.
 * @param shortcutKey Shortcut key looked for.
 * @returns true if the key was pressed in the context of the event, false otherwise.
 */
export function isShortcutKeyPressed(event: KeyboardEvent, shortcutKey: ShortcutKey): boolean {
    // TODO: See what to do with the metaKey.
    return event.key.toUpperCase() === shortcutKey.key.toUpperCase()
        && !!event.altKey === !!shortcutKey.altKey
        && !!event.ctrlKey === !!shortcutKey.ctrlKey
        && !!event.metaKey === !!shortcutKey.metaKey
        && !!event.shiftKey === !!shortcutKey.shiftKey;
}

/**
 * Convert a list of elements to a dictionary based on a string key to be extracted from each element.
 * @param keyFunctor Function that takes an element of the list and returns the key.
 * @param list List of elements to convert to dictionary.
 * @returns An object serving as a dictionary with all non-overlapping elements from the argument list as values and keys extracted from those elements.
 *          The map will not necessarily be complete, i.e., may not result in having all keys from generic type "K".
 */
export function listToDictionary<K extends string, V>(keyFunctor: (element: V) => K, list: V[]): {[key in K]?: V} {
    return list.reduce((acc: {[key in K]?: V}, element) => {
        const key = keyFunctor(element);
        acc[key] = element;
        return acc;
    }, {} as {[key in K]?: V});
}

/**
 * Convert a list of elements to a dictionary with all keys of type "K" (extending string), to be extracted from each element.
 * @param keyFunctor Function that takes an element of the list and returns the key.
 * @param list List of elements to convert to dictionary.
 * @returns An object serving as a dictionary with all non-overlapping elements from the argument list as values and keys extracted from those elements.
 *          The dictionary will be complete, i.e., will have all possible keys from generic type "K".
 */
export function listToFullDictionary<K extends string, V>(keyFunctor: (element: V) => K, list: V[]): {[key in K]: V} {
    return list.reduce((acc: {[key in K]: V}, element) => {
        const key = keyFunctor(element);
        acc[key] = element;
        return acc;
    }, {} as {[key in K]: V});
}

/**
 * Returns the Manhattan distance from a point to a rectangle.
 * @param rect Rectangle.
 * @param x X coordinate of the point.
 * @param y X coordinate of the point.
 * @returns The manhattan distance.
 */
export function manhattanDistanceToRectangle(
    rect: {bottom: number, left: number, right: number, top: number} | {height: number, left: number, top: number, width: number},
    {x, y}: {x: number, y: number}
): number {
    const {left, top} = rect;
    let bottom: number, right: number;
    if ('height' in rect) {
        bottom = top + rect.height;
        right = left + rect.width;
    } else {
        bottom = rect.bottom;
        right = rect.right;
    }
    return (x < left ? left - x : x > right ? x - right : 0) + (y < top ? top - y : y > bottom ? y - bottom : 0);
}

/**
 * Converts a shortcut key specification into a short string.
 * E.g.,
 *     {key: 'x', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true} --> 'acmsX',
 *     {key: 'y'} --> 'Y'
 * @param shortcutKey Shortcut key representation.
 * @returns The short string representation of the shortcut key passed as parameter.
 */
export function shortcutKeyToShortString(shortcutKey?: ShortcutKey): string {
    const {altKey, ctrlKey, key, metaKey, shiftKey} = shortcutKey ?? {key: ''};
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'm' : ''}${altKey ? 'a' : ''}${ctrlKey ? 'c' : ''}${shiftKey ? 's' : ''}${key.toUpperCase()}`;
}

/**
 * Converts a shortcut key specification into a string.
 * E.g.,
 *     {key: 'x', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true} --> 'Alt+Ctrl+Meta+Shift+X',
 *     {key: 'y'} --> 'Y'
 * @param shortcutKey Shortcut key representation.
 * @returns The string representation of the shortcut key passed as parameter.
 */
export function shortcutKeyToString(shortcutKey?: ShortcutKey): string {
    const {altKey, ctrlKey, key, metaKey, shiftKey} = shortcutKey ?? {key: ''};
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'Meta+' : ''}${altKey ? 'Alt+' : ''}${ctrlKey ? 'Ctrl+' : ''}${shiftKey ? 'Shift+' : ''}${key.toUpperCase()}`;
}
