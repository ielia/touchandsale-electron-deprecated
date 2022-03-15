/**
 * @typedef LeafLayoutSpec Layout specification tree leaf.
 */
type LeafLayoutSpec = {
    children: string[],
    groupId: string,
    selected: string,
    state: ViewContainerState,
    weight: number,
}
