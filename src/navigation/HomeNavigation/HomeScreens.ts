import { HomeScreen } from 'screens';

import HomeRouter from './HomeRouter';

const { HOME_SCREEN } = HomeRouter;

export const HomeScreens = {
  [HOME_SCREEN]: {
    screen: HomeScreen,
    title: 'HomeScreen',
  },
};
