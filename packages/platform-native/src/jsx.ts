/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CoreTypes } from '@nativescript/core';

export type AccessibilityLiveRegion = import('@nativescript/core').AccessibilityLiveRegion;
export type AccessibilityRole = import('@nativescript/core').AccessibilityRole;
export type AccessibilityState = import('@nativescript/core').AccessibilityState;
export type ActionBar = import('@nativescript/core').ActionBar;
export type ActionItems = import('@nativescript/core').ActionItems;
export type AndroidActionBarSettings = import('@nativescript/core/ui/action-bar').AndroidActionBarSettings;
export type AndroidActionItemSettings = import('@nativescript/core/ui/action-bar').AndroidActionItemSettings;
export type AndroidFrame = import('@nativescript/core/ui/frame').AndroidFrame;
export type BackstackEntry = import('@nativescript/core').BackstackEntry;
export type CSSShadow = import('@nativescript/core/ui/styling/css-shadow').CSSShadow;
export type Color = import('@nativescript/core').Color;
export type CreateViewEventData = import('@nativescript/core').CreateViewEventData;
export type DOMNode = import('@nativescript/core/debugger/dom-node').DOMNode;
export type EventData = import('@nativescript/core').EventData;
export type FormattedString = import('@nativescript/core').FormattedString;
export type Frame = import('@nativescript/core').Frame;
export type FrameBackstackEntry = import('@nativescript/core').BackstackEntry;
export type FrameNavigationEntry = import('@nativescript/core').NavigationEntry;
export type FrameNavigationTransition = import('@nativescript/core').NavigationTransition;
export type GestureEventData = import('@nativescript/core').GestureEventData;
export type IOSActionItemSettings = import('@nativescript/core/ui/action-bar').IOSActionItemSettings;
export type ImageSource = import('@nativescript/core').ImageSource;
export type ItemEventData = import('@nativescript/core').ItemEventData;
export type ItemsSource = import('@nativescript/core').ItemsSource;
export type KeyedTemplate = import('@nativescript/core').KeyedTemplate;
export type LayoutBase = import('@nativescript/core').LayoutBase;
export type LinearGradient = import('@nativescript/core/ui/styling/linear-gradient').LinearGradient;
export type ListViewItemsSource = import('@nativescript/core').ItemsSource;
export type LoadEventData = import('@nativescript/core').LoadEventData;
export type NavigatedData = import('@nativescript/core').NavigatedData;
export type NavigationButton = import('@nativescript/core').NavigationButton;
export type NavigationData = import('@nativescript/core/ui/frame').NavigationData;
export type NavigationEntry = import('@nativescript/core').NavigationEntry;
export type NavigationTransition = import('@nativescript/core').NavigationTransition;
export type ObservableArray<T> = import('@nativescript/core').ObservableArray<T>;
export type Page = import('@nativescript/core').Page;
export type PanGestureEventData = import('@nativescript/core').PanGestureEventData;
export type PinchGestureEventData = import('@nativescript/core').PinchGestureEventData;
export type PropertyChangeData = import('@nativescript/core').PropertyChangeData;
export type RepeaterItemsSource = import('@nativescript/core').ItemsSource;
export type RotationGestureEventData = import('@nativescript/core').RotationGestureEventData;
export type ScrollEventData = import('@nativescript/core').ScrollEventData;
export type SegmentedBarItem = import('@nativescript/core').SegmentedBarItem;
export type SelectedIndexChangedEventData = import('@nativescript/core/ui/segmented-bar').SelectedIndexChangedEventData;
export type ShownModallyData = import('@nativescript/core').ShownModallyData;
export type Span = import('@nativescript/core').Span;
export type SwipeGestureEventData = import('@nativescript/core').SwipeGestureEventData;
export type TabViewItem = import('@nativescript/core').TabViewItem;
export type TabViewSelectedIndexChangedEventData =
  import('@nativescript/core/ui/tab-view').SelectedIndexChangedEventData;
