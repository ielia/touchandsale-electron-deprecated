/**
 * @type ShortcutKey Shortcut key specification.
 */
type ShortcutKey = { key: string, altKey?: boolean, ctrlKey?: boolean, metaKey?: boolean, shiftKey?: boolean };
export type {ShortcutKey};

/**
 * Add separator element interleaved in the list. This function does NOT modify the list passed as parameter,
 * but creates a new one with the elements of the original.
 * @param createSeparator Function which takes an integer zero-based index and returns a separator element (must be individual objects).
 * @param list List of elements to separate.
 * @returns The new list of elements.
 */
const addSeparatorElement = (createSeparator: (index: number) => any, list: any[]): any[] => {
    return list
        ? list.reduce((acc, e, i) => {
            if (i) acc.push(createSeparator(i - 1));
            acc.push(e);
            return acc;
        }, [])
        : list;
}
export {addSeparatorElement};

/**
 * Converts a shortcut key specification into a short string.
 * E.g.,
 *     {key: 'x', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true} --> 'acmsX',
 *     {key: 'y'} --> 'Y'
 * @param key Simple key representation as contained in `KeyboardEvent`s.
 * @param altKey Flag indicating the shortcut is composed with an Alt key.
 * @param ctrlKey Flag indicating the shortcut is composed with a Control key.
 * @param metaKey Flag indicating the shortcut is composed with a Meta key.
 * @param shiftKey Flag indicating the shortcut is composed with a Shift key.
 * @returns The string representation of the shortcut key passed as parameter.
 */
const shortcutKeyToString = ({key, altKey, ctrlKey, metaKey, shiftKey}: ShortcutKey): string => {
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'm' : ''}${altKey ? 'a' : ''}${ctrlKey ? 'c' : ''}${shiftKey ? 's' : ''}${key.toUpperCase()}`;
}
export {shortcutKeyToString};
