import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { AccountAction } from 'screens/home/HomeScreen/data/data';
import { CButton, Col } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';

interface Props {
  data: AccountAction;
  onPress: (screen: string) => void;
}

const ButtonAction = ({ data, onPress }: Props) => {
  const { icon, title, screen } = data;

  const IconAction = icon;

  return (
    <Col mx={16} mb={16} style={styles.container}>
      <CButton style={styles.button} onPress={() => onPress(screen)}>
        <IconAction />
      </CButton>
      <Text style={styles.title}>{title}</Text>
    </Col>
  );
};

export default ButtonAction;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: colors.R2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...textStyles.Body2,
    color: colors.N3,
    marginTop: scale(12),
  },
});
