import { createSelector } from 'reselect';

export const checkIfLoadingSelector = createSelector(
  (state: any) => state.main,
  (_: any, actionsToCheck: any) => actionsToCheck,
  (main, actionsToCheck) => main.loader.actions.some((action: any) => actionsToCheck.includes(action.name)),
);

export const checkIfRefreshingSelector = createSelector(
  (state: any) => state.main,
  (_: any, actionsToCheck: any) => actionsToCheck,
  (main: any, actionsToCheck: any) =>
    main.loader.refreshing.some((action: any) => actionsToCheck.includes(action.name)),
);
