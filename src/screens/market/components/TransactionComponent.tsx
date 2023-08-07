import React, { useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { colors, textStyles } from 'assets';
import { CButton, Col, Row } from 'components';
import { scale } from 'device';
import MainRouter from 'navigation/stack/MainRouter';
import { STATUS_MAPPING } from 'screens/home/HistoriesScreen';
import NoDataComponent from 'screens/home/HistoriesScreen/components/NoDataComponent';
import TransactionItem from 'screens/home/HistoriesScreen/components/TransactionItem';
import { enrichTransactionWithIcon } from 'utils/helpers/transaction';
import { useDeploysWithStatus } from 'utils/hooks/useTransferDeploys';
import { getPublicKey } from 'utils/selectors';

const TransactionComponent = () => {
  const { navigate } = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);

  // Selector
  const publicKey = useSelector(getPublicKey);
  const transferList = useDeploysWithStatus({
    symbol: 'CSPR',
    publicKey,
    status: selectedStatus,
  });

  const onTransactionClick = (deploy: any) => {
    navigate(MainRouter.TRANSFER_HISTORY_SCREEN, { deploy });
  };

  return (
    <Col style={{ backgroundColor: colors.cF8F8F8 }}>
      <Text style={styles.title}>Transaction</Text>
      <Col mt={16} style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : scale(20) }]}>
        <Row px={6} pt={24} pb={12}>
          <ScrollView alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} horizontal>
            <Row px={10}>
              {STATUS_MAPPING.map((status, i) => {
                return (
                  <CButton
                    onPress={() => setSelectedStatus(status.value)}
                    key={i}
                    style={[styles.btnStatus, selectedStatus === status.value && styles.selectedStatus]}
                  >
                    <Text style={textStyles.Body1}>{status.label}</Text>
                  </CButton>
                );
              })}
            </Row>
          </ScrollView>
        </Row>
        {transferList && transferList.length > 0 ? (
          enrichTransactionWithIcon(transferList).map((item: any, index: number) => {
            return <TransactionItem key={index} onPress={onTransactionClick} value={item} />;
          })
        ) : (
          <NoDataComponent />
        )}
      </Col>
    </Col>
  );
};

export default TransactionComponent;

const styles = StyleSheet.create({
  btnStatus: {
    height: scale(44),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(18),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
  },
  selectedStatus: {
    backgroundColor: colors.R2,
  },
  container: {
    width: scale(375),
    flex: 1,
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginLeft: scale(16),
    marginTop: scale(24),
  },
});
