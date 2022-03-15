/**
 * @typedef MinimizedGroups Grouped minimized view container specs by menu id.
 * @member [menuId]: Minimized view container specs.
 * TODO: Figure out how to write this above in JSDoc.
 */
interface MinimizedGroups {
    [menuId: string]: MinimizedGroupSpec[],
}
