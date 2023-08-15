import { createSelector } from 'reselect';

const selectBrowser = (state: any) => state.browser;

export const getwebUrl = createSelector(selectBrowser, ({ url }) => url);

export const getRequestMessage = createSelector(selectBrowser, ({ requestMessage }) => requestMessage);

export const getDisplayType = createSelector(selectBrowser, ({ displayType }) => displayType);

export const getLoadingProgress = createSelector(selectBrowser, ({ loadingProgress }) => loadingProgress);

export const getConnectedSites = createSelector(selectBrowser, ({ connectedSites }) => connectedSites);
