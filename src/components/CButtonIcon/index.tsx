import React, { ReactNode } from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { CButton, Col } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';

interface Props {
  title?: string;
  icon: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const CButtonIcon = ({ icon, title, onPress, style }: Props) => {
  return (
    <Col mx={16} mb={16} style={styles.container}>
      <CButton style={[styles.button, style]} onPress={onPress}>
        {icon}
      </CButton>
      {title && <Text style={styles.title}>{title}</Text>}
    </Col>
  );
};

export default CButtonIcon;

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