export type TapGestureEventData = import('@nativescript/core').TapGestureEventData;
export type Template = import('@nativescript/core').Template;
export type TouchAnimationOptions = import('@nativescript/core').TouchAnimationOptions;
export type TouchGestureEventData = import('@nativescript/core').TouchGestureEventData;
export type View = import('@nativescript/core').View;
export type ViewBase = import('@nativescript/core').ViewBase;
export type WebViewInterfacesLoadEventData = import('@nativescript/core').LoadEventData;
export type iOSFrame = import('@nativescript/core/ui/frame').iOSFrame;

import type { KeyProps, SlotProps, RefProps, FlagProps } from '@dark-engine/core';
import { type SyntheticEvent } from './events';

export type WithStandardElementAttributes<T> = T & KeyProps & SlotProps & RefProps & FlagProps;

export type PartialSlot<T extends SlotProps> = Omit<T, 'slot'> & Partial<Pick<T, 'slot'>>;

export type ObservableAttributes = {};

export type ViewBaseAttributes = ObservableAttributes & {
  ['class']?: string;
  alignSelf?: 'auto' | 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  android?: any;
  bindingContext?: string | any;
  className?: string;
  col?: number;
  colSpan?: number;
  column?: number;
  columnSpan?: number;
  cssClasses?: Set<string>;
  cssPseudoClasses?: Set<string>;
  dock?: 'left' | 'top' | 'right' | 'bottom';
  domNode?: DOMNode;
  effectiveBorderBottomWidth?: number;
  effectiveBorderLeftWidth?: number;
  effectiveBorderRightWidth?: number;
  effectiveBorderTopWidth?: number;
  effectiveHeight?: number;
  effectiveLeft?: number;
  effectiveMarginBottom?: number;
  effectiveMarginLeft?: number;
  effectiveMarginRight?: number;
  effectiveMarginTop?: number;
  effectiveMinHeight?: number;
  effectiveMinWidth?: number;
  effectivePaddingBottom?: number;
  effectivePaddingLeft?: number;
  effectivePaddingRight?: number;
  effectivePaddingTop?: number;
  effectiveTop?: number;
  effectiveWidth?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexWrapBefore?: boolean;
  hidden?: string | boolean;
  id?: string;
  ios?: any;
  isCollapsed?: any;
  isLoaded?: boolean;
  left?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  nativeView?: any;
  onBindingContextChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onClassNameChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onHiddenChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIdChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  order?: number;
  page?: Page;
  parent?: ViewBase;
  parentNode?: ViewBase;
  recycleNativeView?: 'always' | 'never' | 'auto';
  reusable?: boolean;
  row?: number;
  rowSpan?: number;
  top?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  typeName?: string;
  viewController?: any;
};

