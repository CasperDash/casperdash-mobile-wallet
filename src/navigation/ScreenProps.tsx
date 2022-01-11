import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";

export type ScreenParams = {
    AuthenticationRouter: undefined;
};

type ScreenNavigationProp<T extends keyof ScreenParams> = StackNavigationProp<ScreenParams, T>;
type ScreenRouteProp<T extends keyof ScreenParams> = RouteProp<ScreenParams, T>;

export type ScreenProps<T extends keyof ScreenParams> = {
    route: ScreenRouteProp<T>;
    navigation: ScreenNavigationProp<T>;
};
