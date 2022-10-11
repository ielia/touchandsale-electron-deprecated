/**
 * @file This file should only be used for convenience. To extend components, use the pattern:
 * <pre><code>
 * import BaseX from 'whateverBrandOrThisModule/X';
 * import getBrandedComponent from 'thisModule/branding';
 * const X = getBrandedComponent<InstanceType<typeof BaseX>>('X') as typeof BaseX;
 * </code></pre>
 */

import BaseMaximizeButton from './MaximizeButton';
import BaseMenu from './Menu';
import BaseMenuSection from './MenuSection';
import BaseMinimizeButton from './MinimizeButton';
import {default as BaseMinimizedViewContainer} from './MinimizedViewContainer';
import BasePerspective from './Perspective';
import BasePerspectiveMenuItem from './PerspectiveMenuItem';
import BasePerspectiveSelector from './PerspectiveSelector';
import BaseResizableContainer from './ResizableContainer';
import BaseRestoreButton from './RestoreButton';
import BaseSimpleMenuSection from './SimpleMenuSection';
import BaseTabbedViewContainer from './TabbedViewContainer';
import BaseView from './View';
import BaseViewIcon from './ViewIcon';
import BaseViewSetLayout from './ViewSetLayout';
import BaseViewTab from './ViewTab';
import getBrandedComponent from './branding';

// TODO: See if it's worth creating types in @types directory for all the base components.

export const MaximizeButton = getBrandedComponent<InstanceType<typeof BaseMaximizeButton>>('MaximizeButton') as typeof BaseMaximizeButton;
export const Menu = getBrandedComponent<InstanceType<typeof BaseMenu>>('Menu') as typeof BaseMenu;
export const MenuSection = getBrandedComponent<InstanceType<typeof BaseMenuSection>>('MenuSection') as typeof BaseMenuSection;
export const MinimizeButton = getBrandedComponent<InstanceType<typeof BaseMinimizeButton>>('MinimizeButton') as typeof BaseMinimizeButton;
export const MinimizedViewContainer = getBrandedComponent<InstanceType<typeof BaseMinimizedViewContainer>>('MinimizedViewContainer') as typeof BaseMinimizedViewContainer;
export const Perspective = getBrandedComponent<InstanceType<typeof BasePerspective>>('Perspective') as typeof BasePerspective;
export const PerspectiveMenuItem = getBrandedComponent<InstanceType<typeof BasePerspectiveMenuItem>>('PerspectiveMenuItem') as typeof BasePerspectiveMenuItem;
export const PerspectiveSelector = getBrandedComponent<InstanceType<typeof BasePerspectiveSelector>>('PerspectiveSelector') as typeof BasePerspectiveSelector;
export const ResizableContainer = getBrandedComponent<InstanceType<typeof BaseResizableContainer>>('ResizableContainer') as typeof BaseResizableContainer;
export const RestoreButton = getBrandedComponent<InstanceType<typeof BaseRestoreButton>>('RestoreButton') as typeof BaseRestoreButton;
export const SimpleMenuSection = getBrandedComponent<InstanceType<typeof BaseSimpleMenuSection>>('SimpleMenuSection') as typeof BaseSimpleMenuSection;
export const TabbedViewContainer = getBrandedComponent<InstanceType<typeof BaseTabbedViewContainer>>('TabbedViewContainer') as typeof BaseTabbedViewContainer;
export const View = getBrandedComponent<InstanceType<typeof BaseView>>('View') as typeof BaseView;
export const ViewIcon = getBrandedComponent<InstanceType<typeof BaseViewIcon>>('ViewIcon') as typeof BaseViewIcon;
export const ViewSetLayout = getBrandedComponent<InstanceType<typeof BaseViewSetLayout>>('ViewSetLayout') as typeof BaseViewSetLayout;
export const ViewTab = getBrandedComponent<InstanceType<typeof BaseViewTab>>('ViewTab') as typeof BaseViewTab;
