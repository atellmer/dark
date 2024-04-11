import { component } from '@dark-engine/core';
import { View, ScrollView } from '@dark-engine/platform-native';

import { Card } from './card';

const cards = Array(10)
  .fill(null)
  .map((_, idx) => idx + 1);

const Home = component(() => {
  return (
    <View backgroundColor='#512da8' height='100%' padding={8}>
      <ScrollView height='100%'>
        <View>
          {cards.map((_, idx) => (
            <Card isLast={idx === cards.length - 1} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

export { Home };
