import {createSelector} from 'reselect';

export const getMainState = (state) => state.main;

export const getConfigurations = createSelector(getMainState, ({configurations}) => {
    return configurations || {};
});
