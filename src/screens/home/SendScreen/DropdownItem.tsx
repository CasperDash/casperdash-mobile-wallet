import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { colors, textStyles } from 'assets';
import { Row } from 'components';
import { scale } from 'device';
import { toFormattedNumber } from 'utils/helpers/format';
import { ITokenInfo } from 'utils/hooks/useTokenInfo';

interface Props {
  item: ITokenInfo;
}

const DropdownItem = ({ item }: Props) => {
  return (
    <Row.LR px={16} style={styles.dropItem}>
      <Text style={textStyles.Body1}>{item.symbol}</Text>
      <Text style={textStyles.Sub1}>{item.balance ? toFormattedNumber(item?.balance?.displayValue) : '0'}</Text>
    </Row.LR>
  );
};

export default DropdownItem;

const styles = StyleSheet.create({
  dropItem: {
    width: scale(343),
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
    borderRadius: scale(0),
    borderWidth: 0,
  },
});
