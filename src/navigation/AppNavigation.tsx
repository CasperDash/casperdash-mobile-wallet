import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import {isReadyRef, navigationRef} from 'navigation/RootNavigation';
import MainStack from './stack/MainStack';
import AuthenticationNavigation from './AuthenticationNavigation';
import {SplashScreen} from 'screens';
import CMessge from 'components/CMessge';

const Stack = createStackNavigator();

export default function AppNavigation() {

    useEffect(() => {
        return () => {
            isReadyRef.current = false;
        };
    }, []);

    const fadeAnim = ({ current } : any) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });

    return (
        <>
            <NavigationContainer
                onReady={() => {
                    isReadyRef.current = true;
                }}
                ref={navigationRef}
                theme={{
                    dark: false,
                    colors: {
                        primary: 'white',
                        background: 'white',
                        card: 'white',
                        text: 'white',
                        border: 'white',
                        notification: 'white',
                    },
                }}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        gestureEnabled: false,
                        cardStyleInterpolator: fadeAnim,
                    }}>
                    <Stack.Screen name="SplashScreen" component={SplashScreen}/>
                    <Stack.Screen name="MainStack" component={MainStack}/>
                    <Stack.Screen name="AuthenticationStack" component={AuthenticationNavigation}/>
                </Stack.Navigator>
            </NavigationContainer>
            <CMessge/>
        </>
    );
}
