import {all} from 'redux-saga/effects';
import {
    watchLogin,
    watchRegister,
    watchGetInformation,
} from '../user/user_saga';

import {
    watchTokenExpire,
} from '../main/main_saga';

import {

} from '../wallet/wallet_saga';

import {

} from '../home/home_saga';

export default function* rootSaga() {
    yield all([
        //user
        watchLogin(),
        watchRegister(),
        watchGetInformation(),

        // main
        watchTokenExpire(),

        //home

        //wallet

    ]);
}
