import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Row, Col, CButton } from 'components';
import { colors, IconStatusReceive, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { toFormattedNumber } from 'utils/helpers/format';
import MainRouter from 'navigation/stack/MainRouter';
import { useNavigation } from '@react-navigation/native';

interface Props {
  value: any;
}

function StakedInformationItem({ value }: Props) {
  const { navigate } = useNavigation();
  const StatusIcon = value.icon;

  const undelegate = () => {
    navigate(MainRouter.STAKING_CONFIRM_SCREEN, {
      name: 'Undelegate',
      validator: value.validator,
      stakedAmount: value.stakedAmount,
    });
  };

  return (
    <CButton>
      <Row py={16} style={styles.container}>
        <StatusIcon width={scale(24)} height={scale(24)} />
        <Row.LR pl={16} style={{ flex: 1 }}>
          <Col.TL>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode={'middle'}>
              {value.validator ?? ''}
            </Text>
            <CTextButton
              onPress={undelegate}
              text={'Undelegate'}
              type={'line'}
              textStyle={styles.textStyle}
              style={styles.btnUnDelegate}
            />
          </Col.TL>
          <Col.TR>
            <Text style={textStyles.Sub1}>{`${toFormattedNumber(
              value.stakedAmount,
            )} CSPR`}</Text>
            {value.pendingAmount !== null && value.pendingAmount !== undefined && (
              <Text
                style={[
                  textStyles.Body2,
                  {
                    marginTop: scale(4),
                  },
                ]}>
                {`${toFormattedNumber(value.pendingAmount)} CSPR`}
              </Text>
            )}
          </Col.TR>
        </Row.LR>
      </Row>
    </CButton>
  );
}

export default StakedInformationItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.N5,
  },
  title: {
    ...textStyles.Sub1,
    width: scale(130),
  },
  btnUnDelegate: {
    width: scale(125),
    height: scale(32),
    marginTop: scale(12),
  },
  textStyle: {
    ...textStyles.Body2,
  },
});
