import { createSelector } from 'reselect';
import memoizeOne from 'memoize-one';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import Fuse from 'fuse.js';

export const stakingReducer = state => state.staking;

const addValidatorIcon = memoizeOne(validators => {
  return validators.map(validator => {
    return {
      ...validator,
      icon: getBase64IdentIcon(validator.public_key, { size: 100 }),
    };
  });
});

const searchValidator = memoizeOne((validators, searchTerm) => {
  if (!searchTerm) {
    return validators;
  }
  const fuse = new Fuse(validators, { keys: ['public_key'], threshold: 0.1 });
  return fuse.search(searchTerm).map(result => result.item);
});

export const getListValidators = searchTerm =>
  createSelector(stakingReducer, ({ listValidators }) => {
    if (!listValidators) {
      return [];
    }
    const validatorsWithIcon = addValidatorIcon(listValidators);
    return searchValidator(validatorsWithIcon, searchTerm);
  });
