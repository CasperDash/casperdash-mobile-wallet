import React from 'react';
import { IconCircleClose, colors, fonts } from 'assets';
import { scale } from 'device';
import { Platform, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { VictoryLegend, VictoryPie } from 'victory-native';
import { toFormattedCurrency, toFormattedNumber } from 'utils/helpers/format';
import { usePrice } from 'utils/hooks/usePrice';
import { CButton, Col, Row } from 'components';

interface IProps {
  activeCSPRAmount?: number;
  stakedCSPRAmount?: number;
  undelegatingCSPRAmount?: number;
  totalFiatBalance?: number;
  showModal: boolean;
  onHideModal: () => void;
}

export const AccountDetailsChartModal = ({
  activeCSPRAmount = 0,
  stakedCSPRAmount = 0,
  undelegatingCSPRAmount = 0,
  totalFiatBalance = 0,
  showModal,
  onHideModal,
}: IProps) => {
  const { currentPrice } = usePrice();

  const activeCSPRFiat = activeCSPRAmount * currentPrice;
  const stakedCSPRFiat = stakedCSPRAmount * currentPrice;
  const undelegatingCSPRFiat = undelegatingCSPRAmount * currentPrice;
  const otherAmount = totalFiatBalance - activeCSPRFiat - stakedCSPRFiat - undelegatingCSPRFiat;

  return (
    <Modal
      style={styles.container}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={onHideModal}
      backdropColor={'rgba(252, 252, 253,0.4)'}
      isVisible={showModal}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <Col style={styles.body}>
        <Row.R>
          <CButton onPress={onHideModal}>
            <IconCircleClose width={scale(24)} height={scale(24)} />
          </CButton>
        </Row.R>
        <Col>
          <VictoryPie
            style={{ parent: { alignSelf: 'center' } }}
            height={scale(200)}
            width={scale(200)}
            colorScale={['blue', 'orange', 'gold', 'cyan', 'navy']}
            innerRadius={100}
            data={[
              { x: 'Liquid', y: activeCSPRAmount },
              { x: 'Staked As Delegator', y: stakedCSPRAmount },
              { x: 'Undelegating', y: undelegatingCSPRAmount },
              { x: 'Others', y: otherAmount >= 0 ? otherAmount : 0 },
            ]}
            labels={() => ''}
          />
          <VictoryLegend
            style={{ labels: { fontFamily: fonts.Poppins.regular, fontSize: scale(11) } }}
            height={scale(100)}
            data={[
              {
                name: `Liquid: ${toFormattedNumber(activeCSPRAmount)} CSPR ~${toFormattedCurrency(activeCSPRFiat)}`,
                symbol: { fill: 'blue' },
              },
              {
                name: `Staked As Delegator: ${toFormattedNumber(stakedCSPRAmount)} CSPR ~${toFormattedCurrency(
                  stakedCSPRFiat,
                )}`,
                symbol: { fill: 'orange' },
              },
              {
                name: `Undelegating: ${toFormattedNumber(undelegatingCSPRAmount)} CSPR ~${toFormattedCurrency(
                  undelegatingCSPRFiat,
                )}`,
                symbol: { fill: 'gold' },
              },
              { name: `Others: ~${toFormattedCurrency(otherAmount >= 0 ? otherAmount : 0)}`, symbol: { fill: 'cyan' } },
            ]}
          />
        </Col>
      </Col>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { margin: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  body: {
    width: '94%',
    minHeight: scale(223),
    backgroundColor: colors.W1,
    borderRadius: scale(16),
    padding: scale(16),

    shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: scale(16),
    shadowOpacity: 0.6,

    elevation: 10,
  },
});
