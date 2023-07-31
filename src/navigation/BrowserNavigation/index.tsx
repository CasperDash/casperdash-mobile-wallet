import React from 'react';
import { BrowserScreens } from './BrowserScreens';
import BrowserRouter from './BrowserRouter';

import { createStackNavigator } from '@react-navigation/stack';

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
