import { component, useState } from '@dark-engine/core';
import { View, Text } from '@dark-engine/platform-native';

import { Button } from './button';

type CardProps = {
  isLast: boolean;
};

const Card = component<CardProps>(({ isLast }) => {
  const [count, setCount] = useState(0);

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
        Count is {count}
      </Text>
      <Button label='Press me' onPress={() => setCount(x => x + 1)} />
    </View>
  );
});

export { Card };
