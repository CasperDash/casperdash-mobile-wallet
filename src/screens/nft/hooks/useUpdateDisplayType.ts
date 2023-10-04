import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { DisplayTypes } from 'redux_manager/nft/nft_reducer';

export const useUpdateDisplayType = () => {
  const dispatch = useDispatch();
  const updateDisplayType = useCallback(
    (type: DisplayTypes) => dispatch(allActions.nft.updateDisplayType(type)),
    [dispatch],
  );

  return updateDisplayType;
};
