import React from 'react';
import {MainScreens} from './MainScreens';
import MainRouter from './MainRouter';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const Stack = createStackNavigator();

const MainNavigation = () => {
    return (
        <Stack.Navigator
            initialRouteName={MainRouter.HOME_TAB}
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            {Object.keys(MainScreens).map((elem: string, index) => (
                <Stack.Screen
                    name={elem}
                    component={MainScreens[elem].screen}
                    options={{
                        title: MainScreens[elem].title,
                    }}
                    key={index}
                />
            ))}
        </Stack.Navigator>
    );
};

export default MainNavigation;
