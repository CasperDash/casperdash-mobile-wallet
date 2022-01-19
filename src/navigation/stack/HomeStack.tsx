import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {
    HomeScreen
} from 'screens';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
    );
}
