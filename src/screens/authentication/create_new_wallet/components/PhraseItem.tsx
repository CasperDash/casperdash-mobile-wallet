import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Row } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';

interface PhraseItemProps {
  data: any;
}

const PhraseItem = ({ data }: PhraseItemProps) => {
  return (
    <Row mb={16} style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {data.id}
      </Text>
      <Text numberOfLines={1} style={styles.title2}>
        {data?.word}
      </Text>
    </Row>
  );
};

export default PhraseItem;

const styles = StyleSheet.create({
  container: {
    width: scale(150),
    paddingVertical: scale(2),
    alignItems: 'center',
  },
  title: {
    ...textStyles.Body1,
    color: colors.c828489,
    marginRight: scale(11),
    minWidth: 25,
  },
  title2: {
    ...textStyles.Body1,
    color: colors.N2,
    flex: 1,
  },
});
