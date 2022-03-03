import MainRouter from './MainRouter';
import SettingsNavigation from 'navigation/SettingsNavigation';
import HomeTabs from 'navigation/stack/HomeTabs';
import {AddCustomTokenScreen, ConfirmSendScreen, ReceiveScreen, SendScreen, HistoriesScreen, ValidatorScreen} from 'screens';

const {SETTINGS_SCREEN, HOME_TAB, ADD_CUSTOM_TOKEN_SCREEN, SEND_SCREEN, CONFIRM_SEND_SCREEN, RECEIVE_SCREEN, HISTORIES_SCREEN,VALIDATOR_SCREEN} = MainRouter;

export const MainScreens = {
    [HOME_TAB]: {
        screen: HomeTabs,
        title: '',
    },
    [SETTINGS_SCREEN]: {
        screen: SettingsNavigation,
        title: '',
    },
    [ADD_CUSTOM_TOKEN_SCREEN]: {
        screen: AddCustomTokenScreen,
        title: 'AddCustomTokenScreen',
    },
    [SEND_SCREEN]: {
        screen: SendScreen,
    },
    [CONFIRM_SEND_SCREEN]: {
        screen: ConfirmSendScreen,
    },
    [RECEIVE_SCREEN]: {
        screen: ReceiveScreen,
    },
    [HISTORIES_SCREEN]: {
        screen: HistoriesScreen,
    },
    [VALIDATOR_SCREEN]: {
        screen: ValidatorScreen,
    }
};
