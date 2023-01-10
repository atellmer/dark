import { NavigationTransition } from '@nativescript/core';

import { type ComponentFactory, h, createComponent, createContext, useContext, useMemo } from '@dark-engine/core';

type NavigationContainerContextValue = {
  navigateTo: (name: string, options?: NavigateToOptions) => void;
  goBack: () => void;
};

export type NavigateToOptions = {
  animated?: boolean;
  transition?: NavigationTransition;
};

const NavigationContainerContext = createContext<NavigationContainerContextValue>(null);

type NavigationContainerProps = {
  slot: ComponentFactory;
};

const NavigationContainer = createComponent<NavigationContainerProps>(({ slot }) => {
  const contextValue = useMemo(() => ({ navigateTo: null, goBack: null }), []);

  return <NavigationContainerContext.Provider value={contextValue}>{slot}</NavigationContainerContext.Provider>;
});

function useNavigationContainerContext() {
  const context = useContext(NavigationContainerContext);

  return context;
}

function useNavigation() {
  return useNavigationContainerContext();
}

export { NavigationContainer, useNavigationContainerContext, useNavigation };
