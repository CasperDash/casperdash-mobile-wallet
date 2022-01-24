import {WelcomeScreen} from 'screens';
import AuthenticationRouter from './AuthenticationRouter';
import CreateNewWalletNavigation from 'navigation/CreateNewWalletNavigation';
import ChoosePinNavigation from 'navigation/ChoosePinNavigation';
import EnterPinScreen from 'screens/authentication/choose_pin/EnterPinScreen';

const {WELCOME_SCREEN, CREATE_NEW_WALLET, CHOOSE_PIN, ENTER_PIN} = AuthenticationRouter;

export const AuthenticationScreens: any = {
    [WELCOME_SCREEN]: {
        screen: WelcomeScreen,
        title: '',
    },
    [CREATE_NEW_WALLET]: {
        screen: CreateNewWalletNavigation,
    },
    [CHOOSE_PIN]: {
        screen: ChoosePinNavigation,
    },
    [ENTER_PIN]: {
        screen: EnterPinScreen,
    },
};
