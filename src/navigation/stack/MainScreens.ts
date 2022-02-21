import MainRouter from './MainRouter';
import SettingsNavigation from 'navigation/SettingsNavigation';
import HomeTabs from 'navigation/stack/HomeTabs';
import {ReceiveScreen, AddCustomTokenScreen} from 'screens';

const {SETTINGS_SCREEN, HOME_TAB, ADD_CUSTOM_TOKEN_SCREEN, RECEIVE_SCREEN} = MainRouter;

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
    [RECEIVE_SCREEN]: {
        screen: ReceiveScreen,
    },
};
