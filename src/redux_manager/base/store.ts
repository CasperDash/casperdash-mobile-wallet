import logger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import allReducers from './allReducers';
import rootSaga from './rootSaga';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
let store = createStore(
  allReducers,
  compose(applyMiddleware(...[sagaMiddleware, logger])),
);
sagaMiddleware.run(rootSaga);
export default store;
