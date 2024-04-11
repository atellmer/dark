import { component } from '@dark-engine/core';
import { TouchableOpacity, Text } from '@dark-engine/platform-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
};

const Button = component<ButtonProps>(({ label, onPress }) => {
  return (
    <TouchableOpacity
      paddingTop={8}
      paddingBottom={8}
      paddingLeft={16}
      paddingRight={16}
      borderRadius={4}
      color='#4CAF50'
      backgroundColor='#E8F5E9'
      onPress={onPress}>
      <Text textAlignment='center'>{label}</Text>
    </TouchableOpacity>
  );
});

export { Button };
