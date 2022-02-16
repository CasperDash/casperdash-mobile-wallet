import memoizeOne from 'memoize-one';
import {Config, Keys} from "utils";
import {createSelector} from 'reselect';

export const getMainState = (state) => state.main;

export const getConfigurations = createSelector(getMainState, ({configurations}) => {
    return configurations || {};
});
