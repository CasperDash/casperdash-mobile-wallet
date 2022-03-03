import { put, takeLatest, call, select } from 'redux-saga/effects';
import { types } from './nft_action';
import { apis } from 'services';
import config from 'utils/config';
import { Keys } from 'utils';

const getMetadataByKey = (metadata: any[], key: any) => {
    const data = metadata.find(item => item.key === key) || {};
    return data.value;
};

export function* getApiNFtList(params: string) {
    try {
        yield put({ type: types.LOADING_LIST, payload: true });
        const response = yield call(apis.getListNFTsAPI, params.payload);
        console.log('response',response)
        if (response) {
            let newData: { nftName: any; nftImage: any; metadata: any[]; }[] = [];
            response.forEach((element: { metadata: any[]; }): any => {
                const NFTname = getMetadataByKey(element.metadata, 'name');
                const NFTimage = getMetadataByKey(element.metadata, 'image');
                newData.push({ ...element, nftName: NFTname, nftImage: NFTimage });
            });
            newData.sort((a, b) => (a.nftName > b.nftName ? 1 : -1));
            config.saveItem(Keys.nfts,newData);
            yield put({ type: types.LOADING_LIST, payload: false });
        } else {
        }
    } catch (error) {
        console.log(error);
    }
}


export function* watchgetNFTsaga() {
    yield takeLatest(types.GET_LIST_NFT, getApiNFtList);
}
