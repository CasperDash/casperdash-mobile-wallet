import { put, takeLatest, call, select, take, cancel } from 'redux-saga/effects';
import { types } from './nft_action';
import { apis } from 'services';
import config from 'utils/config';
import { Config, Keys } from 'utils';

const getMetadataByKey = (metadata: any[], key: any) => {
  const data = metadata.find((item) => item.key === key) || {};
  return data.value;
};

export function* fetchNFTInfo(data: any) {
  try {
    yield put({ type: types.LOADING_LIST, payload: true });
    // @ts-ignore
    const casperDashInfo = yield Config.getItem(Keys.casperdash);
    // @ts-ignore
    const response = yield apis.getListNFTsAPI((casperDashInfo && casperDashInfo.publicKey) || '');
    if (response) {
      let newData: { nftName: any; nftImage: any; metadata: any[] }[] = [];
      response.forEach((element: { metadata: any[] }): any => {
        const NFTname = getMetadataByKey(element.metadata, 'name');
        const NFTimage = getMetadataByKey(element.metadata, 'image');
        newData.push({ ...element, nftName: NFTname, nftImage: NFTimage });
      });
      newData.sort((a, b) => (a.nftName > b.nftName ? 1 : -1));
      yield config.saveItem(Keys.nfts, newData);
      data.cb && data.cb(null, newData);
      yield put({ type: types.LOADING_LIST, payload: false });
    } else {
      data.cb && data.cb(true, null);
    }
  } catch (error: any) {
    if (error && error.data) {
      data.cb && data.cb(error.data, null);
    } else {
      data.cb && data.cb(error, null);
    }
  }
}

export function* watchFetchNFTInfo() {
  // @ts-ignore
  yield takeLatest(types.GET_LIST_NFT, fetchNFTInfo);
}
