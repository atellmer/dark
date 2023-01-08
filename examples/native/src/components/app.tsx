import { PropertyChangeData } from '@nativescript/core';
import { h, Fragment, createComponent, useState, useRef, useEffect } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const [value, setValue] = useState('Alex');

  const handleChange = (e: SyntheticEvent<PropertyChangeData>) => {
    setValue(e.sourceEvent.value);
  };

  return (
    <frame>
      <page actionBarHidden>
        <stack-layout padding={8}>
          <label>Hello 🥰, {value}</label>
          <text-field text={value} onTextChange={handleChange} />
          <text-field text={value} onTextChange={handleChange} />
        </stack-layout>
      </page>
    </frame>
  );
});

export default App;
