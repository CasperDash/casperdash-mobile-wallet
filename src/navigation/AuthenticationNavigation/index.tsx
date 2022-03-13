import React from 'react';
import { AuthenticationScreens } from './AuthenticationScreens';
import AuthenticationRouter from './AuthenticationRouter';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthenticationNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthenticationRouter.WELCOME_SCREEN}
      screenOptions={{
        headerShown: false,
      }}>
      {Object.keys(AuthenticationScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={AuthenticationScreens[elem].screen}
          options={{
            title: AuthenticationScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthenticationNavigation;
