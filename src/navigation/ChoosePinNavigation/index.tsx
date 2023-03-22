import React from 'react';
import { ChoosePinScreens } from './ChoosePinScreens';
import { createStackNavigator } from '@react-navigation/stack';
import { ScreenParams } from 'navigation/ScreenProps';

const Stack = createStackNavigator<ScreenParams>();

const ChoosePinNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {Object.keys(ChoosePinScreens).map((elem: any, index) => (
        <Stack.Screen
          name={elem}
          component={ChoosePinScreens[elem].screen}
          options={{
            title: ChoosePinScreens[elem].title,
          }}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
};

export default ChoosePinNavigation;
