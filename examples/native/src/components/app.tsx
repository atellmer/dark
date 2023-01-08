import { h, Fragment, createComponent, useState, useEffect } from '@dark-engine/core';
import { View, Text, TouchableOpacity } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  return (
    <View padding={8}>
      <Text> count is: {count}</Text>
      <TouchableOpacity onPress={() => setCount(x => x + 1)}>
        <View padding={8} backgroundColor='blue'>
          <Text color='#fff' textAlignment='center' textTransform='uppercase'>
            Hello
          </Text>
        </View>
      </TouchableOpacity>
    </View>
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
