import React, { useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { HomeScreens } from './HomeScreens';
import HomeRouter from './HomeRouter';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';

const Stack = createStackNavigator();

const HomeNavigation = () => {
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();

  const resetStack = (name: string) => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: 'AuthenticationStack',
            state: {
              routes: [
                {
                  name: name,
                },
              ],
            },
          },
        ],
      }),
    );
  };

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        if (timeOut) {
          clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
          resetStack(AuthenticationRouter.ENTER_PIN);
        }, 30000);
      }
      if (nextAppState === 'active') {
        clearTimeout(timeOut);
      }
      appState.current = nextAppState;
    });

    return () => {
      //@ts-ignore
      subscription.remove();
    };
  }, []);
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
