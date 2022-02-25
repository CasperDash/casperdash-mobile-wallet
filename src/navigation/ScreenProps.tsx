import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export type ScreenParams = {
    AuthenticationRouter: undefined;
    CREATE_NEW_WALLET_SCREEN: undefined,
    DOUBLE_CHECK_IT_SCREEN: {
        data: any
    },
    CHOOSE_PIN_SCREEN: {
        hideBackButton?: boolean,
    },
    CONFIRM_PIN_SCREEN: {
        pin: number,
    },
    CONFIRM_SEND_SCREEN: {
        transferAmount: number,
        receivingAddress: string,
        transferID?: any
        selectedToken: any,
        networkFee: number,
        token: any
    },
    SEND_SCREEN: {
        token: any,
    },
    HISTORIES_SCREEN: {
        token: any
    }
};

type ScreenNavigationProp<T extends keyof ScreenParams> = StackNavigationProp<ScreenParams, T>;
type ScreenRouteProp<T extends keyof ScreenParams> = RouteProp<ScreenParams, T>;

export type ScreenProps<T extends keyof ScreenParams> = {
    route: ScreenRouteProp<T>;
    navigation: ScreenNavigationProp<T>;
};
