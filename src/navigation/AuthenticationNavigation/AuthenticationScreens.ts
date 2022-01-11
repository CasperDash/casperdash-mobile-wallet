import {WelcomeScreen} from 'screens';
import AuthenticationRouter from './AuthenticationRouter';

const {WELCOME_SCREEN} = AuthenticationRouter;

export const AuthenticationScreens: any = {
    [WELCOME_SCREEN]: {
        screen: WelcomeScreen,
        title: '',
    },
};
