import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import { useTokenInfoByPublicKey } from 'utils/hooks/useTokenInfo';
import { useSelector } from 'react-redux';
import { getPublicKey } from 'utils/selectors';
import { CButton, CHeader, CLayout, Col, Row } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import TransactionItem from 'screens/home/HistoriesScreen/components/TransactionItem';
import NoDataComponent from 'screens/home/HistoriesScreen/components/NoDataComponent';
import { useNavigation } from '@react-navigation/native';
import { useDeploysWithStatus } from 'utils/hooks/useTransferDeploys';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TokenInfoComponent from 'screens/home/HistoriesScreen/components/TokenInfoComponent';
import { enrichTransactionWithIcon } from 'utils/helpers/transaction';

export const STATUS_MAPPING = [
  { value: '', label: 'All', color: colors.N2 },
  { value: 'pending', label: 'Pending', color: colors.Y1 },
  { value: 'failed', label: 'Failed', color: colors.R1 },
  { value: 'completed', label: 'Completed', color: colors.G1 },
];

// @ts-ignore
const HistoriesScreen: React.FC<ScreenProps<MainRouter.HISTORIES_SCREEN>> = ({ route }) => {
  const { token } = route.params;
  const { navigate } = useNavigation();
  const insets = useSafeAreaInsets();

  const { symbol } = token;
  const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);

  // Selector
  const publicKey = useSelector(getPublicKey);
  const transferList = useDeploysWithStatus({
    symbol: symbol,
    publicKey,
    status: selectedStatus,
  });
  const { getTokenInfoByAddress } = useTokenInfoByPublicKey(publicKey);
  const tokenInfo = getTokenInfoByAddress(token.address);

  // Function
  const onTransactionClick = (deploy: any) => {
    navigate(MainRouter.TRANSFER_HISTORY_SCREEN, { deploy });
  };

  const renderItem = ({ item }: { item: any }) => {
    return <TransactionItem onPress={onTransactionClick} value={item} />;
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} statusBgColor={colors.cF8F8F8}>
      <CHeader title={symbol} style={{ backgroundColor: colors.cF8F8F8 }} />
      <TokenInfoComponent tokenInfo={tokenInfo} />
      <Col style={styles.container}>
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
        <FlatList
          contentContainerStyle={{ paddingBottom: insets.bottom + scale(20) }}
          data={enrichTransactionWithIcon(transferList)}
          extraData={enrichTransactionWithIcon(transferList)}
          ListEmptyComponent={<NoDataComponent />}
          renderItem={renderItem}
        />
      </Col>
    </CLayout>
  );
};

export default HistoriesScreen;

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
});
