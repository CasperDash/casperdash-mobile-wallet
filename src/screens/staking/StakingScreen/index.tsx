import React, { useEffect, useRef, useMemo } from 'react';
import {
  colors,
  fonts,
  IconArrowDown,
  IconLogo,
  images,
  textStyles,
} from 'assets';
import { Row, CInputFormik, CLayout, Col, CButton } from 'components';
import { scale } from 'device';
import { useFormik } from 'formik';
import MainRouter from 'navigation/stack/MainRouter';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as yup from 'yup';
import CTextButton from 'components/CTextButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkIfLoadingSelector,
  checkIfRefreshingSelector,
  getMassagedUserDetails,
  getPublicKey,
} from 'utils/selectors';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { getConfigKey } from 'utils/selectors/configurations';
import { toFormattedNumber } from 'utils/helpers/format';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { ScreenProps } from 'navigation/ScreenProps';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { types as stakingTypes } from 'redux_manager/staking/staking_action';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStakeFromValidators } from 'utils/hooks/useStakeDeploys';
import StakedInformationItem from 'screens/staking/StakingScreen/StakedInformationItem';

const initialValues = {
  amount: '0',
  validator: '',
};

// @ts-ignore
const StakingScreen: React.FC<ScreenProps<StakingRouter.STAKING_SCREEN>> = ({
  route,
}) => {
  const { selectedValidator } = route?.params || {};
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollViewRef = useRef<any>();
  useScrollToTop(scrollViewRef);

  // Selector
  const publicKey = useSelector(getPublicKey);
  const stackingList = useStakeFromValidators(publicKey);
  const userDetails = useSelector(getMassagedUserDetails);
  const balance =
    userDetails && userDetails.balance && userDetails.balance.displayBalance;
  const fee = useSelector(getConfigKey('CSPR_AUCTION_DELEGATE_FEE'));
  const minCSPRDelegateToNewValidator = useSelector(
    getConfigKey('MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR'),
  );
  const maxDelegatorPerValidator = useSelector(
    getConfigKey('MAX_DELEGATOR_PER_VALIDATOR'),
  );

  const hasDelegated = useMemo(() => {
    return selectedValidator?.bidInfo?.bid?.delegators?.find(
      (delegator: any) => delegator.public_key === publicKey,
    );
  }, [publicKey, selectedValidator]);

  const isLoading = useSelector((state: any) =>
    // @ts-ignore
    checkIfLoadingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

  const isRefreshing = useSelector((state: any) =>
    // @ts-ignore
    checkIfRefreshingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

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
      .test('max', 'Not enough balance.', function (value: any) {
        return value + fee <= balance;
      })
      .test('min', 'Amount must be more than 2.5 CSPR', function (value: any) {
        return value > 2.5;
      })
      .test(
        'minByNewValidator',
        `Amount must be more than or equal ${minCSPRDelegateToNewValidator} CSPR`,
        function (value: any) {
          return hasDelegated || value >= minCSPRDelegateToNewValidator;
        },
      ),
    validator: yup
      .string()
      .required('Validator is required')
      .test('maxDelegator', 'Max delegators', () => {
        return (
          hasDelegated ||
          selectedValidator?.bidInfo.bid?.delegators?.length <=
            maxDelegatorPerValidator
        );
      }),
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
    setTouched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => onConfirm(),
  });

  useEffect(() => {
    if (selectedValidator) {
      setFieldValue(
        'validator',
        selectedValidator && selectedValidator.public_key,
      );
      setFieldValue('amount', '0');
      setErrors({ ...errors, validator: '' });
      setTouched({ ...touched, validator: false });
    } else {
      resetForm();
    }
  }, [selectedValidator, setFieldValue]);

  useEffect(() => {
    getData(false);
  }, [dispatch, selectedValidator]);

  const getData = (refreshing: boolean) => {
    if (refreshing) {
      resetForm();
    }
    if (isLoading && !refreshing) {
      return;
    }
    dispatch(
      allActions.staking.getValidatorsInformation(
        { refreshing },
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
  };

  const setBalance = () => {
    setFieldValue('amount', `${balance - fee > 0 ? balance - fee : 0}`);
    setErrors({ ...errors, amount: '' });
  };

  const selectValidator = () => {
    navigation.navigate(MainRouter.VALIDATOR_SCREEN);
  };

  const onConfirm = () => {
    navigation.navigate(MainRouter.STAKING_CONFIRM_SCREEN, {
      name: 'Delegate',
      validator: values.validator,
      amount: values.amount.replace(/,/, '.'),
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

  const _renderNoData = () => {
    return (
      <View
        style={[styles.loadingContainer, { minHeight: scale(150) + bottom }]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.N2} />
        ) : (
          <>
            <Image source={images.nonft} style={styles.imgNoData} />
            <Text
              style={[
                {
                  ...textStyles.Body1,
                  color: colors.N4,
                },
              ]}>
              No Data
            </Text>
          </>
        )}
      </View>
    );
  };

  const _renderHeader = () => {
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
                style={[
                  styles.nameValidator,
                  !!values.validator && { color: colors.N2 },
                ]}>
                {values.validator ? values.validator : 'Select Validator'}
              </Text>
              <IconArrowDown />
            </View>
          </CButton>
          {!!errors.validator && touched.validator && (
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
        </Col>
        <View style={styles.line} />
        <Text style={[styles.title, { margin: scale(16) }]}>
          Staked Information
        </Text>
      </>
    );
  };

  return (
    <CLayout statusBgColor={colors.cF8F8F8} bgColor={colors.cF8F8F8}>
      <Row pl={24} pr={16} pt={10} pb={22} style={styles.alignCenter}>
        <IconLogo width={scale(28)} height={scale(28)} />
        <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>Staking</Text>
      </Row>
      <Col style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: scale(22) }}
          contentContainerStyle={styles.contentContainerStyle}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => getData(true)}
            />
          }>
          {_renderHeader()}
          {stackingList && stackingList.length > 0
            ? stackingList.map((item, index) => {
                return <StakedInformationItem value={item} key={index} />;
              })
            : _renderNoData()}
        </ScrollView>
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
    paddingBottom: scale(100),
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
    width: scale(295),
  },
  alignCenter: {
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgNoData: {
    width: scale(180),
    height: scale(180),
    resizeMode: 'contain',
  },
});
