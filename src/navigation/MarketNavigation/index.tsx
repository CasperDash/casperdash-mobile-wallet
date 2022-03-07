import React from 'react';
import { MarketScreens } from './MarketScreens';
import MarketRouter from './MarketRouter';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MarketNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={MarketRouter.MARKET_SCREEN}
      screenOptions={{
        headerShown: false,
      }}>
      {Object.keys(MarketScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={MarketScreens[elem].screen}
          options={{
            title: MarketScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default MarketNavigation;
