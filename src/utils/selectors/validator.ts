import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import { createSelector } from 'reselect';

import { getBase64IdentIcon } from 'utils/helpers/identicon';

export const stakingReducer = (state: any) => state.staking;

/* This is memoization. It is a technique used to improve the performance of your application by
caching the result of a function call. */
const addValidatorIcon = memoizeOne((validators) => {
  return validators
    ? validators.map((validator: any) => {
        return {
          ...validator,
          icon: getBase64IdentIcon(validator.public_key, { size: 100 }),
        };
      })
    : [];
});

/* This is memoization. It is a technique used to improve the performance of your application by
caching the result of a function call. */
const searchValidator = memoizeOne((validators, searchTerm) => {
  if (!searchTerm) {
    return validators;
  }
  const fuse = new Fuse(validators, { keys: ['public_key', 'name'], threshold: 0.1 });
  return fuse.search(searchTerm).map((result) => result.item);
});

export const getListValidators = (searchTerm?: string) =>
  createSelector(stakingReducer, ({ listValidators }) => {
    if (!listValidators) {
      return [];
    }
    const validatorsWithIcon = addValidatorIcon(listValidators);
    return searchValidator(validatorsWithIcon, searchTerm);
  });
