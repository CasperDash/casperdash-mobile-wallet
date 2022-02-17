/* eslint-disable prettier/prettier */
export const types = {
  GET_LIST_NFT: 'GET_LIST_NFT',
  ADD_NFT_CONTACT_ADDRESS: 'ADD_NFT_CONTACT_ADDRESS',
  GET_LIST_SUCCESS: 'GET_LIST_SUCCESS',
  LOADING_LIST: 'LOADING_LIST',
  SORT: 'SORT',
  SORT_NAME: 'SORT_NAME',
  SORT_CONTRACTNAME: 'SORT_CONTRACTNAME',
};

export const fetchNFTInfo = (payload: string) => ({
  type: types.GET_LIST_NFT,
  payload,
});

export const addNFTContactAdress = (payload: any) => ({
  type: types.ADD_NFT_CONTACT_ADDRESS,
  payload,
});

export const setLoadingNFT = (payload: any) => ({
  type: types.LOADING_LIST,
  payload,
});

export const sortNFTs = (payload: any) => ({
  type: types.SORT,
  payload,
});

 