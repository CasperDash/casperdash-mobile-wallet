import React from 'react';
import { NFTScreens } from './NFTScreens';
import NFTRouter from './NFTRouter';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const NFTNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={NFTRouter.NFT_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(NFTScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={NFTScreens[elem].screen}
          options={{
            title: NFTScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default NFTNavigation;
