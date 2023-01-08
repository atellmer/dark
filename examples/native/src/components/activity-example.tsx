import { PropertyChangeData } from '@nativescript/core';
import { h, Fragment, createComponent, useState, useRef, useEffect, useReactiveState } from '@dark-engine/core';
import { type SyntheticEvent, TouchableOpacity } from '@dark-engine/platform-native';

const Spinner = createComponent(() => {
  return (
    <flexbox-layout height='100%' justifyContent='center' alignItems='center'>
      <activity-indicator busy />
    </flexbox-layout>
  );
});

const App = createComponent(() => {
  const state = useReactiveState({ name: 'Alex' });
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  }, []);

  const handleChange = (e: SyntheticEvent<PropertyChangeData>) => {
    state.name = e.sourceEvent.value;
  };

  if (isFetching) return <Spinner />;

  return (
    <stack-layout padding={8}>
      <label>Hello 🥰, {state.name}</label>
      <text-field text={state.name} onTextChange={handleChange} />
      <text-field text={state.name} onTextChange={handleChange} />
    </stack-layout>
  );
});

const Router = createComponent(() => {
  return (
    <frame>
      <page actionBarHidden>
        <stack-layout>
          <App />
        </stack-layout>
      </page>
    </frame>
  );
});

export default Router;
