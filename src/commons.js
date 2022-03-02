const shortcutKeyToString = ({key, altKey, ctrlKey, metaKey, shiftKey}) => {
    // TODO: See what to do with the metaKey.
    return `${metaKey ? 'm' : ''}${altKey ? 'a' : ''}${ctrlKey ? 'c' : ''}${shiftKey ? 's' : ''}${key.toUpperCase()}`;
};

export {
    shortcutKeyToString,
};
