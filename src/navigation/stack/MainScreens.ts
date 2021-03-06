import MainRouter from './MainRouter';
import SettingsNavigation from 'navigation/SettingsNavigation';
import HomeTabs from 'navigation/stack/HomeTabs';
import {
  AddCustomTokenScreen,
  ConfirmSendScreen,
  ReceiveScreen,
  SendScreen,
  HistoriesScreen,
  TransferHistoryScreen,
  ValidatorScreen,
  StakingConfirmScreen,
} from 'screens';
import NFTDetail from 'screens/nft/NFTDetailScreen';

const {
  SETTINGS_SCREEN,
  HOME_TAB,
  ADD_CUSTOM_TOKEN_SCREEN,
  SEND_SCREEN,
  CONFIRM_SEND_SCREEN,
  RECEIVE_SCREEN,
  HISTORIES_SCREEN,
  NFTDETAIL_SCREEN,
  TRANSFER_HISTORY_SCREEN,
  VALIDATOR_SCREEN,
  STAKING_CONFIRM_SCREEN,
} = MainRouter;

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
  [NFTDETAIL_SCREEN]: {
    screen: NFTDetail,
  },
  [TRANSFER_HISTORY_SCREEN]: {
    screen: TransferHistoryScreen,
  },
  [VALIDATOR_SCREEN]: {
    screen: ValidatorScreen,
  },
  [STAKING_CONFIRM_SCREEN]: {
    screen: StakingConfirmScreen,
  },
};
