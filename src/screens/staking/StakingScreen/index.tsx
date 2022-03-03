import { colors, IconArrowDown, textStyles } from 'assets';
import { CHeader, CInputFormik, CLayout, Col, CButton } from 'components';
import { scale } from 'device';
import { useFormik } from 'formik';
import MainRouter from 'navigation/stack/MainRouter';
import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getAllTokenInfo, getTokenInfoByAddress } from 'utils/selectors';
import { navigate } from 'navigation/RootNavigation';
import { useNavigation } from '@react-navigation/native';

const initialValues = {
  transferAmount: '0',
  receivingAddress: '',
  transferID: '',
};

interface Props {
  route: any;
  navigation: any;
}

function StakingScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const token = '';

  const [selectedTokenAddress, setSelectedTokenAddress] = useState(
    token ? token.address : 'CSPR',
  );

  const allTokenInfo = useSelector(getAllTokenInfo);
  const selectedToken = useSelector(
    getTokenInfoByAddress({ address: selectedTokenAddress }),
  );

  const setBalance = () => {
    const balance =
      (selectedToken &&
        selectedToken.balance &&
        selectedToken.balance.displayValue) ||
      0;
    const maxAmount =
      balance / percent -
      (selectedToken.address === 'CSPR' ? selectedToken.transferFee : 0);
    setFieldValue('transferAmount', maxAmount);
  };

  const minAmount =
    (selectedToken && selectedToken.minAmount && selectedToken.minAmount) || 0;

  const validationSchema = yup.object().shape({
    transferAmount: yup
      .number()
      .min(
        minAmount,
        `Amount must be at least ${minAmount} ${
          selectedToken && selectedToken.symbol
        }`,
      )
      .required(
        `Amount must be more than 0 ${selectedToken && selectedToken.symbol}`,
      )
      .test('max', 'Not enough balance.', function (value: any) {
        const fee = (selectedToken && selectedToken.transferFee) || 0;
        const displayValue =
          (selectedToken &&
            selectedToken.balance &&
            selectedToken.balance.displayValue) ||
          0;
        return selectedTokenAddress === 'CSPR'
          ? value + fee <= displayValue
          : true;
      }),
    receivingAddress: yup
      .string()
      .required('Required.')
      .test('isValidPublicKey', 'Invalid address.', function (value: any) {
        return isValidPublicKey(value);
      }),
    transferID: yup.string(),
  });
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => onConfirm(),
  });
  const onConfirm = () => {
    replace(MainRouter.CONFIRM_SEND_SCREEN, {
      ...values,
      transferAmount: parseFloat(values.transferAmount),
      selectedToken: selectedToken,
      networkFee: token ? token.transferFee : 1,
      token,
    });
  };
  const _renderBtnMax = () => {
    return (
      <CButton onPress={setBalance} style={{ marginRight: scale(16) }}>
        <View style={styles.btnMax}>
          <Text style={textStyles.Body2}>Max</Text>
        </View>
      </CButton>
    );
  };

  const _renderHeaderRight = () => {
    return (
      <View style={{ display: 'flex', flexDirection: 'row', width: scale(86) }}>
        <Text>APY</Text>
        <Text style={{ color: colors.G1, marginLeft: scale(20) }}>290%</Text>
      </View>
    );
  };
  return (
    <CLayout
      statusBgColor={colors.cF8F8F8}
      edges={['right', 'top', 'left']}
      bgColor={colors.cF8F8F8}>
      <CHeader
        style={styles.headerContainer}
        title={'Staking'}
        customTitleContainer={styles.titleContainer}
        showBack={false}
        titleStart={true}
        renderRight={_renderHeaderRight}
      />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Text style={styles.title}>Amount</Text>
          <CInputFormik
            name={'transferAmount'}
            inputStyle={styles.inputStyle}
            rightComponent={_renderBtnMax()}
            keyboardType={'numeric'}
            {...{ values, errors, touched, handleBlur, handleChange }}
            containerStyle={styles.rowPicker}
          />
          <Text style={styles.title}>Validator</Text>
          <TouchableOpacity
            onPress={() => navigate(MainRouter.VALIDATOR_SCREEN)}>
            <View style={styles.slectValidator}>
              <Text style={styles.nameValidator}>Select Validator</Text>
              <IconArrowDown />
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
}

export default StakingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.cFFFFFF,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  headerContainer: {
    backgroundColor: colors.N5,
    justifyContent: 'flex-start',
    paddingLeft: scale(24),
  },
  titleContainer: {
    flex: 0,
  },
  labelScreen: {
    fontWeight: '600',
    fontSize: scale(32),
    color: colors.N700,
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
  },
  btnMax: {
    height: scale(28),
    width: scale(61),
    borderRadius: scale(14),
    backgroundColor: colors.R2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginTop: scale(24),
    marginBottom: scale(16),
  },
  inputStyle: {
    ...textStyles.Sub1,
  },
  rowPicker: {
    width: scale(343),
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
    borderRadius: scale(16),
    borderWidth: 0,
  },
  flexHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: scale(24),
    marginRight: scale(16),
    marginTop: scale(20),
  },
  slectValidator: {
    backgroundColor: colors.N5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(9),
    borderRadius: scale(16),
  },
  nameValidator: {
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
  },
});
