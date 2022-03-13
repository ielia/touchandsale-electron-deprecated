/**
 * Add separator element interleaved in the list. This function does NOT modify the list passed as parameter,
 * but creates a new one with the elements of the original.
 * @param createSeparator Function which takes an integer zero-based index and the full original list of elements and returns a separator element (must be individual objects).
 * @param list List of elements to separate.
 * @returns The new list of elements.
 */
function addSeparatorElement<T, S>(createSeparator: (index?: number, list?: T[]) => S, list: T[]): (T | S)[] {
    return list
        ? list.reduce((acc, e, i) => {
            if (i) acc.push(createSeparator(i - 1, list));
            acc.push(e);
            return acc;
        }, [])
        : list;
}
export {addSeparatorElement};

/**
 * Append shortcut key spec to the end of a string.
 * @param str Main string.
 * @param shortcutKey Shortcut key.
 * @returns A string composed by the main string passed as parameter and the shortcut key representation in parentheses.
 */
function appendShortcutString(str: string, shortcutKey: ShortcutKey): string {
    return shortcutKey ? `${str} (${shortcutKeyToString(shortcutKey)})` : str;
}
export {appendShortcutString};

const COMPASS_OCTO_HEADING_CLASS_NAME_STRINGS: {[key in CompassOctoHeading]: string} = {
    n: 'top', ne: 'top-right', e: 'right', se: 'bottom-right', s: 'bottom', sw: 'bottom-left', w: 'left', nw: 'top-left',
};
/**
 * Gets the compass heading class name string representation.
 * E.g., 'n' -> 's'.
 * @param heading Heading.
 * @returns The class name string representation of the heading.
 */
function getCompassOctoHeadingClassName(heading: CompassOctoHeading): string {
    return COMPASS_OCTO_HEADING_CLASS_NAME_STRINGS[heading];
}
export {getCompassOctoHeadingClassName};

/**
 * Gets the "dot product" (actually, just the combined heading) of the two headings passed as parameters.
 * E.g., 'n' -> 's'.
 * @param a Heading A.
 * @param b Heading B.
 * @returns The dot product of the two compass headings passed as parameters.
 *          If headings are the same, will return a matching one.
 *          If opposite, will return null.
 *          If one or both either null or undefined, will also return null.
 */
function getCompassHeadingDotProduct(a: CompassHeading, b: CompassHeading): CompassHeading | CompassCornerHeading {
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
export {getCompassHeadingDotProduct};

const OPPOSITE_COMPASS_HEADINGS: {[key in CompassHeading]: CompassHeading} = { e: 'w', n: 's', s: 'n', w: 'e' };
/**
 * Gets the opposite compass heading.
 * E.g., 'n' -> 's'.
 * @param heading Heading.
 * @returns The opposite heading to the one passed as parameter. Or undefined, if the parameter was of the same kind.
 */
function getOppositeCompassHeading(heading: CompassHeading): CompassHeading {
    return OPPOSITE_COMPASS_HEADINGS[heading];
}
export {getOppositeCompassHeading};

const ORTHOGONAL_COMPASS_HEADINGS: {[key in CompassHeading]: CompassHeading[]} = { e: ['n', 's'], n: ['e', 'w'], s: ['e', 'w'], w: ['n', 's'] };
/**
 * Gets the orthogonal compass headings.
 * E.g., 'n' -> ['e', 'w'].
 * @param heading Heading.
 * @returns The orthogonal headings to the one passed as parameter. Or undefined, if the parameter was of the same kind.
 */
function getOrthogonalCompassHeadings(heading: CompassHeading): CompassHeading[] {
    return ORTHOGONAL_COMPASS_HEADINGS[heading];
}
export {getOrthogonalCompassHeadings};

/**
 * Converts a shortcut key specification into a short string.
 * E.g.,
 *     {key: 'x', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true} --> 'acmsX',
 *     {key: 'y'} --> 'Y'
 * @param shortcutKey Shortcut key representation.
 * @returns The short string representation of the shortcut key passed as parameter.
 */
function shortcutKeyToShortString(shortcutKey?: ShortcutKey): string {
    const {altKey, ctrlKey, key, metaKey, shiftKey} = shortcutKey ?? {key: ''};
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'm' : ''}${altKey ? 'a' : ''}${ctrlKey ? 'c' : ''}${shiftKey ? 's' : ''}${key.toUpperCase()}`;
}
export {shortcutKeyToShortString};

/**
 * Converts a shortcut key specification into a string.
 * E.g.,
 *     {key: 'x', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true} --> 'Alt+Ctrl+Meta+Shift+X',
 *     {key: 'y'} --> 'Y'
 * @param shortcutKey Shortcut key representation.
 * @returns The string representation of the shortcut key passed as parameter.
 */
function shortcutKeyToString(shortcutKey?: ShortcutKey): string {
    const {altKey, ctrlKey, key, metaKey, shiftKey} = shortcutKey ?? {key: ''};
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'Meta+' : ''}${altKey ? 'Alt+' : ''}${ctrlKey ? 'Ctrl+' : ''}${shiftKey ? 'Shift+' : ''}${key.toUpperCase()}`;
}
export {shortcutKeyToString};
