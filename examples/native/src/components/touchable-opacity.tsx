import { h, createComponent } from '@dark-engine/core';
import { View, Text, TouchableOpacity } from '@dark-engine/platform-native';

const App = createComponent(() => {
  return (
    <View justifyContent='center'>
      <TouchableOpacity padding={32} backgroundColor='#4caf50' onPress={() => console.log('press')}>
        <Text textAlignment='center'>Press me</Text>
      </TouchableOpacity>
    </View>
  );
});

export default App;
