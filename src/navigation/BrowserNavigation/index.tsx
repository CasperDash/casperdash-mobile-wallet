import React from 'react';
import { BrowserScreens } from './BrowserScreens';
import BrowserRouter from './BrowserRouter';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const BrowserNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={BrowserRouter.BROSWER_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(BrowserScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={BrowserScreens[elem].screen}
          options={{
            title: BrowserScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default BrowserNavigation;
