/**
 * @typedef ViewContainerState State of a view.
 */
type ViewContainerState = 'maximized' | 'minimized' | 'normal';

/**
 * @typedef NonMinimizedViewContainerState State of a view, excluding 'minimized'.
 */
type NonMinimizedViewContainerState = Exclude<ViewContainerState, 'minimized'>;

/**
 * @typedef ViewContainerStateOrFloating State of a view, including pseudo-state 'floating'.
 */
type ViewContainerStateOrFloating = ViewContainerState | 'floating';
