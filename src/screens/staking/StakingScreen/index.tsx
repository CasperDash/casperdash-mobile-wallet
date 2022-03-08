import React, { useEffect } from 'react';
import { colors, fonts, IconArrowDown, IconLogo, textStyles } from 'assets';
import { Row, CInputFormik, CLayout, Col, CButton } from 'components';
import { scale } from 'device';
import { useFormik } from 'formik';
import MainRouter from 'navigation/stack/MainRouter';
import { View, Text, StyleSheet } from 'react-native';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTextButton from 'components/CTextButton';
import { useDispatch, useSelector } from 'react-redux';
import { getMassagedUserDetails, getPublicKey } from 'utils/selectors';
import { useNavigation } from '@react-navigation/native';
import { getConfigKey } from 'utils/selectors/configurations';
import { toFormattedNumber } from 'utils/helpers/format';
import StakedInformationItem from './StakedInformationItem';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { ScreenProps } from 'navigation/ScreenProps';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';

const initialValues = {
  amount: '0',
  validator: '',
};

// @ts-ignore
const StakingScreen: React.FC<ScreenProps<StakingRouter.STAKING_SCREEN>> = ({
  route,
}) => {
  const { selectedValidator } = route?.params || {};
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  // Selector
  const publicKey = useSelector(getPublicKey);
  const userDetails = useSelector(getMassagedUserDetails);
  const balance =
    userDetails && userDetails.balance && userDetails.balance.displayBalance;
  const fee = useSelector(getConfigKey('CSPR_AUCTION_DELEGATE_FEE'));

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .required('Amount must be more than 0 CSPR')
      .test('max', 'Not enough balance.', function (value: any) {
        return value + fee <= balance;
      })
      .test('min', 'Amount must be more than 0 CSPR', function (value: any) {
        return value > 0;
      }),
    validator: yup.string().required('Validator is required'),
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

  useEffect(() => {
    setFieldValue(
      'validator',
      selectedValidator && selectedValidator.public_key,
    );
  }, [selectedValidator]);

  useEffect(() => {
    dispatch(
      allActions.staking.getValidatorsInformation(
        { refreshing: false },
        (error: any, _: any) => {
          if (error) {
            dispatch(
              allActions.main.showMessage({
                message: error.message,
                type: MessageType.error,
              }),
            );
          }
        },
      ),
    );
  }, [dispatch]);

  const setBalance = () => {
    setFieldValue('amount', balance - fee);
    setErrors({ ...errors, amount: '' });
  };

  const selectValidator = () => {
    navigate(MainRouter.VALIDATOR_SCREEN);
  };

  const onConfirm = () => {};

  const _renderBtnMax = () => {
    return (
      <CButton onPress={setBalance} style={{ marginRight: scale(16) }}>
        <View style={styles.btnMax}>
          <Text style={textStyles.Body2}>Max</Text>
        </View>
      </CButton>
    );
  };

  return (
    <CLayout statusBgColor={colors.cF8F8F8} bgColor={colors.cF8F8F8}>
      <Row pl={24} pr={16} pt={10} pb={24} style={styles.alignCenter}>
        <IconLogo width={scale(28)} height={scale(28)} />
        <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>Staking</Text>
      </Row>
      <Col style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: scale(24) }}
          contentContainerStyle={styles.contentContainerStyle}>
          <Row.LR mb={16}>
            <Text style={styles.title}>Validator</Text>
            <Text style={textStyles.Body1}>Network Fee: {fee} CSPR</Text>
          </Row.LR>
          <CButton onPress={selectValidator}>
            <View style={styles.selectValidator}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'middle'}
                style={[
                  styles.nameValidator,
                  !!values.validator && { color: colors.N2 },
                ]}>
                {values.validator ? values.validator : 'Select Validator'}
              </Text>
              <IconArrowDown />
            </View>
          </CButton>
          {errors.validator && touched.validator && (
            <Text style={styles.error}>{errors.validator}</Text>
          )}
          <Row.LR mt={24} mb={16}>
            <Text style={styles.title}>Amount</Text>
            <Text style={textStyles.Body1}>
              Balance: {toFormattedNumber(balance)}
            </Text>
          </Row.LR>
          <CInputFormik
            name={'amount'}
            inputStyle={styles.inputStyle}
            rightComponent={_renderBtnMax()}
            keyboardType={'numeric'}
            {...{ values, errors, touched, handleBlur, handleChange }}
            containerStyle={styles.rowPicker}
          />
          <CTextButton
            onPress={handleSubmit}
            text={'Stake Now'}
            style={styles.btnStaking}
          />
          <View style={styles.line} />
          <Text
            style={[
              styles.title,
              { marginTop: scale(24), marginBottom: scale(15) },
            ]}>
            Staked Information
          </Text>
          <StakedInformationItem value={{}} />
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
};

export default StakingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(70),
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
  },
  inputStyle: {
    ...textStyles.Body1,
  },
  rowPicker: {
    width: scale(343),
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
    borderRadius: scale(16),
    borderWidth: 0,
  },
  selectValidator: {
    height: scale(48),
    backgroundColor: colors.N5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(9),
    borderRadius: scale(16),
  },
  nameValidator: {
    ...textStyles.Body1,
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
    width: scale(280),
  },
  alignCenter: {
    alignItems: 'center',
  },
  btnStaking: {
    marginTop: scale(40),
    marginBottom: scale(32),
  },
  line: {
    width: '100%',
    height: scale(2),
    backgroundColor: colors.N5,
  },
  error: {
    color: colors.R3,
    fontSize: scale(12),
    marginTop: scale(12),
    fontWeight: '400',
    fontFamily: fonts.Poppins.regular,
  },
});
