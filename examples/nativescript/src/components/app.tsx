import { component } from '@dark-engine/core';
import { View, Text } from '@dark-engine/platform-native';
import { NavigationContainer, TabNavigator } from '@dark-engine/native-navigation';

import { Home } from './home';
import { Contacts } from './contacts';
import { Settings } from './settings';

const App = component(() => {
  const renderTab = (name: string) => {
    const iconsMap = {
      Home: () => <Text class='lnr' text='&#xe800;' />,
      Contacts: () => <Text class='lnr' text='&#xe830;' />,
      Settings: () => <Text class='lnr' text='&#xe810;' />,
    };

    return (
      <>
        {iconsMap[name]()}
        <Text>{name}</Text>
      </>
    );
  };

  return (
    <NavigationContainer defaultPathname='/Home'>
      <View>
        <TabNavigator.Root>
          <TabNavigator.Screen name='Home' component={Home} renderTab={renderTab} />
          <TabNavigator.Screen name='Contacts' component={Contacts} renderTab={renderTab} />
          <TabNavigator.Screen name='Settings' component={Settings} renderTab={renderTab} />
        </TabNavigator.Root>
      </View>
    </NavigationContainer>
  );
});

export { App };
