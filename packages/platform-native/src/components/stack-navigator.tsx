import { CoreTypes } from '@nativescript/core';

import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  h,
  createComponent,
  useRef,
  useState,
  useEvent,
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
    const defaultName = slot[0].props.name;
    const frameRef = useRef<NS.Frame>(null);
    [name, setName] = useState(defaultName);

    const navigateTo = useEvent((name: string, options: NavigateToOptions = {}) => {
      const page = refsMap[name];
      const frame = frameRef.current;
      if (frame.currentPage === page) return;
      const options$: NavigateToOptions = {
        animated: true,
        transition: {
          name: 'slide',
          duration: 100,
          curve: CoreTypes.AnimationCurve.easeInOut,
        },
        ...options,
      };

      frame.navigate({ create: () => page, ...options$ });
      setName(name);
    });

    const goBack = useEvent(() => {
      const frame = frameRef.current;

      frame.goBack();
    });

    contextValue.navigateTo = navigateTo;
    contextValue.goBack = goBack;

    return <frame ref={frameRef}>{slot}</frame>;
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
