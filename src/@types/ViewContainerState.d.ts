type ViewContainerState = 'maximized' | 'minimized' | 'normal';
type NonMinimizedViewContainerState = Exclude<ViewContainerState, 'minimized'>;
type ViewContainerStateOrFloating = ViewContainerState | 'floating';
