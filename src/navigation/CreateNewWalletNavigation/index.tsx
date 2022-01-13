import React from 'react';
import {CreateNewWalletScreens} from './CreateNewWalletScreens';
import CreateNewWalletRouter from './CreateNewWalletRouter';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenParams} from "navigation/ScreenProps";

const Stack = createStackNavigator<ScreenParams>();

const CreateNewWalletNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            {Object.keys(CreateNewWalletScreens).map((elem: any, index) => (
                <Stack.Screen
                    name={elem}
                    component={CreateNewWalletScreens[elem].screen}
                    options={{
                        title: CreateNewWalletScreens[elem].title,
                    }}
                    key={index}
                />
            ))}
        </Stack.Navigator>
    );
};

export default CreateNewWalletNavigation;
