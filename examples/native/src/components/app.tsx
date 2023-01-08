import { PropertyChangeData } from '@nativescript/core';
import { h, Fragment, createComponent, useState, useRef, useEffect, useReactiveState } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const state = useReactiveState({ name: 'Alex' });

  const handleChange = (e: SyntheticEvent<PropertyChangeData>) => {
    state.name = e.sourceEvent.value;
  };

  return (
    <frame>
      <page actionBarHidden>
        <stack-layout padding={8}>
          <label>Hello 🥰, {state.name}</label>
          <text-field text={state.name} onTextChange={handleChange} />
          <text-field text={state.name} onTextChange={handleChange} />
        </stack-layout>
      </page>
    </frame>
  );
});

export default App;
