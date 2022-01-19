import React from 'react';
import {View, Text} from 'react-native';
import {ScreenProps} from 'navigation/ScreenProps';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';

// @ts-ignore
const ChoosePinScreen: React.FC<ScreenProps<CreateNewWalletRouter.CHOOSE_PIN_SCREEN>> = ({route}) => {

    return (
        <View>
            <Text>ChoosePinScreen</Text>
        </View>
    );
};

export default ChoosePinScreen;
