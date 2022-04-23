import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CButton, Row } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';

interface Props {
  item: string;
  onSelect: (item: string) => void;
  isSelected: boolean;
}

const SlippageToleranceItem = ({ item, onSelect, isSelected }: Props) => {
  return (
    <CButton onPress={() => onSelect(item)}>
      <Row.C
        style={[
          styles.container,
          isSelected && { backgroundColor: colors.B1 },
        ]}>
        <Text style={[styles.title, isSelected && { color: colors.W1 }]}>
          {item}
        </Text>
      </Row.C>
    </CButton>
  );
};

export default SlippageToleranceItem;

const styles = StyleSheet.create({
  container: {
    height: scale(46),
    minWidth: scale(63),
    borderRadius: scale(20),
    backgroundColor: colors.B2,
    marginRight: scale(8),
    marginBottom: scale(8),
  },
  title: {
    ...textStyles.Body1,
  },
});
