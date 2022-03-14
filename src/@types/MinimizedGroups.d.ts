type MinimizedGroupSpec = {containerId: string, floating: boolean, height: number, width: number};
interface MinimizedGroups {
    [menuId: string]: MinimizedGroupSpec[],
}
