import {createSelector} from 'reselect';
import * as DEFAULT_CONFIG from 'utils/constants/key';

export const getMainState = (state) => state.main;

export const getConfigurations = createSelector(getMainState, ({configurations}) => {
    return configurations || {};
});

/**
 * Get the value of a configuration key
 * @param key - The key of the configuration you want to get.
 * @returns The value of the key in the configuration object.
 */

export const getConfigKey = (key) => createSelector(getConfigurations, (configurations) => {
    return configurations && configurations[key] || DEFAULT_CONFIG[key];
});
