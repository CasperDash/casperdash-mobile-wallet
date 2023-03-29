import { types } from './main_action';

const initialState = {
  CMessageData: null,
  overview: null,
  configurations: null,
  loader: {
    actions: [],
    refreshing: [],
  },
  tokensAddressList: [],
  casperdash: null,
  deploysTransfer: null,
  deploysStakes: null,
};

export default function (state = initialState, action = { type: '', payload: {} }) {
  const { loader } = state;
  const { actions, refreshing } = loader;

  switch (action.type) {
    case types.SHOW_MESSAGE_SUCCESS:
      return {
        ...state,
        CMessageData: action.payload,
      };
    case types.LOAD_LOCAL_STORAGE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case types.GET_CONFIGURATIONS_SUCCESS:
      return {
        ...state,
        configurations: action.payload,
      };
    case types.START_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...actions, action.payload.action],
        },
      };
    case types.STOP_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: actions.filter((act: any) => act.name !== action.payload.name),
        },
      };
    case types.REFRESH_ACTION_START:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: [...refreshing, action.payload.action],
        },
      };
    case types.REFRESH_ACTION_STOP:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: refreshing.filter((act: any) => act.name !== action.payload.name),
        },
      };

    default:
      return state;
  }
}
