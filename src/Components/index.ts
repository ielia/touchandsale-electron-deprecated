/**
 * @file This file should only be used for convenience. To extend components, use the pattern:
 * <pre><code>
 * import BaseX from 'whateverBrandOrThisModule/X';
 * import getBrandedComponent from 'thisModule/branding';
 * const X = getBrandedComponent<BaseX>('X') as typeof BaseX;
 * </code></pre>
 */

import BaseMaximizeButton from './MaximizeButton';
import BaseMenu from './Menu';
import BaseMenuSection from './MenuSection';
import BaseMinimizeButton from './MinimizeButton';
import BaseMinimizedViewContainer from './MinimizedViewContainer';
import BasePerspective from './Perspective';
import BasePerspectiveMenuItem from './PerspectiveMenuItem';
import BasePerspectiveSelector from './PerspectiveSelector';
import BaseResizableContainer from './ResizableContainer';
import BaseRestoreButton from './RestoreButton';
import BaseTabbedViewContainer from './TabbedViewContainer';
import BaseView from './View';
import BaseViewIcon from './ViewIcon';
import BaseViewSetLayout from './ViewSetLayout';
import BaseViewTab from './ViewTab';
import getBrandedComponent from './branding';

// TODO: See if it's worth creating types in @types directory for all the base components.

export const MaximizeButton = getBrandedComponent<BaseMaximizeButton>('MaximizeButton') as typeof BaseMaximizeButton;
export const Menu = getBrandedComponent<BaseMenu>('Menu') as typeof BaseMenu;
export const MenuSection = getBrandedComponent<BaseMenuSection>('MenuSection') as typeof BaseMenuSection;
export const MinimizeButton = getBrandedComponent<BaseMinimizeButton>('MinimizeButton') as typeof BaseMinimizeButton;
export const MinimizedViewContainer = getBrandedComponent<BaseMinimizedViewContainer>('MinimizedViewContainer') as typeof BaseMinimizedViewContainer;
export const Perspective = getBrandedComponent<BasePerspective>('Perspective') as typeof BasePerspective;
export const PerspectiveMenuItem = getBrandedComponent<BasePerspectiveMenuItem>('PerspectiveMenuItem') as typeof BasePerspectiveMenuItem;
export const PerspectiveSelector = getBrandedComponent<BasePerspectiveSelector>('PerspectiveSelector') as typeof BasePerspectiveSelector;
export const ResizableContainer = getBrandedComponent<BaseResizableContainer>('ResizableContainer') as typeof BaseResizableContainer;
export const RestoreButton = getBrandedComponent<BaseRestoreButton>('RestoreButton') as typeof BaseRestoreButton;
export const TabbedViewContainer = getBrandedComponent<BaseTabbedViewContainer>('TabbedViewContainer') as typeof BaseTabbedViewContainer;
export const View = getBrandedComponent<BaseView>('View') as typeof BaseView;
export const ViewIcon = getBrandedComponent<BaseViewIcon>('ViewIcon') as typeof BaseViewIcon;
export const ViewSetLayout = getBrandedComponent<BaseViewSetLayout>('ViewSetLayout') as typeof BaseViewSetLayout;
export const ViewTab = getBrandedComponent<BaseViewTab>('ViewTab') as typeof BaseViewTab;
