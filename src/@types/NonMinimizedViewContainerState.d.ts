/**
 * @typedef NonMinimizedViewContainerState State of a view, excluding 'minimized'.
 */
type NonMinimizedViewContainerState = Exclude<ViewContainerState, 'minimized'>;
