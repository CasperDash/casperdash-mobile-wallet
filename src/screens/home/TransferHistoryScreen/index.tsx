import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, IconViewExplorer, textStyles } from 'assets';
import { CButton, CHeader, CLayout, Col, Row } from 'components';
import { scale } from 'device';
import { ScreenProps } from 'navigation/ScreenProps';
import { STATUS_MAPPING } from 'screens/home/HistoriesScreen';
import TransferDetailComponent from 'screens/home/TransferHistoryScreen/TransferDetailComponent';
import { Config } from 'utils';
import { useNavigateSimpleWebView } from 'utils/hooks/useNavigateSimpleWebView';

const DETAILS_MAPPING = [
  { label: 'Sending address', value: 'fromAddress', copy: true },
  { label: 'Receiving address', value: 'toAddress', copy: true },
  { label: 'Amount', value: 'amount', format: 'number' },
  { label: 'Network Fee', value: 'fee', format: 'number' },
  { label: 'Transaction Time', value: 'timestamp', format: 'date' },
  { label: 'Transaction Hash', value: 'deployHash', copy: true },
  { label: 'Transfer ID', value: 'transferId' },
];

const TransferHistoryScreen: React.FC<
  // @ts-ignore
  ScreenProps<MainRouter.TRANSFER_HISTORY_SCREEN>
> = ({ route }) => {
  const { navigateToWebView } = useNavigateSimpleWebView();

  const { deploy } = route.params;
  const { bottom } = useSafeAreaInsets();
  const mappingStatus = STATUS_MAPPING.find((i) => i.value === (deploy.status || true));
  const onViewExplorer = async () => {
    const url = Config.getViewExplorerURL('deploy', deploy.deployHash);

    navigateToWebView({
      url,
      title: 'View in explorer',
    });
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'Transaction details'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={16} style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: scale(24) }}
          contentContainerStyle={[styles.contentContainerStyle, { paddingBottom: bottom + scale(20) }]}
        >
          {DETAILS_MAPPING.map((detail, index) => {
            return <TransferDetailComponent data={detail} key={index} deploy={deploy} index={index} />;
          })}
          <Row.LR mt={16}>
            <Text style={[textStyles.Body2, { color: mappingStatus?.color || colors.N2 }]}>{mappingStatus?.label}</Text>
            <CButton onPress={onViewExplorer}>
              <Row>
                <Text style={[textStyles.Body2, { color: colors.R1, marginRight: scale(8) }]}>View in explorer</Text>
                <IconViewExplorer width={scale(20)} height={scale(20)} />
              </Row>
            </CButton>
          </Row.LR>
        </ScrollView>
      </Col>
    </CLayout>
  );
};

export default TransferHistoryScreen;

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    flex: 1,
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
  },
});
