import * as React from 'react';
import { Row, CInputFormik, Col, CButton } from 'components';
import { Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { colors, fonts, IconArrowDown, textStyles, IconHistory } from 'assets';
import { useNavigation } from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';
import { useFormik } from 'formik';
import { StakingMode } from 'utils/constants/key';
import * as yup from 'yup';
import { scale } from 'device';
import { toFormattedNumber } from 'utils/helpers/format';
import CTextButton from 'components/CTextButton';
import { EViews } from '../../utils';
import { useAccountInfo } from 'utils/hooks/useAccountInfo';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { IValidator } from 'utils/hooks/useValidators';
import { useStakedInfo } from 'utils/hooks/useStakeDeploys';

interface IStakingFormProps {
  isRefreshing: boolean;
  publicKey: string;
  selectedValidator?: IValidator;
  setView: React.Dispatch<React.SetStateAction<EViews>>;
  view: EViews;
}

const initialValues = {
  amount: '0',
  validator: '',
};

const StakingForm: React.FunctionComponent<IStakingFormProps> = ({
  isRefreshing,
  publicKey,
  selectedValidator,
  setView,
  view,
}) => {
  const navigation = useNavigation();

  const { massagedData: userDetails } = useAccountInfo(publicKey);
  const balance = userDetails?.balance?.displayBalance ?? 0;
  const { data: configurations } = useConfigurations();
  const fee = configurations?.CSPR_AUCTION_DELEGATE_FEE ?? 0;
  const minCSPRDelegateToNewValidator = configurations?.MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR || 0;

  const { data: stakedInfo } = useStakedInfo(publicKey);

  const hasDelegated = React.useMemo(() => {
    return !!stakedInfo?.find((item) => item.validatorPublicKey === selectedValidator?.validatorPublicKey);
  }, [stakedInfo, selectedValidator]);

  const selectValidator = () => {
    navigation.navigate(MainRouter.VALIDATOR_SCREEN);
  };

  const onConfirm = () => {
    navigation.navigate(MainRouter.STAKING_CONFIRM_SCREEN, {
      name: StakingMode.Delegate,
      validator: values.validator,
      amount: values.amount.replace(/,/, '.'),
    });
  };

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .transform((_, value) => {
        if (value && value.includes('.')) {
          return parseFloat(value);
        }
        return +value.replace(/,/, '.');
      })
      .required(
        'The entered amount is below the minimum required. Please input an amount greater than or equal to 2.5 CSPR',
      )
      .test(
        'max',
        'Insufficient balance to complete the transaction. Please add funds to your account and try again',
        function (value: any) {
          return value + fee <= balance;
        },
      )
      .test(
        'min',
        'The entered amount is below the minimum required. Please input an amount greater than or equal to 2.5 CSPR',
        function (value: any) {
          return value > 2.5;
        },
      )
      .test(
        'minByNewValidator',
        `Please note that the minimum amount for your first staking is ${minCSPRDelegateToNewValidator} CSPR or more. Please adjust your amount and try again.`,
        function (value: any) {
          return hasDelegated || value >= minCSPRDelegateToNewValidator;
        },
      ),
    validator: yup
      .string()
      .required('Please choose a validator')
      .test(
        'maxDelegator',
        'The node has reached the maximum delegator capacity and cannot accept new delegations at this time',
        () => {
          return hasDelegated || !selectedValidator?.isFullDelegator;
        },
      ),
  });

  const setBalance = () => {
    setFieldValue('amount', `${balance - fee > 0 ? (Math.floor((balance - fee) * 100) / 100).toFixed(2) : 0}`);
    setErrors({ ...errors, amount: '' });
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

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    setErrors,
    setTouched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => onConfirm(),
  });

  React.useEffect(() => {
    if (selectedValidator) {
      setFieldValue('validator', selectedValidator.validatorPublicKey);
      setFieldValue('amount', '0');
      setErrors({ ...errors, validator: '' });
      setTouched({ ...touched, validator: false });
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValidator, setFieldValue]);

  return (
    <>
      <Col px={16} pt={isRefreshing && Platform.OS === 'ios' ? 16 : 0}>
        <Row.LR mb={16}>
          <Text style={styles.title}>Validator</Text>
          <Text style={textStyles.Body1}>Network Fee: {fee} CSPR</Text>
        </Row.LR>
        <CButton onPress={selectValidator}>
          <View style={styles.selectValidator}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'middle'}
              style={[styles.nameValidator, !!values.validator && { color: colors.N2 }]}
            >
              {values.validator ? values.validator : 'Select Validator'}
            </Text>
            <IconArrowDown />
          </View>
        </CButton>
        {!!errors.validator && touched.validator && <Text style={styles.error}>{errors.validator}</Text>}
        <Row.LR mt={24} mb={16}>
          <Text style={styles.title}>Amount</Text>
          <Text style={textStyles.Body1}>Balance: {toFormattedNumber(balance)}</Text>
        </Row.LR>
        <CInputFormik
          name={'amount'}
          inputStyle={styles.inputStyle}
          rightComponent={_renderBtnMax()}
          keyboardType={'numeric'}
          {...{ values, errors, touched, handleBlur, handleChange }}
          containerStyle={styles.rowPicker}
        />
        <CTextButton onPress={handleSubmit} text={'Stake Now'} style={styles.btnStaking} />
      </Col>
      <View style={styles.line} />
      <View style={styles.infoHeader}>
        <TouchableOpacity onPress={() => setView(EViews.info)}>
          <Text
            style={[
              styles.title,
              {
                color: view === EViews.info ? colors.R3 : colors.N1,
              },
            ]}
          >
            Staked Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView(EViews.rewards)}>
          <Text
            style={[
              styles.title,
              {
                margin: scale(16),
                color: view === EViews.rewards ? colors.R3 : colors.N1,
              },
            ]}
          >
            Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView(EViews.history)}>
          <IconHistory fill={view === EViews.history ? colors.R3 : colors.N1} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default StakingForm;

const styles = StyleSheet.create({
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
    width: scale(295),
  },

  btnStaking: {
    marginTop: scale(22),
    marginBottom: scale(20),
  },
  line: {
    width: scale(375),
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
  infoHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(16),
  },
});
