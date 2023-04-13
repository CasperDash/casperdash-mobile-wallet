import { all } from 'redux-saga/effects';
import { watchLoadSelectedWallet } from '../user/user_saga';

import { watchLoadLocalStorage, watchShowMessage } from '../main/main_saga';

import { watchGetTokenAddressInfo, watchPushTransferToLocalStorage } from '../home/home_saga';

import { watchFetchNFTInfo } from '../nft/nft_saga';
import { watchGetValidatorsInformation, watchPushStakeToLocalStorage } from 'redux_manager/staking/staking_saga';

export default function* rootSaga() {
  yield all([
    //user
    watchLoadSelectedWallet(),

    // main
    watchShowMessage(),
    watchLoadLocalStorage(),

    //home
    watchGetTokenAddressInfo(),
    watchPushTransferToLocalStorage(),
    //wallet

    //NFTs
    watchFetchNFTInfo(),

    //Staking
    watchGetValidatorsInformation(),
    watchPushStakeToLocalStorage(),
  ]);
}
