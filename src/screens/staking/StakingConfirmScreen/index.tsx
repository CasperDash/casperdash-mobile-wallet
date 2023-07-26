import React, { useMemo, useState } from 'react';
import { colors, fonts, textStyles } from 'assets';
import { Row, CInputFormik, CLayout, Col, CButton, CHeader } from 'components';
import { scale } from 'device';
import { useFormik } from 'formik';
import MainRouter from 'navigation/stack/MainRouter';
import { View, Text, StyleSheet } from 'react-native';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTextButton from 'components/CTextButton';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicKey } from 'utils/selectors';
import { toDisplayValueFromMote } from 'utils/helpers/format';
import { ScreenProps } from 'navigation/ScreenProps';
import InfoComponent from 'screens/staking/InfoComponent';
import { ENTRY_POINT_DELEGATE, ENTRY_POINT_UNDELEGATE, StakingMode } from 'utils/constants/key';
import { useConfirmDeploy } from 'utils/hooks/useConfirmDeploy';
import { allActions } from 'redux_manager';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { useNavigation } from '@react-navigation/native';
import { getStakeDeploy } from 'utils/services/stakeServices';
import { MessageType } from 'components/CMessge/types';
import { useAccountInfo } from 'utils/hooks/useAccountInfo';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { toCSPR } from 'utils/helpers/currency';

const StakingConfirmScreen: React.FC<
  // @ts-ignore
  ScreenProps<MainRouter.STAKING_CONFIRM_SCREEN>
> = ({ route }) => {
  const { stakedAmount, validator, name, amount } = route?.params || {};

  const initialValues = {
    amount: '0',
    validator: validator,
  };
  const { data: configurations } = useConfigurations();
  const fee =
    (name === StakingMode.Delegate
      ? configurations?.CSPR_AUCTION_DELEGATE_FEE
      : configurations?.CSPR_AUCTION_UNDELEGATE_FEE) || 0;
  const publicKey = useSelector(getPublicKey)!;
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const isDelegate = useMemo(() => name === StakingMode.Delegate, [name]);
  const { massagedData: userDetails } = useAccountInfo(publicKey);
  const balance = userDetails?.balance?.displayBalance ?? 0;

  const [isForm, setIsForm] = useState<boolean>(name === StakingMode.Undelegate);

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .transform((_, value) => {
        if (value && value.includes('.')) {
          return parseFloat(value);
        }
        return +value.replace(/,/, '.');
      })
      .required('Amount must be more than 0 CSPR')
      .test(
        'max',
        `Sorry, you do not have sufficient funds in your active balance to perform the undelegation process. Please make sure you have at least ${fee} CSPR in your active balance before attempting to undelegate.`,
        function () {
          return balance >= fee;
        },
      )
      .test('min', 'Amount must be more than 0 CSPR', function (value: any) {
        return value > 0;
      }),
    validator: yup.string(),
  });

  const { handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setErrors } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => onConfirm(),
  });

  const { executeDeploy, isDeploying } = useConfirmDeploy();

  const setBalance = () => {
    setFieldValue('amount', isDelegate ? `${Math.floor(stakedAmount - fee).toFixed(2)}` : `${toCSPR(stakedAmount)}`);
    setErrors({ ...errors, amount: '' });
  };

  const showMessage = (message: string, type?: string) => {
    const messages = {
      message: message,
      type: type ?? MessageType.normal,
    };
    dispatch(allActions.main.showMessage(messages, type && type !== MessageType.normal ? 2000 : 30000));
  };

  const onConfirm = async () => {
    if (isForm) {
      setIsForm(false);
      return;
    }
    if (isDeploying) {
      return;
    }
    try {
      const entryPoint = name === StakingMode.Undelegate ? ENTRY_POINT_UNDELEGATE : ENTRY_POINT_DELEGATE;
      const amountDeploy = name === StakingMode.Undelegate ? Number(values.amount.replace(/,/, '.')) : amount;
      const buildDeployFn = () =>
        getStakeDeploy({
          fromAddress: publicKey,
          validator: validator,
          fee: fee,
          amount: amountDeploy,
          entryPoint,
        });
      const { deployHash, signedDeploy } = await executeDeploy(buildDeployFn, publicKey, showMessage);
      if (deployHash) {
        dispatch(
          allActions.staking.pushStakeToLocalStorage(publicKey, {
            amount: Number(amountDeploy),
            entryPoint,
            fee: fee,
            fromAddress: publicKey,
            validator: validator,
            deployHash: deployHash,
            status: 'pending',
            // @ts-ignore
            timestamp: signedDeploy?.deploy?.header.timestamp,
          }),
        );
        navigate('Staking', {
          screen: StakingRouter.STAKING_SCREEN,
          params: {
            selectedValidator: null,
          },
        });
      }
    } catch (e: any) {
      showMessage(e.message ?? `${name} failed`, MessageType.error);
    }
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

  const _renderForm = () => {
    return (
      <>
        <Row.LR mb={16}>
          <Text style={styles.title}>Validator</Text>
          <Text style={textStyles.Body1}>Network Fee: {fee} CSPR</Text>
        </Row.LR>
        <View style={styles.selectValidator}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={[styles.nameValidator, !!values.validator && { color: colors.N2 }]}
          >
            {values.validator ? values.validator : 'Select Validator'}
          </Text>
        </View>
        <Row.LR mt={24} mb={16}>
          <Text style={styles.title}>Amount</Text>
          <Text style={textStyles.Body1}>My staked: {toDisplayValueFromMote(stakedAmount)}</Text>
        </Row.LR>
        <CInputFormik
          name={'amount'}
          inputStyle={styles.inputStyle}
          rightComponent={_renderBtnMax()}
          keyboardType={'numeric'}
          {...{ values, errors, touched, handleBlur, handleChange }}
          containerStyle={styles.rowPicker}
        />
      </>
    );
  };

  return (
    <CLayout statusBgColor={colors.cF8F8F8} bgColor={colors.cF8F8F8}>
      <CHeader title={name} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: isForm ? scale(22) : 0 }}
          contentContainerStyle={styles.contentContainerStyle}
        >
          {isForm ? (
            _renderForm()
          ) : (
            <InfoComponent
              validator={validator}
              amount={name === StakingMode.Delegate ? amount : Number(values.amount)}
              fee={fee}
            />
          )}
          {name === StakingMode.Undelegate && (
            <Text style={styles.notes}>
              {configurations?.UNDELEGATE_TIME_NOTICE ||
                '* Please note that the waiting time for the undelegate process is approximately 7-8 eras, which translates to around 14-16 hours.'}
            </Text>
          )}
          <CTextButton
            onPress={isForm ? handleSubmit : onConfirm}
            text={name === StakingMode.Undelegate ? (isForm ? 'Confirm' : 'Undelegate') : 'Delegate'}
            style={[styles.btnStaking, { marginTop: isForm ? scale(40) : 0 }]}
          />
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
};

export default StakingConfirmScreen;

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
});
