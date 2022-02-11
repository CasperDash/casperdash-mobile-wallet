import {all} from 'redux-saga/effects';
import {
    watchGetAccountInformation,
} from '../user/user_saga';

import {
    watchLoadLocalStorage,
    watchShowMessage,
} from '../main/main_saga';

import {

} from '../wallet/wallet_saga';

import {
    watchGetTokenInfoWithBalance,
    watchFetchCSPRMarketInfo,
} from '../home/home_saga';

export default function* rootSaga() {
    yield all([
        //user
        watchGetAccountInformation(),

        // main
        watchShowMessage(),
        watchLoadLocalStorage(),

        //home
        watchGetTokenInfoWithBalance(),
        watchFetchCSPRMarketInfo(),
        //wallet

    ]);
}
