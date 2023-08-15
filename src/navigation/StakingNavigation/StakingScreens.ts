import { StakingConfirmScreen, StakingScreen } from 'screens';
import StakingRouter from './StakingRouter';
import UndelegateFormScreen from 'screens/staking/UndelegateFormScreen';

const { STAKING_SCREEN, STAKING_CONFIRM_SCREEN, UNDELEGATE_FORM_SCREEN } = StakingRouter;

export const StakingScreens = {
  [STAKING_SCREEN]: {
    screen: StakingScreen,
    title: '',
  },
  [STAKING_CONFIRM_SCREEN]: {
    screen: StakingConfirmScreen,
  },
  [UNDELEGATE_FORM_SCREEN]: {
    screen: UndelegateFormScreen,
  },
};
