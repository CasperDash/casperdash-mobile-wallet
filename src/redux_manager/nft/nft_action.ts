import { DisplayTypes, ViewTypes } from './nft_reducer';

export const types = {
  UPDATE_DISPLAY_TYPE: 'UPDATE_DISPLAY_TYPE',
  UPDATE_VIEW_TYPE: 'UPDATE_VIEW_TYPE',
};

const updateDisplayType = (type: DisplayTypes) => {
  return {
    type: types.UPDATE_DISPLAY_TYPE,
    payload: type,
  };
};

const updateViewType = (type: ViewTypes) => {
  return {
    type: types.UPDATE_VIEW_TYPE,
    payload: type,
  };
};

export default {
  updateDisplayType,
  updateViewType,
};
