import { ConnectedSiteParams, RequestMessage } from './browser_reducer';

export const types = {
  UPDATE_WEB_URL: 'UPDATE_WEB_URL',
  SET_REQUEST_MESSAGE: 'SET_POPUP_REQUEST_MESSAGE',
  SET_DISPLAY_TYPE: 'SET_DISPLAY_TYPE',
  SET_LOADING_PROGRESS: 'SET_LOADING_PROGRESS',
  UPDATE_CONNECTED_SITES: 'UPDATE_CONNECTED_SITES',
  LOAD_CONNECTED_SITES: 'LOAD_CONNECTED_SITES',
  UPDATE_CONNECTED_SITES_SUCCESS: 'UPDATE_CONNECTED_SITES_SUCCESS',
};

const updatewebUrl = (uri: string) => {
  return {
    type: types.UPDATE_WEB_URL,
    payload: uri,
  };
};

const setRequestMessage = ({ type, params }: RequestMessage) => {
  return {
    type: types.SET_REQUEST_MESSAGE,
    payload: {
      type,
      params,
    },
  };
};

const clearRequestMessage = () => {
  return {
    type: types.SET_REQUEST_MESSAGE,
    payload: {},
  };
};

const setDisplayType = (displayType: string) => {
  return {
    type: types.SET_DISPLAY_TYPE,
    payload: displayType,
  };
};

const setLoadingProgress = (progress: number) => {
  return {
    type: types.SET_LOADING_PROGRESS,
    payload: progress,
  };
};

const updateConnectedSites = (connectedSites: { [origin: string]: ConnectedSiteParams }) => {
  return {
    type: types.UPDATE_CONNECTED_SITES,
    payload: connectedSites,
  };
};

const loadConnectedSites = () => {
  return {
    type: types.LOAD_CONNECTED_SITES,
  };
};

export default {
  updatewebUrl,
  setRequestMessage,
  clearRequestMessage,
  setDisplayType,
  setLoadingProgress,
  updateConnectedSites,
  loadConnectedSites,
};
