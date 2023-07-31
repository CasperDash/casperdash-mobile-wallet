import { WalletInfo } from 'react-native-casper-storage';
import { types } from './browser_action';

export enum RequestTypes {
  CONNECT = 'popupManager.openRequestConnect',
  SIGN = 'signingManager.signDeploy',
  SIGN_MESSAGE = 'signingManager.signMessage',
  GET_ACTIVE_PUBLIC_KEY = 'signingManager.getCurrentPublicKey',
  IS_CONNECTED = 'popupManager.isConnected',
  DISCONNECT = 'popupManager.disconnectFromSite',
}

enum DisplayTypesEnum {
  BROWSER = 'browser',
  HOMEPAGE = 'homepage',
}

export type RequestMessage = {
  type?: RequestTypes;
  params?: Record<string, string | undefined>;
};

export type Tab = {
  id: string;
  url: string;
};

export type ConnectedSiteParams = {
  account: {
    publicKey: string;
    uid: string;
    walletInfo?: WalletInfo;
  };
  connectedUids: string[];
};

export type ConnectedSites = {
  [origin: string]: ConnectedSiteParams;
};

type InitialState = {
  url?: string;
  displayType: DisplayTypesEnum;
  requestMessage: RequestMessage;
  loadingProgress: number;
  tabs: Tab[];
  activeTab?: string;
  connectedSites: ConnectedSites;
};

const initialState = {
  url: '',
  displayType: DisplayTypesEnum.HOMEPAGE,
  requestMessage: {
    type: undefined,
    params: undefined,
  },
  tabs: [],
  activeTab: undefined,
  loadingProgress: 0,
  connectedSites: {},
};

export default function (state: InitialState = initialState, action = { type: '', payload: {} }) {
  switch (action.type) {
    case types.UPDATE_WEB_URL: {
      return {
        ...state,
        url: action.payload,
      };
    }
    case types.SET_REQUEST_MESSAGE: {
      return {
        ...state,
        requestMessage: action.payload,
      };
    }
    case types.SET_DISPLAY_TYPE: {
      return {
        ...state,
        displayType: action.payload,
      };
    }
    case types.SET_LOADING_PROGRESS: {
      return {
        ...state,
        loadingProgress: action.payload,
      };
    }
    case types.UPDATE_CONNECTED_SITES_SUCCESS: {
      return {
        ...state,
        connectedSites: action.payload,
      };
    }
    default:
      return state;
  }
}
