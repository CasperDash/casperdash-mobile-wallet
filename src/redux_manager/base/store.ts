import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import allReducers from './allReducers';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middleWare = __DEV__ ? [sagaMiddleware, logger] : [sagaMiddleware];
let store = createStore(allReducers, compose(applyMiddleware(...middleWare)));

sagaMiddleware.run(rootSaga);
export default store;
