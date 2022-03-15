/**
 * @typedef NodeLayoutSpec Layout specification tree internal node (i.e., not a leaf).
 */
type NodeLayoutSpec = {
    children: LayoutSpec[],
    orientation: ComponentOrientation,
    weight: number,
};
