import { CoreTypes } from '@nativescript/core';

import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  h,
  createComponent,
  useEffect,
  useRef,
  useState,
  useEvent,
  useMemo,
} from '@dark-engine/core';
import { type NS } from '../';
import { ActionBar } from './action-bar';
import { useNavigationContainerContext, type NavigateToOptions } from './navigation-container';

function createStackNavigator() {
  const refsMap: Record<string, NS.Page> = {};
  let name = '';
  let setName: (name: string) => void;

  type NavigatorProps = {
    slot: Array<ComponentFactory<ScreenProps & StandardComponentProps>>;
  };

  const Navigator = createComponent<NavigatorProps>(({ slot }) => {
    const contextValue = useNavigationContainerContext();
    const scope = useMemo(() => ({ slot: [...slot].reverse() }), []);
    const defaultName = scope.slot[scope.slot.length - 1].props.name;
    const frameRef = useRef<NS.Frame>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    [name, setName] = useState(defaultName);

    useEffect(() => {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }, []);

    const navigateTo = useEvent((nextName: string, options: NavigateToOptions = {}) => {
      if (nextName === name) return;
      const page = refsMap[nextName];
      const frame = frameRef.current;
      const options$: NavigateToOptions = {
        animated: true,
        transition: {
          name: 'slide',
          duration: 100,
          curve: CoreTypes.AnimationCurve.easeInOut,
        },
        ...options,
      };

      page.parent?._removeView(page);
      frame.navigate({
        create: () => page,
        ...options$,
      });
      setName(nextName);
    });

    const goBack = useEvent(() => {
      const frame = frameRef.current;

      frame.goBack();
    });

    contextValue.navigateTo = navigateTo;
    contextValue.goBack = goBack;

    return (
      <stack-layout>
        <frame ref={frameRef} visibility={isLoaded ? 'visible' : 'hidden'}>
          {scope.slot}
        </frame>
      </stack-layout>
    );
  });

  type ScreenProps = {
    name: string;
    component: Component;
    options?: {
      title?: string;
      headerShown?: boolean;
    };
  };

  const Screen = createComponent<ScreenProps>(({ name, component, options = {} }) => {
    const { title, headerShown = true } = options;

    const setRef = (ref: NS.Page) => {
      refsMap[name] = ref;
    };

    return (
      <page id={name} ref={setRef} actionBarHidden={!headerShown} onNavigatingTo={() => setName(name)}>
        <ActionBar title={title} />
        {component()}
      </page>
    );
  });

  return {
    Navigator,
    Screen,
  };
}

export { createStackNavigator };
