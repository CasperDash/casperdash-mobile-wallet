import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import KeyManagerRouter from './KeyManagerRouter';
import { KeyManagerScreens } from './KeyManagerScreens';

const Stack = createStackNavigator();

const KeyManagerNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={KeyManagerRouter.KEY_MANAGER_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(KeyManagerScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={KeyManagerScreens[elem].screen}
          options={{
            title: KeyManagerScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default KeyManagerNavigation;
