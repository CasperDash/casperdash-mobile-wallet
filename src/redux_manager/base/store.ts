import logger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import allReducers from './allReducers';
import rootSaga from './rootSaga';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const middleWare = __DEV__ ? [sagaMiddleware, logger] : [sagaMiddleware];
let store = createStore(allReducers, compose(applyMiddleware(...middleWare)));

sagaMiddleware.run(rootSaga);
export default store;