export type ViewCommonAttributes = ViewBaseAttributes & {
  accessibilityHidden?: string | boolean;
  accessibilityHint?: string;
  accessibilityIdentifier?: string;
  accessibilityIgnoresInvertColors?: string | boolean;
  accessibilityLabel?: string;
  accessibilityLanguage?: string;
  accessibilityLiveRegion?: AccessibilityLiveRegion;
  accessibilityMediaSession?: string | boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityValue?: string;
  accessible?: string | boolean;
  androidDynamicElevationOffset?: string | number;
  androidElevation?: string | number;
  automationText?: string;
  background?: string;
  backgroundColor?: string | Color;
  backgroundImage?: string | LinearGradient;
  backgroundPosition?: string;
  backgroundRepeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
  backgroundSize?: string;
  borderBottomColor?: string | Color;
  borderBottomLeftRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderBottomRightRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderBottomWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderColor?: string | Color;
  borderLeftColor?: string | Color;
  borderLeftWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderRadius?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderRightColor?: string | Color;
  borderRightWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderTopColor?: string | Color;
  borderTopLeftRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderTopRightRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderTopWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderWidth?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  boxShadow?: string | CSSShadow;
  color?: string | Color;
  css?: string;
  cssType?: string;
  height?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
  horizontalAlignment?: 'left' | 'right' | 'stretch' | 'center';
  ignoreTouchAnimation?: string | boolean;
  iosIgnoreSafeArea?: string | boolean;
  iosOverflowSafeArea?: string | boolean;
  iosOverflowSafeAreaEnabled?: string | boolean;
  isEnabled?: string | boolean;
  isLayoutRequired?: boolean;
  isLayoutValid?: boolean;
  isUserInteractionEnabled?: string | boolean;
  margin?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
  marginBottom?:
    | string
    | number
    | 'auto'
    | CoreTypes.LengthDipUnit
    | CoreTypes.LengthPxUnit
    | CoreTypes.LengthPercentUnit;
  marginLeft?:
    | string
    | number
    | 'auto'
    | CoreTypes.LengthDipUnit
    | CoreTypes.LengthPxUnit
    | CoreTypes.LengthPercentUnit;
  marginRight?:
    | string
    | number
    | 'auto'
    | CoreTypes.LengthDipUnit
    | CoreTypes.LengthPxUnit
    | CoreTypes.LengthPercentUnit;
  marginTop?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
  minHeight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  minWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  modal?: View;
  onAccessibilityHintChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onAccessibilityIdentifierChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onAccessibilityIgnoresInvertColorsChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onAccessibilityLabelChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onAccessibilityValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIgnoreTouchAnimationChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIosIgnoreSafeAreaChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIosOverflowSafeAreaChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIosOverflowSafeAreaEnabledChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIsEnabledChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIsUserInteractionEnabledChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onOriginXChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onOriginYChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onTestIDChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onTouchAnimationChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onTouchDelayChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  opacity?: string | number;
  originX?: string | number;
  originY?: string | number;
  perspective?: string | number;
  rotate?: string | number;
  rotateX?: string | number;
  rotateY?: string | number;
  scaleX?: string | number;
  scaleY?: string | number;
  testID?: string;
  textTransform?: 'none' | 'initial' | 'capitalize' | 'uppercase' | 'lowercase';
  touchAnimation?: string | false | true | TouchAnimationOptions;
  touchDelay?: string | number;
  translateX?: string | number;
  translateY?: string | number;
  verticalAlignment?: 'top' | 'bottom' | 'stretch' | 'middle';
  visibility?: 'hidden' | 'visible' | 'collapse' | 'collapsed';
  width?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
};

export type ViewAttributes = ViewCommonAttributes & {
  accessibilityHidden?: boolean;
  accessibilityHint?: string;
  accessibilityIdentifier?: string;
  accessibilityLabel?: string;
  accessibilityLanguage?: string;
  accessibilityLiveRegion?: AccessibilityLiveRegion;
  accessibilityMediaSession?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityValue?: string;
  accessible?: boolean;
  android?: any;
  androidDynamicElevationOffset?: number;
  androidElevation?: number;
  automationText?: string;
  background?: string;
  backgroundColor?: string | Color;
  backgroundImage?: string | LinearGradient;
  bindingContext?: any;
  borderBottomColor?: string | Color;
  borderBottomLeftRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderBottomRightRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderBottomWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderColor?: string | Color;
  borderLeftColor?: string | Color;
  borderLeftWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderRadius?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderRightColor?: string | Color;
  borderRightWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderTopColor?: string | Color;
  borderTopLeftRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderTopRightRadius?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderTopWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  borderWidth?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  boxShadow?: string | CSSShadow;
  color?: string | Color;
  column?: string | number;
  columnSpan?: string | number;
  css?: string;
  cssClasses?: Set<string>;
  cssPseudoClasses?: Set<string>;
  cssType?: string;
  dock?: 'left' | 'top' | 'right' | 'bottom';
  height?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
  horizontalAlignment?: 'left' | 'right' | 'stretch' | 'center';
  ios?: any;
  iosIgnoreSafeArea?: boolean;
  iosOverflowSafeArea?: boolean;
  iosOverflowSafeAreaEnabled?: boolean;
  isEnabled?: boolean;
  isLayoutRequired?: boolean;
  isLayoutValid?: boolean;
  isUserInteractionEnabled?: boolean;
  left?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  margin?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
  marginBottom?:
    | string
    | number
    | 'auto'
    | CoreTypes.LengthDipUnit
    | CoreTypes.LengthPxUnit
    | CoreTypes.LengthPercentUnit;
  marginLeft?:
    | string
    | number
    | 'auto'
    | CoreTypes.LengthDipUnit
    | CoreTypes.LengthPxUnit
    | CoreTypes.LengthPercentUnit;
  marginRight?:
    | string
    | number
    | 'auto'
    | CoreTypes.LengthDipUnit
    | CoreTypes.LengthPxUnit
    | CoreTypes.LengthPercentUnit;
  marginTop?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
  minHeight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  minWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  modal?: View;
  onAndroidBackPressed?: (e: SyntheticEvent<EventData>) => void;
  onColumnChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onColumnSpanChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onDockChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onDoubleTap?: (e: SyntheticEvent<TapGestureEventData>) => any;
  onLeftChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onLoaded?: (e: SyntheticEvent<EventData>) => void;
  onLongPress?: (e: SyntheticEvent<GestureEventData>) => any;
  onPan?: (e: SyntheticEvent<PanGestureEventData>) => any;
  onPinch?: (e: SyntheticEvent<PinchGestureEventData>) => any;
  onRotation?: (e: SyntheticEvent<RotationGestureEventData>) => any;
  onRowChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onRowSpanChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onShowingModally?: (e: SyntheticEvent<ShownModallyData>) => void;
  onShownModally?: (e: SyntheticEvent<ShownModallyData>) => void;
  onLayoutChanged?: (e: SyntheticEvent<EventData>) => void;
  onSwipe?: (e: SyntheticEvent<SwipeGestureEventData>) => any;
  onTap?: (e: SyntheticEvent<TapGestureEventData>) => any;
  onTopChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onTouch?: (e: SyntheticEvent<TouchGestureEventData>) => any;
  onUnloaded?: (e: SyntheticEvent<EventData>) => void;
  opacity?: number;
  originX?: number;
  originY?: number;
  perspective?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  row?: string | number;
  rowSpan?: string | number;
  scaleX?: number;
  scaleY?: number;
  top?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  translateX?: number;
  translateY?: number;
  verticalAlignment?: 'top' | 'bottom' | 'stretch' | 'middle';
  visibility?: 'hidden' | 'visible' | 'collapse' | 'collapsed';
  width?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit | CoreTypes.LengthPercentUnit;
};

