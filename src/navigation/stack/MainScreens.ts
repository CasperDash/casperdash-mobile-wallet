import MainRouter from './MainRouter';
import SettingsNavigation from 'navigation/SettingsNavigation';
import HomeTabs from 'navigation/stack/HomeTabs';
import {AddCustomTokenScreen, ConfirmSendScreen, SendScreen} from 'screens';

const {SETTINGS_SCREEN, HOME_TAB, ADD_CUSTOM_TOKEN_SCREEN, SEND_SCREEN, CONFIRM_SEND_SCREEN} = MainRouter;

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
};
