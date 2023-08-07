import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AuthenticationRouter from './AuthenticationRouter';
import { AuthenticationScreens } from './AuthenticationScreens';

const Stack = createStackNavigator();

const AuthenticationNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthenticationRouter.WELCOME_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(AuthenticationScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={AuthenticationScreens[elem].screen}
          options={{
            title: AuthenticationScreens[elem].title,
            gestureEnabled: AuthenticationScreens[elem].disabledGesture !== true,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthenticationNavigation;
