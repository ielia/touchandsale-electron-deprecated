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
 * Converts a shortcut key specification into a short string.
 * E.g.,
 *     {key: 'x', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true} --> 'acmsX',
 *     {key: 'y'} --> 'Y'
 * @param shortcutKey Shortcut key representation.
 * @returns The string representation of the shortcut key passed as parameter.
 */
function shortcutKeyToString(shortcutKey?: ShortcutKey): string {
    const {altKey, ctrlKey, key, metaKey, shiftKey} = shortcutKey ?? {key: ''};
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'm' : ''}${altKey ? 'a' : ''}${ctrlKey ? 'c' : ''}${shiftKey ? 's' : ''}${key.toUpperCase()}`;
}
export {shortcutKeyToString};
