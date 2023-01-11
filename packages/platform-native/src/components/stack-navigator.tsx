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
  useEffect,
  useImperativeHandle,
  detectIsFunction,
  forwardRef,
} from '@dark-engine/core';
import { type NS } from '../';
import { ActionBar } from './action-bar';
import {
  type NavigationContainerContextValue,
  type NavigateToOptions,
  useNavigationContainerContext,
} from './navigation-container';

export type StackNavigatorProps = {
  slot: Array<ComponentFactory<StackScreenProps & StandardComponentProps>>;
  onNavigate?: (name: string) => void;
};

export type StackNavigatorRef = Pick<NavigationContainerContextValue, 'navigateTo' | 'goBack'>;

export type StackScreenProps = {
  name: string;
  component: Component;
  options?: StackScreenOptions;
};

export type StackScreenOptions = {
  title?: string;
  headerShown?: boolean;
};

function createStackNavigator() {
  const refsMap: Record<string, NS.Page> = {};
  let setName: (name: string) => void;

  const Navigator = forwardRef<StackNavigatorProps, StackNavigatorRef>(
    createComponent(({ slot, onNavigate }, ref) => {
      const contextValue = useNavigationContainerContext();
      const defaultName = slot[0].props.name;
      const frameRef = useRef<NS.Frame>(null);
      const box = useState(defaultName);
      const name = box[0];

      setName = box[1];

      useEffect(() => {
        detectIsFunction(onNavigate) && onNavigate(name);
      }, [name]);

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

      useImperativeHandle(ref, () => ({ navigateTo, goBack }));

      return <frame ref={frameRef}>{slot}</frame>;
    }),
  );

  const Screen = createComponent<StackScreenProps>(({ name, component, options = {} }) => {
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
