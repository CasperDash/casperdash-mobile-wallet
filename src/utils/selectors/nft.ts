import { createSelector } from 'reselect';

const selectNFT = (state: any) => state.nft;

export const getDisplayType = createSelector(selectNFT, ({ displayType }) => displayType);

export const getViewType = createSelector(selectNFT, ({ viewType }) => viewType);
