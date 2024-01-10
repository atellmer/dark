import { h, component } from '@dark-engine/core';
import { ListView, StackLayout, View, Text } from '@dark-engine/platform-native';

const contacts = Array(1000)
  .fill(null)
  .map((_, idx) => idx + 1);

const Contacts = component(() => {
  return (
    <View backgroundColor='#512da8' height='100%'>
      <ListView height='100%' items={contacts}>
        {({ item, idx }) => {
          const isLast = idx === contacts.length - 1;

          return (
            <StackLayout backgroundColor={idx % 2 ? '#EDE7F6' : '#fff'}>
              <Text color='#444' marginBottom={isLast ? 66 : 0}>
                item #{item}
              </Text>
            </StackLayout>
          );
        }}
      </ListView>
    </View>
  );
});

export { Contacts };
