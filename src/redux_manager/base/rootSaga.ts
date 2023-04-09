import { all } from 'redux-saga/effects';
import { watchGetAccounts, watchLoadSelectedWallet } from '../user/user_saga';

import { watchGetConfigurations, watchLoadLocalStorage, watchShowMessage } from '../main/main_saga';

import { watchGetTokenAddressInfo, watchPushTransferToLocalStorage } from '../home/home_saga';

import { watchFetchNFTInfo } from '../nft/nft_saga';
import { watchGetValidatorsInformation, watchPushStakeToLocalStorage } from 'redux_manager/staking/staking_saga';

export default function* rootSaga() {
  yield all([
    //user
    watchGetAccounts(),
    watchLoadSelectedWallet(),

    // main
    watchShowMessage(),
    watchLoadLocalStorage(),
    watchGetConfigurations(),

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
