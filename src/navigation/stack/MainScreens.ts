import MainRouter from './MainRouter';
import SettingsNavigation from 'navigation/SettingsNavigation';
import HomeTabs from 'navigation/stack/HomeTabs';

const {SETTINGS_SCREEN, HOME_TAB} = MainRouter;

export const MainScreens = {
    [HOME_TAB]: {
        screen: HomeTabs,
        title: '',
    },
    [SETTINGS_SCREEN]: {
        screen: SettingsNavigation,
        title: '',
    },
};
