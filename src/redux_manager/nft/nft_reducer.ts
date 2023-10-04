import { types as mainTypes } from '../main/main_action';
import { types } from './nft_action';

export enum DisplayTypes {
  SEND_FORM = 'SEND_FORM',
  ATTRIBUTES = 'ATTRIBUTES',
}

export enum ViewTypes {
  LIST_NFTS = 'LIST_NFTS',
  HISTORIES = 'HISTORIES',
}

type InitialState = {
  viewType?: ViewTypes;
  displayType: DisplayTypes;
};

const initialState: InitialState = {
  viewType: ViewTypes.LIST_NFTS,
  displayType: DisplayTypes.ATTRIBUTES,
};

export default function (state = initialState, { payload, type } = { type: '', payload: {} }) {
  switch (type) {
    case mainTypes.CLEAR_ALL_DATA: {
      return {
        ...initialState,
      };
    }
    case types.UPDATE_DISPLAY_TYPE: {
      return {
        ...state,
        displayType: payload,
      };
    }
    case types.UPDATE_VIEW_TYPE: {
      return {
        ...state,
        viewType: payload,
      };
    }
    default:
      return state;
  }
}
