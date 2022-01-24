import {all} from 'redux-saga/effects';
import {
    watchGetAccountInformation,
} from '../user/user_saga';

import {
    watchShowMessage,
} from '../main/main_saga';

import {

} from '../wallet/wallet_saga';

import {

} from '../home/home_saga';

export default function* rootSaga() {
    yield all([
        //user
        watchGetAccountInformation(),

        // main
        watchShowMessage(),

        //home

        //wallet

    ]);
}