export type TextBaseAttributes = ViewAttributes & {
  fontFamily?: string;
  fontSize?: string | number;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | 'bold' | '700' | '800' | '900';
  formattedText?: string | FormattedString;
  letterSpacing?: string | number;
  lineHeight?: string | number;
  maxLines?: string | number;
  onFormattedTextChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onTextChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  padding?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingBottom?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingLeft?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingRight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingTop?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  text?: string;
  textAlignment?: 'left' | 'right' | 'center' | 'initial' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textShadow?: string | CSSShadow;
  textTransform?: 'none' | 'initial' | 'capitalize' | 'uppercase' | 'lowercase';
  whiteSpace?: 'initial' | 'normal' | 'nowrap';
};

export type ContainerViewAttributes = ViewAttributes & {
  iosOverflowSafeArea?: boolean;
};

export type CustomLayoutViewAttributes = ContainerViewAttributes & {};

export type FrameBaseAttributes = CustomLayoutViewAttributes & {
  actionBarVisibility?: 'always' | 'never' | 'auto';
  animated?: boolean;
  backStack?: BackstackEntry[];
  currentEntry?: NavigationEntry;
  currentPage?: Page;
  defaultPage?: string;
  navigationBarHeight?: number;
  onActionBarVisibilityChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onDefaultPageChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  transition?: NavigationTransition;
};

export type FrameAttributes = WithStandardElementAttributes<
  FrameBaseAttributes & {
    actionBarVisibility?: 'always' | 'never' | 'auto';
    android?: AndroidFrame;
    animated?: boolean;
    backStack?: FrameBackstackEntry[];
    currentEntry?: FrameNavigationEntry;
    currentPage?: Page;
    ios?: iOSFrame;
    navigationBarHeight?: number;
    onNavigatedTo?: (e: SyntheticEvent<NavigationData>) => void;
    onNavigatingTo?: (e: SyntheticEvent<NavigationData>) => void;
    transition?: FrameNavigationTransition;
  }
>;

export type ContentViewAttributes = CustomLayoutViewAttributes & {
  content?: View;
  layoutView?: View;
};

