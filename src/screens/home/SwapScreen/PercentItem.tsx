import { CButton, Row } from 'components';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Percent } from './data/data';
import { scale } from 'device';
import { colors, textStyles } from 'assets';

interface Props {
  data: Percent;
  length: number;
  onSelectPercent: (data: Percent) => void;
  isSelected?: boolean;
}

const PercentItem = ({ data, length, isSelected, onSelectPercent }: Props) => {
  return (
    <CButton onPress={() => onSelectPercent(data)}>
      <Row.C
        style={[
          styles.container,
          isSelected && { backgroundColor: 'rgba(55, 114, 255, 0.3)' },
          { width: scale((375 - 16 * 2 - 2 * length) / length) },
        ]}>
        <Text style={[styles.title, isSelected && { color: colors.N2 }]}>
          {data.value}%
        </Text>
      </Row.C>
    </CButton>
  );
};

export default PercentItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(215,227, 255, 0.3 )',
    borderRadius: scale(4),
    height: scale(24),
  },
  title: {
    ...textStyles.Cap2,
    color: colors.N3,
  },
});
