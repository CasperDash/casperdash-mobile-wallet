import React from 'react';
import { Text, StyleSheet, TextInput } from 'react-native';

import { colors, textStyles } from 'assets';
import { Row } from 'components';
import { scale } from 'device';
import { Phrase } from 'screens/authentication/data/data';

interface PhraseInputItemProps {
  data: Phrase;
  onChangeText: (text: string) => void;
}

function PhraseInputItem({ data, onChangeText }: PhraseInputItemProps) {
  return (
    <Row mb={16} style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {data.id + 1}
      </Text>
      <TextInput value={data.word} onChangeText={onChangeText} style={styles.input} autoCapitalize="none" />
    </Row>
  );
}

export default PhraseInputItem;

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
  },
  input: {
    ...textStyles.Body1,
    flex: 1,
    color: colors.N2,
    borderBottomWidth: scale(1),
    borderBottomColor: colors.N5,
    paddingVertical: 0,
  },
});
