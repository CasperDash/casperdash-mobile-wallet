import React, { useEffect } from 'react';
import { colors, fonts, textStyles } from 'assets';
import { Row, CInputFormik, CLayout, Col, CButton, CHeader } from 'components';
import { scale } from 'device';
import { useFormik } from 'formik';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTextButton from 'components/CTextButton';
import { useDispatch, useSelector } from 'react-redux';
import { toDisplayValueFromMote } from 'utils/helpers/format';
import { ScreenProps } from 'navigation/ScreenProps';
import { useNavigation } from '@react-navigation/native';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { toCSPR } from 'utils/helpers/currency';
import SelectValidatorButton from 'screens/staking/components/SelectValidatorButton';
import MainRouter from 'navigation/stack/MainRouter';
import { getStakingForm } from 'utils/selectors/staking';
import { useYupUndelegateFormSchema } from 'screens/staking/hooks/useYupUndelegateFormSchema';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { allActions } from 'redux_manager';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { ENTRY_POINT_REDELEGATE, ENTRY_POINT_UNDELEGATE, StakingMode } from 'utils/constants/key';
import { STAKING_NOTE_MESSAGE } from 'utils/constants/staking';
import { useGetFeeByEntryPoint } from 'utils/hooks/useGetFeeByEntryPoint';

const UndelegateFormScreen: React.FC<ScreenProps<'UNDELEGATE_FORM_SCREEN'>> = ({ route }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation<any>();
  const { selectedValidator } = route?.params || {};
  const { validator: stakedValidator, stakedAmount } = useSelector(getStakingForm);
  const { data: configurations } = useConfigurations();

  const initialValues = {
    amount: '0',
    validator: stakedValidator.publicKey,
    validatorLogo: stakedValidator.logo,
    validatorName: stakedValidator.name,
    isRedelegate: false,
    stakedAmount: stakedAmount,
    newValidator: '',
  };

  const validationSchema = useYupUndelegateFormSchema({
    validatorPublicKey: selectedValidator?.validatorPublicKey,
    selectedValidator,
    stakedAmount: toCSPR(stakedAmount).toNumber(),
  });

  const { getFeeByEntryPoint } = useGetFeeByEntryPoint();

  const { handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setErrors } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => onConfirm(),
  });

  const setBalance = () => {
    setFieldValue('amount', `${toCSPR(stakedAmount)}`);
    setErrors({ ...errors, amount: '' });
  };

  const handleOnIsRedelegateChange = () => {
    setFieldValue('isRedelegate', !values.isRedelegate);
  };

  const handleOnSelectNewValidator = () => {
    navigate(MainRouter.VALIDATOR_SCREEN, {
      callbackScreen: StakingRouter.UNDELEGATE_FORM_SCREEN,
    });
  };

  const onConfirm = () => {
    const amount = Number(values.amount.replace(/,/, '.'));

    if (values.isRedelegate) {
      if (!selectedValidator) {
        return;
      }

      dispatch(
        allActions.staking.setStakingForm({
          name: StakingMode.Redelegate,
          amount,
          entryPoint: ENTRY_POINT_REDELEGATE,
          newValidator: {
            publicKey: selectedValidator.validatorPublicKey,
            logo: selectedValidator?.logo || getBase64IdentIcon(selectedValidator.validatorPublicKey),
            name: selectedValidator?.name || '',
            fee: selectedValidator.delegationRate,
          },
        }),
      );

      navigate(MainRouter.STAKING_CONFIRM_SCREEN);

      return;
    }

    dispatch(
      allActions.staking.setStakingForm({
        amount,
        name: StakingMode.Undelegate,
        entryPoint: ENTRY_POINT_UNDELEGATE,
      }),
    );

    navigate(MainRouter.STAKING_CONFIRM_SCREEN);
  };

  useEffect(() => {
    if (selectedValidator) {
      setFieldValue('newValidator', selectedValidator?.validatorPublicKey);
    }
  }, [selectedValidator, setFieldValue]);

  return (
    <CLayout statusBgColor={colors.cF8F8F8} bgColor={colors.cF8F8F8}>
      <CHeader title={values.isRedelegate ? 'Redelegate' : 'Undelegate'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Row.LR mb={16}>
            <Text style={styles.title}>Validator</Text>
            <Text style={textStyles.Body1}>
              Network Fee: {getFeeByEntryPoint(values.isRedelegate ? ENTRY_POINT_REDELEGATE : ENTRY_POINT_UNDELEGATE)}{' '}
              CSPR
            </Text>
          </Row.LR>
          <SelectValidatorButton
            logo={values.validatorLogo}
            name={values.validatorName}
            publicKey={values.validator}
            isShowArrow={false}
          />
          {configurations?.ENABLE_REDELEGATE && (
            <>
              <Row.LR mt={24}>
                <View style={styles.isRedelegateWrapper}>
                  <Switch value={values.isRedelegate} onValueChange={handleOnIsRedelegateChange} />
                  <Text style={styles.redelegateText}>Using redelegate</Text>
                </View>
              </Row.LR>
              {values.isRedelegate && (
                <View>
                  <Row.LR mt={24} mb={16}>
                    <Text style={styles.title}>New Validator</Text>
                  </Row.LR>
                  <SelectValidatorButton
                    name={selectedValidator?.name}
                    logo={selectedValidator?.logo}
                    publicKey={selectedValidator?.validatorPublicKey}
                    onPress={handleOnSelectNewValidator}
                  />
                  {errors && touched && errors.newValidator && touched.newValidator ? (
                    <Text style={styles.error}>{errors.newValidator}</Text>
                  ) : null}
                </View>
              )}
            </>
          )}
          <Row.LR mt={24} mb={16}>
            <Text style={styles.title}>Amount</Text>
            <Text style={textStyles.Body1}>My staked: {toDisplayValueFromMote(stakedAmount)}</Text>
          </Row.LR>
          <CInputFormik
            name={'amount'}
            inputStyle={styles.inputStyle}
            rightComponent={
              <CButton onPress={setBalance} style={{ marginRight: scale(16) }}>
                <View style={styles.btnMax}>
                  <Text style={textStyles.Body2}>Max</Text>
                </View>
              </CButton>
            }
            keyboardType={'numeric'}
            {...{ values, errors, touched, handleBlur, handleChange }}
            containerStyle={styles.rowPicker}
          />
          <Text style={styles.notes}>{configurations?.UNDELEGATE_TIME_NOTICE || STAKING_NOTE_MESSAGE}</Text>
          <CTextButton
            onPress={handleSubmit}
            text={values.isRedelegate ? 'Redelegate' : 'Undelegate'}
            style={[styles.btnStaking]}
          />
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
};

export default UndelegateFormScreen;

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
  },
  alignCenter: {
    alignItems: 'center',
  },
  btnStaking: {
    marginBottom: scale(20),
  },
  error: {
    color: colors.R3,
    fontSize: scale(12),
    marginTop: scale(12),
    fontWeight: '400',
    fontFamily: fonts.Poppins.regular,
  },
  notes: {
    ...textStyles.Body2,
    color: colors.N3,
    marginTop: scale(16),
    marginBottom: scale(16),
  },
  isRedelegateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redelegateText: {
    ...textStyles.Sub1,
    color: colors.N3,
    fontSize: scale(16),
    marginLeft: scale(8),
  },
});
