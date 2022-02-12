import MainRouter from './MainRouter';
import SettingsNavigation from 'navigation/SettingsNavigation';
import HomeTabs from 'navigation/stack/HomeTabs';
import AddCustomTokenScreen from "../../screens/home/AddCustomTokenScreen";

const {SETTINGS_SCREEN, HOME_TAB, ADD_CUSTOM_TOKEN_SCREEN} = MainRouter;

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
        title: 'AddCustomTokenScreen'
    }
};
