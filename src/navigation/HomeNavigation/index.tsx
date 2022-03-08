import React from 'react';
import { HomeScreens } from './HomeScreens';
import HomeRouter from './HomeRouter';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={HomeRouter.HOME_SCREEN}
      screenOptions={{
        headerShown: false,
      }}>
      {Object.keys(HomeScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={HomeScreens[elem].screen}
          options={{
            title: HomeScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default HomeNavigation;
