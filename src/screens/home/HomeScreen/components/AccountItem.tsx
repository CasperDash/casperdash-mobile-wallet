import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';

const AccountItem = ({ data, isCurrentAccount }: any) => {
  return (
    <CButton>
      <Row.LR my={10} style={styles.container}>
        <Text style={[styles.sub, isCurrentAccount && { color: colors.B1 }]}>
          Account 1
        </Text>
        <Col style={styles.rightContent}>
          <Text style={[styles.body, isCurrentAccount && { color: colors.B1 }]}>
            0.45698 CSPR
          </Text>
        </Col>
      </Row.LR>
    </CButton>
  );
};

export default AccountItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: scale(14),
  },
  body: {
    ...textStyles.Body1,
  },
  sub: {
    ...textStyles.Sub1,
    textAlign: 'right',
  },
});
