import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {ScreenProps} from "navigation/ScreenProps";
import MainRouter from 'navigation/stack/MainRouter';

// @ts-ignore
const HistoriesScreen: React.FC<ScreenProps<MainRouter.HISTORIES_SCREEN>> = ({route}) => {
    const {token} = route.params;

    return (
        <View>
            <Text>HistoriesScreen</Text>
        </View>
    );
};

export default HistoriesScreen;
