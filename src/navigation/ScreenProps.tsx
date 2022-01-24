import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export type ScreenParams = {
    AuthenticationRouter: undefined;
    CREATE_NEW_WALLET_SCREEN: undefined,
    DOUBLE_CHECK_IT_SCREEN: {
        data: any
    },
    CHOOSE_PIN_SCREEN: undefined,
    CONFIRM_PIN_SCREEN: {
        pin: number,
    }
};

type ScreenNavigationProp<T extends keyof ScreenParams> = StackNavigationProp<ScreenParams, T>;
type ScreenRouteProp<T extends keyof ScreenParams> = RouteProp<ScreenParams, T>;

export type ScreenProps<T extends keyof ScreenParams> = {
    route: ScreenRouteProp<T>;
    navigation: ScreenNavigationProp<T>;
};
