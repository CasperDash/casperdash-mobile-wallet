import {colors, IconArrowDown, IconLogo, textStyles} from 'assets';
import {Row, CInputFormik, CLayout, Col, CButton} from 'components';
import {scale} from 'device';
import {useFormik} from 'formik';
import MainRouter from 'navigation/stack/MainRouter';
import React, {useState, useRef, useContext} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import * as yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CTextButton from 'components/CTextButton';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {getAllTokenInfo, getMassagedUserDetails, getPublicKey, getTokenInfoByAddress} from 'utils/selectors';
import {useNavigation} from '@react-navigation/native';
import {getConfigKey} from 'utils/selectors/configurations';
import {toFormattedNumber} from 'utils/helpers/format';
import StakedInfomationItem from "screens/staking/StakingScreen/StakedInfomationItem";

const initialValues = {
    amount: '0',
    validator: '',
};

function StakingScreen() {
    const insets = useSafeAreaInsets();
    const {navigate} = useNavigation();

    // Selector
    const publicKey = useSelector(getPublicKey);
    const userDetails = useSelector(getMassagedUserDetails);
    const balance = userDetails && userDetails.balance && userDetails.balance.displayBalance;

    const fee = useSelector(getConfigKey('CSPR_AUCTION_DELEGATE_FEE'));

    const setBalance = () => {
        setFieldValue('amount', balance - fee);
        setErrors({...errors, amount: ''});
    };

    const validationSchema = yup.object().shape({
        amount: yup
            .number()
            .required('Amount must be more than 0 CSPR',)
            .test('max', 'Not enough balance.', function (value: any) {
                return value + fee <= balance;
            }).test('min', 'Amount must be more than 0 CSPR', function (value: any) {
                return value > 0;
            }),
        validator: yup.string(),
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

    };

    const _renderBtnMax = () => {
        return (
            <CButton onPress={setBalance} style={{marginRight: scale(16)}}>
                <View style={styles.btnMax}>
                    <Text style={textStyles.Body2}>Max</Text>
                </View>
            </CButton>
        );
    };

    return (
        <CLayout
            statusBgColor={colors.cF8F8F8}
            bgColor={colors.cF8F8F8}>
            <Row pl={24} pr={16} pt={10} pb={24} style={styles.alignCenter}>
                <IconLogo width={scale(28)} height={scale(28)}/>
                <Text style={[textStyles.H3, {marginLeft: scale(16)}]}>Staking</Text>
            </Row>
            <Col style={styles.container}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={{marginTop: scale(24)}}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Row.LR mb={16}>
                        <Text style={styles.title}>Validator</Text>
                        <Text style={textStyles.Body1}>Network Fee: {fee} CSPR</Text>
                    </Row.LR>
                    <CButton
                        onPress={() => navigate(MainRouter.VALIDATOR_SCREEN)}>
                        <View style={styles.selectValidator}>
                            <Text style={styles.nameValidator}>Select Validator</Text>
                            <IconArrowDown/>
                        </View>
                    </CButton>
                    <Row.LR mt={24} mb={16}>
                        <Text style={styles.title}>Amount</Text>
                        <Text style={textStyles.Body1}>Balance: {toFormattedNumber(balance)}</Text>
                    </Row.LR>
                    <CInputFormik
                        name={'amount'}
                        inputStyle={styles.inputStyle}
                        rightComponent={_renderBtnMax()}
                        keyboardType={'numeric'}
                        {...{values, errors, touched, handleBlur, handleChange}}
                        containerStyle={styles.rowPicker}
                    />
                    <CTextButton
                        onPress={handleSubmit}
                        text={'Stake Now'}
                        style={styles.btnStaking}/>
                    <View style={styles.line}/>
                    <Text style={[styles.title, {marginTop: scale(24), marginBottom: scale(15)}]}>Staked Information</Text>
                    <StakedInfomationItem/>
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
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
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
        marginTop: scale(40),
        marginBottom: scale(32),
    },
    line: {
        width: '100%',
        height: scale(2),
        backgroundColor: colors.N5,
    }
});
