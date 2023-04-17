import { cancel, put, take, takeLatest } from 'redux-saga/effects';
import { types } from './staking_action';
import { Config, Keys } from 'utils';

export function* pushStakeToLocalStorage(data: any) {
  const { publicKey, stake } = data;
  // @ts-ignore
  let deploysStakes = yield Config.getItem(Keys.deploysStakes);
  deploysStakes = deploysStakes || {};
  if (deploysStakes && deploysStakes[publicKey]) {
    const listStakes = deploysStakes[publicKey] || [];
    listStakes.push(stake);
    deploysStakes[publicKey] = listStakes;
  } else {
    deploysStakes[publicKey] = [{ ...stake }];
  }
  yield Config.saveItem(Keys.deploysStakes, deploysStakes);
  yield put({
    type: types.PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS,
    payload: deploysStakes,
  });
}

export function* watchPushStakeToLocalStorage() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.PUSH_STAKE_TO_LOCAL_STORAGE, pushStakeToLocalStorage);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}
