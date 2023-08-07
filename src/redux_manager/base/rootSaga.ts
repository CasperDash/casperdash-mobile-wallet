import { all } from 'redux-saga/effects';

import { watchLoadConnectedSites, watchUpdateConnectedSites } from 'redux_manager/browser/browser_saga';
import { watchPushStakeToLocalStorage } from 'redux_manager/staking/staking_saga';

import { watchPushTransferToLocalStorage } from '../home/home_saga';
import { watchLoadLocalStorage, watchShowMessage } from '../main/main_saga';
import { watchLoadSelectedWallet } from '../user/user_saga';

export default function* rootSaga() {
  yield all([
    //user
    watchLoadSelectedWallet(),

    // main
    watchShowMessage(),
    watchLoadLocalStorage(),

    //home
    watchPushTransferToLocalStorage(),
    //wallet

    //Staking
    watchPushStakeToLocalStorage(),

    //Connected Sites
    watchUpdateConnectedSites(),
    watchLoadConnectedSites(),
  ]);
}
