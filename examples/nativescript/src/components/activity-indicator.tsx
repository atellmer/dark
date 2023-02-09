import { PropertyChangeData } from '@nativescript/core';
import { h, Fragment, createComponent, useState, useEffect, useReactiveState } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-native';

type SpinnerProps = {
  isFetching: boolean;
};

const Spinner = createComponent<SpinnerProps>(({ isFetching }) => {
  return (
    <flexbox-layout hidden={!isFetching} height='100%' justifyContent='center' alignItems='center'>
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

  return (
    <frame>
      <page actionBarHidden>
        <stack-layout>
          <Spinner isFetching={isFetching} />
          <stack-layout hidden={isFetching} padding={8}>
            <label>Hello 🥰, {state.name}</label>
            <text-field text={state.name} onTextChange={handleChange} />
            <text-field text={state.name} onTextChange={handleChange} />
          </stack-layout>
        </stack-layout>
      </page>
    </frame>
  );
});

export default App;
