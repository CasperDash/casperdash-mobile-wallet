import MainRouter from './MainRouter';
import SettingsSceen from 'screens/settings/SettingsScreen';
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
  ImportAccountScreen,
  ShowRecoveryPhraseScreen,
  PrivateKeyScreen,
  AccountListScreen,
  ConnectLedgerScreen,
} from 'screens';
import NFTDetail from 'screens/nft/NFTDetailScreen';
import SimpleWebViewScreen from 'screens/simple_web_view/SimpleWebViewScreen';
import AboutCasperDash from 'screens/settings/AboutCasperDash';
import TransferNFTHistoryScreen from 'screens/nft/TransferNFTHistoryScreen';

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
  IMPORT_ACCOUNT_SCREEN,
  SHOW_RECOVERY_PHRASE_SCREEN,
  SHOW_PRIVATE_KEY_SCREEN,
  SIMPLE_WEBVIEW_SCREEN,
  ABOUT_CASPERDASH,
  TRANSFER_NFT_HISTORY_SCREEN,
  ACCOUNT_LIST_SCREEN,
  CONNECT_LEDGER_SCREEN,
} = MainRouter;

export const MainScreens = {
  [HOME_TAB]: {
    screen: HomeTabs,
    title: '',
  },
  [SETTINGS_SCREEN]: {
    screen: SettingsSceen,
    title: '',
  },
  [ABOUT_CASPERDASH]: {
    screen: AboutCasperDash,
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
  [TRANSFER_NFT_HISTORY_SCREEN]: {
    screen: TransferNFTHistoryScreen,
  },
  [VALIDATOR_SCREEN]: {
    screen: ValidatorScreen,
  },
  [STAKING_CONFIRM_SCREEN]: {
    screen: StakingConfirmScreen,
  },
  [IMPORT_ACCOUNT_SCREEN]: {
    screen: ImportAccountScreen,
  },
  [SHOW_RECOVERY_PHRASE_SCREEN]: {
    screen: ShowRecoveryPhraseScreen,
  },
  [SHOW_PRIVATE_KEY_SCREEN]: {
    screen: PrivateKeyScreen,
  },
  [SIMPLE_WEBVIEW_SCREEN]: {
    screen: SimpleWebViewScreen,
  },
  [ACCOUNT_LIST_SCREEN]: {
    screen: AccountListScreen,
  },
  [CONNECT_LEDGER_SCREEN]: {
    screen: ConnectLedgerScreen,
  },
};
