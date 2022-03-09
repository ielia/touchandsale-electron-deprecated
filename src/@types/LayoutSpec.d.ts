/**
 * @typedef LeafLayoutSpec Layout specification tree leaf.
 */
type LeafLayoutSpec = {
    children: string[],
    groupId: string,
    selected: string,
    state: 'maximized' | 'minimized' | 'normal',
    weight: number,
}

/**
 * @typedef NodeLayoutSpec Layout specification tree internal node (i.e., not a leaf).
 */
type NodeLayoutSpec = {
    children: LayoutSpec[],
    orientation: ComponentOrientation,
    weight: number,
};

/**
 * @typedef LayoutSpec Layout specification tree node (either internal or leaf).
 */
type LayoutSpec = NodeLayoutSpec | LeafLayoutSpec;
