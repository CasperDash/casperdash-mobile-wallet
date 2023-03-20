import { cancel, put, take, takeLatest } from 'redux-saga/effects';
import { types } from './staking_action';
import { apis } from 'services';
import { stopAction, startAction, refreshActionStart, refreshActionStop } from 'redux_manager/main/main_action';
import { Config, Keys } from 'utils';

export function* getValidatorsInformation(data: any) {
  try {
    yield put(
      data.params.refreshing
        ? refreshActionStart(types.GET_VALIDATORS_INFORMATION)
        : startAction(types.GET_VALIDATORS_INFORMATION),
    );
    // @ts-ignore
    const response = yield apis.getValidatorsInformationAPI(data.params.publicKey);
    if (response) {
      yield put({
        type: types.GET_VALIDATORS_INFORMATION_SUCCESS,
        payload: response,
      });
      data.cb && data.cb(null, response);
    } else {
      data.cb && data.cb(true, null);
    }
  } catch (error: any) {
    if (error && error.data) {
      data.cb && data.cb(error.data, null);
    } else {
      data.cb && data.cb(error, null);
    }
  } finally {
    yield put(
      data.params.refreshing
        ? refreshActionStop(types.GET_VALIDATORS_INFORMATION)
        : stopAction(types.GET_VALIDATORS_INFORMATION),
    );
  }
}

export function* watchGetValidatorsInformation() {
  yield takeLatest(types.GET_VALIDATORS_INFORMATION, getValidatorsInformation);
}

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
