import { Message } from 'components/CMessge/types';

export const types = {
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  SHOW_MESSAGE_SUCCESS: 'SHOW_MESSAGE_SUCCESS',

  LOAD_LOCAL_STORAGE: 'LOAD_LOCAL_STORAGE',
  LOAD_LOCAL_STORAGE_SUCCESS: 'LOAD_LOCAL_STORAGE_SUCCESS',

  START_ACTION: 'START_ACTION',
  STOP_ACTION: 'STOP_ACTION',

  REFRESH_ACTION_START: 'REFRESH_ACTION_START',
  REFRESH_ACTION_STOP: 'REFRESH_ACTION_STOP',
  INIT_APP_STATE: 'INIT_APP_STATE',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
};

const showMessage = (message: Message, duration?: number) => {
  return {
    type: types.SHOW_MESSAGE,
    message,
    duration,
  };
};

const loadLocalStorage = () => {
  return {
    type: types.LOAD_LOCAL_STORAGE,
  };
};

export const startAction = (name: any, params?: any) => ({
  type: types.START_ACTION,
  payload: {
    action: {
      name,
      params,
    },
  },
});

export const stopAction = (name: any) => ({
  type: types.STOP_ACTION,
  payload: { name },
});

export const refreshActionStart = (name: any, params?: any) => ({
  type: types.REFRESH_ACTION_START,
  payload: {
    action: {
      name,
      params,
    },
  },
});

export const refreshActionStop = (name: any) => ({
  type: types.REFRESH_ACTION_STOP,
  payload: { name },
});

export const initState = () => {
  return { type: types.INIT_APP_STATE };
};

export const clearAllData = () => {
  return { type: types.CLEAR_ALL_DATA };
};

export default {
  showMessage,
  loadLocalStorage,
  startAction,
  stopAction,
  initState,
  clearAllData,
};
