import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, IconArrowDown, textStyles } from 'assets';
import { Row } from 'components';
import { scale } from 'device';

interface Props {
  item: any;
  value: string;
}

const SwapDropdownComponent = ({ item, value }: Props) => {
  return (
    <Row.LR px={8} style={styles.container}>
      <Row.C>
        <Text style={textStyles.Body1}>
          {item && item.symbol ? item.symbol : ''}
        </Text>
        <IconArrowDown
          width={scale(10)}
          height={scale(6)}
          style={{ marginHorizontal: scale(10) }}
        />
        <View style={styles.verticalLine} />
      </Row.C>
      <Text style={textStyles.Sub1}>{value}</Text>
    </Row.LR>
  );
};

export default SwapDropdownComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
  },
  verticalLine: {
    width: scale(1),
    height: scale(30),
    backgroundColor: colors.N4,
  },
});
