import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';
import { getValueByFormat } from 'utils/helpers/format';

function ValidatorItem({ data, onSelectValidator }: any) {
  return (
    <CButton onPress={() => onSelectValidator(data)}>
      <Row px={16} py={16} style={styles.container}>
        <Image source={{ uri: data.logo || data.icon }} style={styles.icon} />
        <Row.LR pl={12} style={styles.rightContainer}>
          <Col.L>
            <Text
              ellipsizeMode={'middle'}
              numberOfLines={1}
              style={[styles.title, { width: scale(130) }]}>
              {data.name ? `${data.name} ✅` : data.public_key}
            </Text>
            <Text
              ellipsizeMode={'middle'}
              numberOfLines={1}
              style={[textStyles.Body1, { width: scale(130) }]}>
              {data.public_key}
            </Text>
          </Col.L>
          <Col.R>
            <Text style={textStyles.Body1}>
              {getValueByFormat(data.bidInfo?.bid?.delegation_rate || 0, {
                format: 'percentage',
              })}{' '}
              Fee
            </Text>
            <Text style={styles.title}>
              {getValueByFormat(data.bidInfo?.bid?.staked_amount || 0, {
                format: 'mote',
              })}{' '}
              CSPR
            </Text>
          </Col.R>
        </Row.LR>
      </Row>
    </CButton>
  );
}

export default ValidatorItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: scale(32),
    height: scale(32),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N1,
  },
  rightContainer: {
    flex: 1,
  },
});