export type PageBaseAttributes = ContentViewAttributes & {
  accessibilityAnnouncePageEnabled?: boolean;
  actionBar?: ActionBar;
  actionBarHidden?: string | boolean;
  androidStatusBarBackground?: string | Color;
  backgroundSpanUnderStatusBar?: string | boolean;
  enableSwipeBackNavigation?: string | boolean;
  frame?: Frame;
  hasActionBar?: boolean;
  navigationContext?: any;
  onActionBarHiddenChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onBackgroundSpanUnderStatusBarChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onEnableSwipeBackNavigationChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onNavigatedFrom?: (e: SyntheticEvent<NavigatedData>) => void;
  onNavigatedTo?: (e: SyntheticEvent<NavigatedData>) => void;
  onNavigatingFrom?: (e: SyntheticEvent<NavigatedData>) => void;
  onNavigatingTo?: (e: SyntheticEvent<NavigatedData>) => void;
  onShowingModally?: (e: SyntheticEvent<ShownModallyData>) => void;
  onShownModally?: (e: SyntheticEvent<ShownModallyData>) => void;
  page?: Page;
  statusBarStyle?: 'light' | 'dark';
};

export type PageAttributes = PartialSlot<
  WithStandardElementAttributes<
    PageBaseAttributes & {
      accessibilityAnnouncePageEnabled?: boolean;
      actionBar?: ActionBar;
      actionBarHidden?: boolean;
      androidStatusBarBackground?: string | Color;
      backgroundSpanUnderStatusBar?: boolean;
      enableSwipeBackNavigation?: boolean;
      frame?: Frame;
      hasActionBar?: boolean;
      navigationContext?: any;
      onAccessibilityPerformEscape?: () => boolean;
      onNavigatedFrom?: (e: SyntheticEvent<NavigatedData>) => void;
      onNavigatedTo?: (e: SyntheticEvent<NavigatedData>) => void;
      onNavigatingFrom?: (e: SyntheticEvent<NavigatedData>) => void;
      onNavigatingTo?: (e: SyntheticEvent<NavigatedData>) => void;
      statusBarStyle?: 'light' | 'dark';
    }
  >
>;

export type ScrollViewAttributes = WithStandardElementAttributes<
  ContentViewAttributes & {
    horizontalOffset?: number;
    isScrollEnabled?: string | boolean;
    onIsScrollEnabledChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onOrientationChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onScroll?: (e: SyntheticEvent<ScrollEventData>) => void;
    onScrollBarIndicatorVisibleChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    orientation?: 'horizontal' | 'vertical';
    scrollBarIndicatorVisible?: string | boolean;
    scrollableHeight?: number;
    scrollableWidth?: number;
    verticalOffset?: number;
  }
>;

export type LayoutBaseAttributes = CustomLayoutViewAttributes & {
  clipToBounds?: string | boolean;
  isPassThroughParentEnabled?: string | boolean;
  onClipToBoundsChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onIsPassThroughParentEnabledChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  padding?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingBottom?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingLeft?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingRight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  paddingTop?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
};

export type RootLayoutAttributes = WithStandardElementAttributes<GridLayoutAttributes & {}>;

export type AbsoluteLayoutAttributes = WithStandardElementAttributes<LayoutBaseAttributes & {}>;

export type StackLayoutAttributes = WithStandardElementAttributes<
  LayoutBaseAttributes & {
    onOrientationChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    orientation?: 'horizontal' | 'vertical';
  }
>;

export type DockLayoutAttributes = WithStandardElementAttributes<
  LayoutBaseAttributes & {
    onStretchLastChildChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    stretchLastChild?: string | boolean;
  }
>;

export type FlexboxLayoutAttributes = WithStandardElementAttributes<
  LayoutBaseAttributes & {
    alignContent?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
    flexDirection?: 'column' | 'row' | 'row-reverse' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  }
>;

export type GridLayoutAttributes = WithStandardElementAttributes<
  LayoutBaseAttributes & {
    columns?: string;
    rows?: string;
  }
>;

export type WrapLayoutAttributes = WithStandardElementAttributes<
  LayoutBaseAttributes & {
    effectiveItemHeight?: number;
    effectiveItemWidth?: number;
    itemHeight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
    itemWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
    onItemHeightChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onItemWidthChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onOrientationChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    orientation?: 'horizontal' | 'vertical';
  }
