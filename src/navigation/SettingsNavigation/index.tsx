import React from 'react';
import { SettingsScreens } from './SettingsScreens';
import SettingsRouter from './SettingsRouter';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const SettingsNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={SettingsRouter.SETTINGS_SCREEN}
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(SettingsScreens).map((elem: string, index) => (
        <Stack.Screen
          name={elem}
          component={SettingsScreens[elem].screen}
          options={{
            title: SettingsScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default SettingsNavigation;
