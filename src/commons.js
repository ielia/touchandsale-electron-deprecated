const shortcutKeyToString = ({key, altKey, ctrlKey, metaKey, shiftKey}) => {
    return `${metaKey ? 'm' : ''}${altKey ? 'a' : ''}${ctrlKey ? 'c' : ''}${shiftKey ? 's' : ''}${key.toUpperCase()}`;
};

export {
    shortcutKeyToString,
};
