export const types = {
  GET_LIST_NFT: 'GET_LIST_NFT',
  ADD_NFT_CONTACT_ADDRESS: 'ADD_NFT_CONTACT_ADDRESS',
  GET_LIST_SUCCESS: 'GET_LIST_SUCCESS',
  LOADING_LIST: 'LOADING_LIST',
  SORT: 'SORT',
  SORT_NAME: 'SORT_NAME',
  SORT_CONTRACTNAME: 'SORT_CONTRACTNAME',
};

const fetchNFTInfo = (cb: any) => ({
  type: types.GET_LIST_NFT,
  cb,
});

const addNFTContactAdress = (payload: any) => ({
  type: types.ADD_NFT_CONTACT_ADDRESS,
  payload,
});

const setLoadingNFT = (payload: any) => ({
  type: types.LOADING_LIST,
  payload,
});

const sortNFTs = (payload: any) => ({
  type: types.SORT,
  payload,
});

export default {
  sortNFTs,
  setLoadingNFT,
  addNFTContactAdress,
  fetchNFTInfo,
};