>;

export type ButtonAttributes = PartialSlot<
  WithStandardElementAttributes<
    TextBaseAttributes & {
      accessibilityRole?: AccessibilityRole;
      accessible?: boolean;
      android?: any;
      ios?: any;
      onTap?: (e: SyntheticEvent<EventData>) => void;
      textWrap?: boolean;
    }
  >
>;

export type LabelAttributes = PartialSlot<
  WithStandardElementAttributes<
    TextBaseAttributes & {
      android?: any;
      ios?: any;
      textWrap?: string | boolean;
    }
  >
>;

export type HtmlViewAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      html?: string;
      ios?: any;
      onHtmlChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    }
  >,
  'slot'
>;

export type WebViewAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      canGoBack?: boolean;
      canGoForward?: boolean;
      disableZoom?: string | boolean;
      ios?: any;
      onSrcChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onDisableZoomChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onLoadFinished?: (e: SyntheticEvent<LoadEventData>) => void;
      onLoadStarted?: (e: SyntheticEvent<WebViewInterfacesLoadEventData>) => void;
      src?: string;
    }
  >,
  'slot'
>;

export type ActionBarAttributes = PartialSlot<
  WithStandardElementAttributes<
    ViewAttributes & {
      androidContentInset?: string | number | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
      androidContentInsetLeft?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
      androidContentInsetRight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
      effectiveContentInsetLeft?: number;
      effectiveContentInsetRight?: number;
      flat?: string | boolean;
      iosIconRenderingMode?: 'automatic' | 'alwaysOriginal' | 'alwaysTemplate';
      title?: string;
    }
  >
>;

export type ActionItemAttributes = PartialSlot<
  WithStandardElementAttributes<
    ViewBaseAttributes & {
      actionBar?: ActionBar;
      actionView?: View;
      android?: Partial<AndroidActionItemSettings>;
      icon?: string;
      ios?: Partial<IOSActionItemSettings>;
      onIconChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onTap?: (e: SyntheticEvent<EventData>) => void;
      onTextChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onVisibilityChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      text?: string;
      visibility?: string;
    }
  >
>;

export type NavigationButtonAttributes = PartialSlot<WithStandardElementAttributes<ActionItemAttributes & {}>>;

export type ActivityIndicatorAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      busy?: string | boolean;
      ios?: any;
      onBusyChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    }
  >,
  'slot'
>;

export type FormattedStringAttributes = WithStandardElementAttributes<
  ViewBaseAttributes & {
    backgroundColor?: string | Color;
    color?: string | Color;
    fontFamily?: string;
    fontSize?: string | number;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | 'bold' | '700' | '800' | '900';
    spans?: ObservableArray<Span>;
    textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  }
>;

export type SpanAttributes = WithStandardElementAttributes<
  ViewBaseAttributes & {
    backgroundColor?: string | Color;
    color?: string | Color;
    fontFamily?: string;
    fontSize?: string | number;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | 'bold' | '700' | '800' | '900';
    tappable?: boolean;
    text?: string;
    textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  }
>;

export type ImageAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      decodeHeight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
      decodeWidth?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
      imageSource?: string | ImageSource;
      ios?: any;
      isLoading?: string | boolean;
      loadMode?: 'sync' | 'async';
      onDecodeHeightChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onDecodeWidthChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onImageSourceChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onIsLoadingChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onLoadModeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onSrcChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onStretchChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      src?: string | any;
      stretch?: 'none' | 'aspectFill' | 'aspectFit' | 'fill';
      tintColor?: string | Color;
    }
  >,
  'slot'
>;

export type ListPickerAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      ios?: any;
      isItemsSource?: boolean;
      items?: string | any[] | ItemsSource;
      onItemsChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onSelectedIndexChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onSelectedValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onTextFieldChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onValueFieldChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      selectedIndex?: string | number;
      selectedValue?: string;
      textField?: string;
      valueField?: string;
    }
  >,
  'slot'
>;

export type PlaceholderAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      onCreatingView?: (e: SyntheticEvent<CreateViewEventData>) => void;
    }
  >,
  'slot'
>;

