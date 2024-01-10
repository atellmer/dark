import { h, component } from '@dark-engine/core';
import { View, Text, Switch } from '@dark-engine/platform-native';

const features = Array(4)
  .fill(null)
  .map((_, idx) => idx + 1);

const Settings = component(() => {
  return (
    <View backgroundColor='#512da8' height='100%' padding={8}>
      <Text fontSize={30}>Settings</Text>
      {features.map(x => (
        <View flexDirection='row' justifyContent='space-between'>
          <Text fontSize={20}>Enable feature #{x}</Text>
          <Switch checked color='#BFCDAC' backgroundColor='#e91e63' offBackgroundColor='#ccc' />
        </View>
      ))}
    </View>
  );
});

export { Settings };
