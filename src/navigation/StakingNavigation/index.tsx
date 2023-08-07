import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import StakingRouter from './StakingRouter';
import { StakingScreens } from './StakingScreens';

const Stack = createStackNavigator();

const StakingNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={StakingRouter.STAKING_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(StakingScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={StakingScreens[elem].screen}
          options={{
            title: StakingScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StakingNavigation;
