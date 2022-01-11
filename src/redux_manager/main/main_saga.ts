import {put, takeLatest, take, cancel, delay} from 'redux-saga/effects';
import {types} from './main_action';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {network} from "services";
import * as RootNavigation from '../../navigation/RootNavigation';

export function* tokenExpire() {
    yield AsyncStorage.removeItem('access_token');
    network.setToken('');
    yield put({type: 'GET_INFORMATION_SUCCESS', payload: null});
    RootNavigation.reset({
        routes: [{name: 'AuthenticationStack'}],
    });
}

export function* watchTokenExpire() {
    yield takeLatest(types.TOKEN_EXPIRE, tokenExpire);
}

