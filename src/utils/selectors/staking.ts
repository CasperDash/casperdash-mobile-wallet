import { createSelector } from 'reselect';

const selectStaking = (state: any) => state.staking;

export const getStakingForm = createSelector(selectStaking, ({ form }) => form);
