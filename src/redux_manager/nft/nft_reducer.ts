/* eslint-disable prettier/prettier */
import { types } from './nft_action';

interface IState {
  listNfts: any;
  isLoading: Boolean;
  prevSort: string;
}

const initialState: IState = {
  listNfts: [],
  isLoading: false,
  prevSort: types.SORT_NAME,
};

export default function (state = initialState, action = { type: types.GET_LIST_NFT, payload: [] }) {
  switch (action.type) {
    case types.GET_LIST_SUCCESS:
      return {
        ...state,
        listNfts: action.payload,
      };
    case types.ADD_NFT_CONTACT_ADDRESS:
      return {
        ...state,
        nftAdress: action.payload,
      };
    case types.LOADING_LIST:
      return {
        ...state,
        isLoading: action.payload,
      };
    case types.SORT_PREV:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}
