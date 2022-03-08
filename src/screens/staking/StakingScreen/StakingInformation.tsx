import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { scale } from 'device';
import StakedInformationItem from './StakedInformationItem';
import { colors, textStyles } from 'assets';
import { useStakeFromValidators } from 'utils/hooks/useStakeDeploys';
import { useSelector } from 'react-redux';
import { checkIfLoadingSelector } from 'utils/selectors';
import { types as stakingTypes } from 'redux_manager/staking/staking_action';

const StakingInformation = ({ publicKey }: any) => {
  const stackingList = useStakeFromValidators(publicKey);
  const isLoading = useSelector((state: any) =>
    // @ts-ignore
    checkIfLoadingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

  const _renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.N2} />
      </View>
    );
  };

  const _renderList = () => {
    return stackingList.map((stake, index) => {
      return <StakedInformationItem value={stake} key={index} />;
    });
  };

  return (
    <View>
      <Text style={[styles.title, { marginVertical: scale(16) }]}>
        Staked Information
      </Text>
      {isLoading ? _renderLoading() : _renderList()}
    </View>
  );
};

export default StakingInformation;

const styles = StyleSheet.create({
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  loadingContainer: {
    flex: 1,
    height: scale(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
