import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {ScreenProps} from "navigation/ScreenProps";
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';

// @ts-ignore
const DoubleCheckItScreen: React.FC<ScreenProps<CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN>> = ({route, navigation}) => {
    console.log('route', route.params)
    return (
        <View>
            <Text>DoubleCheckItScreen</Text>
        </View>
    );
};

export default DoubleCheckItScreen;
