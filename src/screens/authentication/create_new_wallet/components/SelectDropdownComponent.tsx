import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, IconArrowDown, textStyles } from 'assets';
import { Row } from 'components';
import { scale } from 'device';

interface Props {
  item: string;
}

const SelectDropdownComponent = ({ item }: Props) => {
  return (
    <Row.LR px={8} style={styles.container}>
      <Text style={textStyles.Body1}>{item}</Text>
      <Row.C>
        <View style={styles.verticalLine} />
        <IconArrowDown width={scale(10)} height={scale(6)} />
      </Row.C>
    </Row.LR>
  );
};

export default SelectDropdownComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
  },
  verticalLine: {
    width: scale(1),
    marginHorizontal: scale(8),
    height: scale(30),
    backgroundColor: colors.N4,
  },
});
