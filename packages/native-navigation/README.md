# @dark-engine/native-navigation 🌖

Dark navigation for NativeScript platform.

[More about Dark](https://github.com/atellmer/dark)
<br>
[More about NativeScript](https://nativescript.org/)

## Installation
npm:
```
npm install @dark-engine/native-navigation
```
yarn:
```
yarn add @dark-engine/native-navigation
```
## API

```tsx
import {
  type NavigationOptions,
  NavigationContainer,
  StackNavigator,
  TabNavigator,
  TransitionName,
  useNavigation,
} from '@dark-engine/native-navigation';
```
## Usage

In order to use navigation, you need to wrap the application root in a `NavigationContainer` and pass a `defaultPathname` to it, which will display the selected screen when the application starts. Inside this container, you must place the selected navigator and describe the collection of screens for navigation. Each screen must have a name and a component to be rendered.

## Navigation via `StackNavigator`

`StackNavigator` is the main navigation method that implements the logic of changing screens.

```tsx
import { NavigationContainer, StackNavigator } from '@dark-engine/native-navigation';
```

```tsx
const App = component(() => {
  return (
    <NavigationContainer defaultPathname='/Feed'>
      <StackNavigator.Root>
        <StackNavigator.Screen name='Feed' component={Feed} />
        <StackNavigator.Screen name='Friends' component={Friends} />
        <StackNavigator.Screen name='Profile' component={Profile} />
        <StackNavigator.Screen name='Settings' component={Settings} />
      </StackNavigator.Root>
    </NavigationContainer>
  );
});
```

## Navigation via `TabNavigator`

The `TabNavigator` is a wrapper around the `StackNavigator` that displays tab buttons at the bottom to control screens. Using the `StackNavigator` wrapping approach, you can also implement a navigation strategy through a Drawer or Modal.

```tsx
import { NavigationContainer, TabNavigator } from '@dark-engine/native-navigation';
```

```tsx
const App = component(() => {
  return (
    <NavigationContainer defaultPathname='/Feed'>
      <TabNavigator.Root>
        <TabNavigator.Screen name='Feed' component={Feed} />
        <TabNavigator.Screen name='Friends' component={Friends} />
        <TabNavigator.Screen name='Profile' component={Profile} />
        <TabNavigator.Screen name='Settings' component={Settings} />
      </TabNavigator.Root>
    </NavigationContainer>
  );
});
```

You can customize Tabs view through passing `bottomNavigationOptions` to `TabNavigator.Root` and `renderTab` to `TabNavigator.Screen` to render tabs with icons.

## Navigating to screen

To navigate to a new screen, you need to use the `navigateTo` method, which provided by the `useNavigation` hook.

```tsx
import { useNavigation } from '@dark-engine/native-navigation';
```

```tsx
const { navigateTo } = useNavigation();

return (
  <StackLayout>
    <Button onTap={() => navigateTo('/Dashboard')}>Dashboard</Button>
  </StackLayout>
);
```

The method supports passing `NavigationOptions`, which include a parameter for the new screen, as well as a flag to enable support for animated transitions.
```tsx
import { CoreTypes } from '@nativescript/core';
import { useNavigation, TransitionName } from '@dark-engine/native-navigation';
```

```tsx
navigateTo('/Profile', {
  params: { id: 25 },
  animated: true,
  transition: {
    curve: CoreTypes.AnimationCurve.easeInOut,
    name: TransitionName.slide,
    duration: 200,
  }
});
```

## Back navigation

```tsx
const { goBack } = useNavigation();

return (
  <StackLayout>
    <Button onTap={() => goBack()}>back</Button>
  </StackLayout>
);
```

## Access to params

```tsx
const { params } = useNavigation();
const id = Number(params.get('id'));

useEffect(() => {
  fetch(`https://jsonplaceholder.typicode.com/albums/${id}`)
    .then(x => x.json())
    .then(x => setAlbum(x));
}, [id]);
```

## Nested screens

You can nest navigators to create nested screens like `/Home/Dashboard`, `/Home/Profile` and so on.

```tsx
const Home = component(() => {
  return (
    <StackLayout height='100%'>
      <StackNavigator.Root>
        <StackNavigator.Screen name='Dashboard' component={Dashboard} />
        <StackNavigator.Screen name='Profile' component={Profile} />
      </StackNavigator.Root>
    </StackLayout>
  );
});

const App = component(() => {
  return (
    <NavigationContainer defaultPathname='/Home/Dashboard'>
      <TabNavigator.Root>
        <TabNavigator.Screen name='Home' component={Home} />
        <TabNavigator.Screen name='Settings' component={Settings} />
        <TabNavigator.Screen name='Contacts' component={Contacts} />
      </TabNavigator.Root>
    </NavigationContainer>
  );
});
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
