import { AbsoluteLayout as NSAbsoluteLayout, Screen, View as NSView, Page as NSPage } from '@nativescript/core';
import { h, Fragment, createComponent, useRef, useEffect } from '@dark-engine/core';
import { createStackNavigator, createBottomTabNavigator, useNavigation, ActionBar } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const rootRef = useRef<NSPage>(null);
  const labelRef = useRef<NSAbsoluteLayout>(null);

  return (
    <frame>
      <page ref={rootRef}>
        <absolute-layout backgroundColor='purple'>
          <label ref={labelRef} text='10,10' left='10' top='10' width='100' height='100' backgroundColor='#43b883' />
          <label text='120,10' left='120' top='10' width='100' height='100' backgroundColor='#43b883' />
          <label text='10,120' left='10' top='120' width='100' height='100' backgroundColor='#43b883' />
          <label text='120,120' left='120' top='120' width='100' height='100' backgroundColor='#43b883' />
        </absolute-layout>
      </page>
    </frame>
  );
});

const SCALE_FACTOR = Screen.mainScreen.scale;

function getMeasuredSizeInDPI(view: NSView) {
  return {
    width: view.getMeasuredWidth() / SCALE_FACTOR,
    height: view.getMeasuredHeight() / SCALE_FACTOR,
  };
}

export default App;