export type ProgressAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      ios?: any;
      maxValue?: string | number;
      onMaxValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      value?: string | number;
    }
  >,
  'slot'
>;

export type SearchBarAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      hint?: string;
      ios?: any;
      onClose?: (e: SyntheticEvent<EventData>) => void;
      onHintChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onSubmit?: (e: SyntheticEvent<EventData>) => void;
      onTextChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onTextFieldBackgroundColorChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onTextFieldHintColorChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      text?: string;
      textFieldBackgroundColor?: string | Color;
      textFieldHintColor?: string | Color;
    }
  >,
  'slot'
>;

export type SegmentedBarAttributes = WithStandardElementAttributes<
  ViewAttributes & {
    items?: string | SegmentedBarItem[];
    onItemsChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onSelectedIndexChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onSelectedIndexChanged?: (e: SyntheticEvent<SelectedIndexChangedEventData>) => void;
    selectedBackgroundColor?: string | Color;
    selectedIndex?: string | number;
  }
>;

export type SegmentedBarItemAttributes = WithStandardElementAttributes<
  ViewBaseAttributes & {
    title?: string;
  }
>;

export type SliderAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      accessibilityRole?: AccessibilityRole;
      accessibilityStep?: string | number;
      accessible?: boolean;
      android?: any;
      ios?: any;
      maxValue?: string | number;
      minValue?: string | number;
      onMaxValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onValueChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      value?: string | number;
    }
  >,
  'slot'
>;

export type SwitchAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      checked?: string | boolean;
      ios?: any;
      offBackgroundColor?: string | Color;
      onCheckedChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onOffBackgroundColorChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    }
  >,
  'slot'
>;

export type EditableTextBaseAttributes = TextBaseAttributes & {
  autocapitalizationType?: 'none' | 'words' | 'sentences' | 'allcharacters';
  autocorrect?: string | boolean;
  autofillType?: string;
  editable?: string | boolean;
  hint?: string;
  keyboardType?: 'number' | 'datetime' | 'phone' | 'url' | 'email' | 'integer';
  maxLength?: string | number;
  onAutocapitalizationTypeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onAutocorrectChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onAutofillTypeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onEditableChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onHintChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onKeyboardTypeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onMaxLengthChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onReturnKeyTypeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onUpdateTextTriggerChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  updateTextTrigger?: 'focusLost' | 'textChanged';
};

export type TextFieldAttributes = Omit<
  WithStandardElementAttributes<
    EditableTextBaseAttributes & {
      android?: any;
      closeOnReturn?: string | boolean;
      ios?: any;
      onCloseOnReturnChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onSecureChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      secure?: string | boolean;
      secureWithoutAutofill?: boolean;
    }
  >,
  'slot'
>;

export type TextViewAttributes = Omit<
  WithStandardElementAttributes<
    EditableTextBaseAttributes & {
      android?: any;
      ios?: any;
      maxLines?: number;
    }
  >,
  'slot'
>;

export type DatePickerAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      date?: string | Date;
      day?: string | number;
      hour?: string | number;
      ios?: any;
      iosPreferredDatePickerStyle?: string | number;
      maxDate?: string | Date;
      minDate?: string | Date;
      minute?: string | number;
      month?: string | number;
      onDateChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onDayChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onHourChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onIosPreferredDatePickerStyleChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMaxDateChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinDateChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinuteChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMonthChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onSecondChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onShowTimeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onYearChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      second?: string | number;
      showTime?: string | boolean;
      year?: string | number;
    }
  >,
  'slot'
>;

export type TimePickerAttributes = Omit<
  WithStandardElementAttributes<
    ViewAttributes & {
      android?: any;
      hour?: string | number;
      ios?: any;
      iosPreferredDatePickerStyle?: string | number;
      maxHour?: string | number;
      maxMinute?: string | number;
      minHour?: string | number;
      minMinute?: string | number;
      minute?: string | number;
      minuteInterval?: string | number;
      onHourChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onIosPreferredDatePickerStyleChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMaxHourChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMaxMinuteChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinHourChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinMinuteChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinuteChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onMinuteIntervalChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      onTimeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
      time?: string | Date;
    }
  >,
  'slot'
>;

