import React from 'react';
import { Text, StyleSheet } from 'react-native';

import _ from 'lodash';

import { colors, textStyles } from 'assets';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { STATUS_MAPPING } from 'screens/home/HistoriesScreen';
import { toFormattedDate } from 'utils/date';

interface Props {
  onPress: (deploy: any) => void;
  value: any;
}

const TransactionItem = ({ onPress, value }: Props) => {
  const mappingStatus = STATUS_MAPPING.find((i) => i.value === value.status);
  const StatusIcon = value.icon;
  return (
    <CButton onPress={() => onPress(value)}>
      <Row px={16} py={10} style={styles.container}>
        <StatusIcon width={scale(24)} height={scale(24)} />
        <Row.LR pl={16} style={{ flex: 1 }}>
          <Col.TL>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
              {value.deployHash ?? ''}
            </Text>
            <Text
              style={[
                textStyles.Body2,
                {
                  color: colors.c828489,
                  marginTop: scale(4),
                },
              ]}
            >
              {value.timestamp ? toFormattedDate(value.timestamp) : ''}
            </Text>
          </Col.TL>
          <Col.TR>
            <Text style={textStyles.Sub1}>{`${value.amount} ${value.symbol}`}</Text>
            <Text
              style={[
                textStyles.Body2,
                {
                  color: mappingStatus ? mappingStatus.color : colors.N2,
                  marginTop: scale(4),
                },
              ]}
            >
              {mappingStatus ? mappingStatus.label : _.capitalize(value.status ?? '')}
            </Text>
          </Col.TR>
        </Row.LR>
      </Row>
    </CButton>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    alignItems: 'center',
  },
  title: {
    ...textStyles.Sub1,
    width: scale(130),
  },
});
