import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { ViewTypes } from 'redux_manager/nft/nft_reducer';

export const useUpdateViewType = () => {
  const dispatch = useDispatch();
  const updateDisplayType = useCallback((type: ViewTypes) => dispatch(allActions.nft.updateViewType(type)), [dispatch]);

  return updateDisplayType;
};