export type TabViewAttributes = WithStandardElementAttributes<
  ViewAttributes & {
    android?: any;
    androidIconRenderingMode?: 'alwaysOriginal' | 'alwaysTemplate';
    androidOffscreenTabLimit?: string | number;
    androidSelectedTabHighlightColor?: string | Color;
    androidSwipeEnabled?: string | boolean;
    androidTabsPosition?: 'top' | 'bottom';
    ios?: any;
    iosIconRenderingMode?: 'automatic' | 'alwaysOriginal' | 'alwaysTemplate';
    items?: string | TabViewItem[];
    onAndroidIconRenderingModeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onAndroidOffscreenTabLimitChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onAndroidSwipeEnabledChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onAndroidTabsPositionChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onIosIconRenderingModeChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onItemsChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onSelectedIndexChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
    onSelectedIndexChanged?: (e: SyntheticEvent<TabViewSelectedIndexChangedEventData>) => void;
    selectedIndex?: string | number;
    selectedTabTextColor?: string | Color;
    tabBackgroundColor?: string | Color;
    tabTextColor?: string | Color;
    tabTextFontSize?: string | number;
  }
>;

export type TabViewItemAttributes = WithStandardElementAttributes<
  ViewBaseAttributes & {
    canBeLoaded?: boolean;
    iconSource?: string;
    textTransform?: 'none' | 'initial' | 'capitalize' | 'uppercase' | 'lowercase';
    title?: string;
    view?: View;
  }
>;

export type ListViewAttributes = ViewAttributes & {
  iosEstimatedRowHeight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  itemIdGenerator?: (item: any, index: number, items: any) => number;
  itemTemplate?: string | Template;
  itemTemplateSelector?: string | ((item: any, index: number, items: any) => string);
  itemTemplates?: string | KeyedTemplate[];
  onIosEstimatedRowHeightChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onItemLoading?: (e: SyntheticEvent<ItemEventData>) => void;
  onItemTap?: (e: SyntheticEvent<ItemEventData>) => void;
  onItemTemplateChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onItemTemplatesChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onItemsChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  onLoadMoreItems?: (e: SyntheticEvent<EventData>) => void;
  onRowHeightChange?: (e: SyntheticEvent<PropertyChangeData>) => void;
  rowHeight?: string | number | 'auto' | CoreTypes.LengthDipUnit | CoreTypes.LengthPxUnit;
  separatorColor?: string | Color;
};

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       // @ts-ignore
//       frame: FrameAttributes;
//       page: PageAttributes;
//       'content-view': ContentViewAttributes;
//       'scroll-view': ScrollViewAttributes;
//       'root-layout': RootLayoutAttributes;
//       'absolute-layout': AbsoluteLayoutAttributes;
//       'stack-layout': StackLayoutAttributes;
//       'dock-layout': DockLayoutAttributes;
//       'flexbox-layout': FlexboxLayoutAttributes;
//       'grid-layout': GridLayoutAttributes;
//       'wrap-layout': WrapLayoutAttributes;
//       label: LabelAttributes;
//       button: ButtonAttributes;
//       'html-view': HtmlViewAttributes;
//       'web-view': WebViewAttributes;
//       'action-bar': ActionBarAttributes;
//       'action-item': ActionItemAttributes;
//       'navigation-button': NavigationButtonAttributes;
//       'activity-indicator': ActivityIndicatorAttributes;
//       'formatted-string': FormattedStringAttributes;
//       span: SpanAttributes;
//       image: ImageAttributes;
//       'list-picker': ListPickerAttributes;
//       placeholder: PlaceholderAttributes;
//       progress: ProgressAttributes;
//       'search-bar': SearchBarAttributes;
//       'segmented-bar': SegmentedBarAttributes;
//       'segmented-bar-item': SegmentedBarItemAttributes;
//       slider: SliderAttributes;
//       switch: SwitchAttributes;
//       'text-field': TextFieldAttributes;
//       'text-view': TextViewAttributes;
//       'date-picker': DatePickerAttributes;
//       'time-picker': TimePickerAttributes;
//       'tab-view': TabViewAttributes;
//       'tab-view-item': TabViewItemAttributes;
//     }
//   }
// }
