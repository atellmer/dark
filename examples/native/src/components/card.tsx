import { h, component, useAtom } from '@dark-engine/core';
import { View, Text } from '@dark-engine/platform-native';

import { Button } from './button';

type CardProps = {
  isLast: boolean;
};

const Card = component<CardProps>(({ isLast }) => {
  const count$ = useAtom(0);

  return (
    <View
      width='100%'
      height={120}
      backgroundColor='#fff'
      color='#444'
      padding={8}
      borderRadius={10}
      boxShadow='0px 0px 8px #555'
      justifyContent='center'
      alignItems='center'
      marginBottom={isLast ? 66 : 8}>
      <Text fontSize={20} marginBottom={8}>
        Count is {count$.val()}
      </Text>
      <Button label='Press me' onPress={() => count$.set(x => x + 1)} />
    </View>
  );
});

export { Card };
