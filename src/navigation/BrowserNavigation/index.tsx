import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import BrowserRouter from './BrowserRouter';
import { BrowserScreens } from './BrowserScreens';

const Stack = createStackNavigator();

const BrowserNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={BrowserRouter.BROWSER_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(BrowserScreens).map((elem: string) => (
        <Stack.Screen
          name={elem}
          component={BrowserScreens[elem].screen}
          options={{
            title: BrowserScreens[elem].title,
          }}
          key={`browser-screen-${elem}`}
        />
      ))}
    </Stack.Navigator>
  );
};

export default BrowserNavigation;
