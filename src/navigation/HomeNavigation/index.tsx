import React, { useRef, useEffect } from 'react';
import { AppState } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { StackName } from 'navigation/ScreenProps';
import { useRestack } from 'utils/hooks/useRestack';

import HomeRouter from './HomeRouter';
import { HomeScreens } from './HomeScreens';

const Stack = createStackNavigator();

const HomeNavigation = () => {
  const appState = useRef(AppState.currentState);
  const reStack = useRestack();

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        if (timeOut) {
          clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
          reStack(StackName.AuthenticationStack, AuthenticationRouter.ENTER_PIN);
        }, 30000);
      }
      if (nextAppState === 'active') {
        clearTimeout(timeOut);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Stack.Navigator
      initialRouteName={HomeRouter.HOME_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
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
