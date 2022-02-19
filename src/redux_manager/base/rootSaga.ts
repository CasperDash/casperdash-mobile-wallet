import {all} from 'redux-saga/effects';
import {
    watchGetAccountInformation,
} from '../user/user_saga';

import {
    watchGetConfigurations,
    watchLoadLocalStorage,
    watchShowMessage,
} from '../main/main_saga';

import {

} from '../wallet/wallet_saga';

import {
    watchGetTokenInfoWithBalance,
    watchFetchCSPRMarketInfo,
    watchGetTokenAddressInfo,
} from '../home/home_saga';

export default function* rootSaga() {
    yield all([
        //user
        watchGetAccountInformation(),

        // main
        watchShowMessage(),
        watchLoadLocalStorage(),
        watchGetConfigurations(),

        //home
        watchGetTokenInfoWithBalance(),
        watchFetchCSPRMarketInfo(),
        watchGetTokenAddressInfo(),

        //wallet

    ]);
}
