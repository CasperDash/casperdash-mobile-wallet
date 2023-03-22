import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles, images } from 'assets';
import { getValueByFormat } from 'utils/helpers/format';

function ValidatorItem({ data, onSelectValidator }: any) {
  return (
    <CButton onPress={() => onSelectValidator(data)}>
      <Row px={16} py={16} style={styles.container}>
        <Col.L pr={1} style={styles.verifiedIconCol}>
          {data.priority && <Image style={styles.verifiedIcon} source={images.verifiedValidator} />}
        </Col.L>
        <Image source={{ uri: data.logo || data.icon }} style={styles.icon} />
        <Row.LR pl={4} style={styles.rightContainer}>
          <Col.L>
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={[styles.title, { width: scale(100) }]}>
              {data.name ? data.name : data.public_key}
            </Text>
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={[textStyles.Body1, { width: scale(100) }]}>
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
            <Text style={textStyles.Body1}>
              {getValueByFormat(data.weight || 0, {
                format: 'mote',
                maximumFractionDigits: 2,
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
    width: scale(42),
    height: scale(42),
  },
  verifiedIcon: {
    width: scale(25),
    height: scale(37),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N1,
  },
  rightContainer: {
    flex: 2,
  },
  verifiedIconCol: {
    minWidth: 25,
  },
});
