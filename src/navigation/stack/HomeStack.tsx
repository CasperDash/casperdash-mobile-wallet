import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {
    HomeScreen
} from 'screens';
import {StackParamList} from "navigation/ScreenProps";

const Stack = createStackNavigator<StackParamList>();

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
