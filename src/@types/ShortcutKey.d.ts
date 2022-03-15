/**
 * @typedef ShortcutKey Shortcut key specification.
 * @member key Simple key representation as contained in `KeyboardEvent`s.
 * @member altKey Flag indicating the shortcut is composed with an Alt key.
 * @member ctrlKey Flag indicating the shortcut is composed with a Control key.
 * @member metaKey Flag indicating the shortcut is composed with a Meta key.
 * @member shiftKey Flag indicating the shortcut is composed with a Shift key.
 */
type ShortcutKey = { key: string, altKey?: boolean, ctrlKey?: boolean, metaKey?: boolean, shiftKey?: boolean };
