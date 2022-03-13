import { createSelector } from 'reselect';

export const checkIfLoadingSelector = createSelector(
  state => state.main,
  (_, actionsToCheck) => actionsToCheck,
  (main, actionsToCheck) =>
    main.loader.actions.some(action => actionsToCheck.includes(action.name)),
);

export const checkIfRefreshingSelector = createSelector(
  state => state.main,
  (_, actionsToCheck) => actionsToCheck,
  (main, actionsToCheck) =>
    main.loader.refreshing.some(action => actionsToCheck.includes(action.name)),
);
