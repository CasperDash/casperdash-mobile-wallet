import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CButton, CHeader, CInput, CInputFormik, CLayout, Col, Row} from 'components';
import {colors, textStyles, IconArrowDown} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const max = 1000;
const min = 2.5;

const isValidKey = (text: any) => {
    return text === '123';
};

const initialValues = {
    transferAmount: 0,
    receivingAddress: '',
    transferID: '',
};

function SendScreen() {
    const {bottom} = useSafeAreaInsets();
    const validationSchema = yup.object().shape({
        transferAmount: yup
            .number()
            .max(max, 'Not enough balance.')
            .min(min, `Amount must be at least ${min} CSPR`)
            .required('Required.'),
        receivingAddress: yup.string().required('Required.').test('isValidPublicKey', 'Invalid address.', function(value: any) {
            return isValidKey(value);
        }),
        transferID: yup.string(),
    });

    const {
        handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue} =
        useFormik({
            initialValues,
            validationSchema,
            onSubmit: () => onConfirm(),
        });

    const {navigate} = useNavigation();

    const [selectedTokenAddress, setSelectedTokenAddress] = useState('CSPR');
    // const selectedToken = useSelector(getTokenInfoByAddress({ address: selectedTokenAddress }));
    const networkFee = '0.1 CSPR';

    const onConfirm = () => {
        navigate(AuthenticationRouter.CONFIRM_SEND_SCREEN, {assets: 'assets ne', ...values, networkFee: networkFee});
    };

    const setBalance = () => {
        // const balance = (selectedToken && selectedToken.balance && selectedToken.balance.displayValue) || 0;
        // const amount = balance / percent - (selectedToken.address === 'CSPR' ? selectedToken.transferFee : 0);
        setFieldValue('transferAmount', max);
    };

    const _renderBtnMax = () => {
        return (
            <CButton
                onPress={setBalance}
                style={{marginRight: scale(16)}}>
                <View style={styles.btnMax}>
                    <Text style={textStyles.Body2}>Max</Text>
                </View>
            </CButton>
        );
    };

    return (
        <CLayout
            edges={['right', 'top', 'left']}
            bgColor={'#f8f8f8'}>
            <CHeader title={'Send'} style={{backgroundColor: '#f8f8f8'}}/>
            <Col mt={16} style={styles.container}>
                <KeyboardAwareScrollView
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Text style={styles.title}>Asset</Text>
                    <CButton>
                        <Row.LR px={16} style={styles.rowPicker}>
                            <Text style={textStyles.Body1}>{selectedTokenAddress}</Text>
                            <Row.C>
                                <Text style={textStyles.Sub1}>6.7394</Text>
                                <View style={styles.verticalLine}/>
                                <IconArrowDown width={scale(10)} height={scale(6)}/>
                            </Row.C>
                        </Row.LR>
                    </CButton>
                    <Text style={styles.title}>Transfer Amount</Text>
                    <CInputFormik
                        name={'transferAmount'}
                        inputStyle={styles.inputStyle}
                        rightComponent={_renderBtnMax()}
                        keyboardType={'numeric'}
                        {...{values, errors, touched, handleBlur, handleChange}}
                        containerStyle={styles.rowPicker}/>
                    <Text style={styles.title}>Receiving Address</Text>
                    <CInputFormik
                        name={'receivingAddress'}
                        inputStyle={styles.inputStyle}
                        placeholder={'Enter receiving address'}
                        {...{values, errors, touched, handleBlur, handleChange}}
                        containerStyle={styles.rowPicker}/>
                    <Text style={styles.title}>Transfer ID (optional)</Text>
                    <CInputFormik
                        name={'transferID'}
                        inputStyle={styles.inputStyle}
                        placeholder={'Enter note'}
                        {...{values, errors, touched, handleBlur, handleChange}}
                        containerStyle={styles.rowPicker}/>
                    <Text style={[styles.title, {marginBottom: scale(8)}]}>Network Fee</Text>
                    <Text style={[styles.title, {marginTop: 0, marginBottom: scale(40)}, textStyles.Body1]}>{networkFee}</Text>
                </KeyboardAwareScrollView>
                <CTextButton
                    style={[styles.btnConfirm, {marginBottom: bottom + scale(10)}]}
                    onPress={handleSubmit}
                    text={'Confirm'}/>
            </Col>
        </CLayout>
    );
}

export default SendScreen;

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
    title: {
        ...textStyles.Sub1,
        color: colors.N3,
        marginTop: scale(24),
        marginBottom: scale(16),
    },
    rowPicker: {
        width: scale(343),
        height: scale(48),
        backgroundColor: colors.N5,
        borderRadius: scale(16),
        borderWidth: 0,
    },
    verticalLine: {
        width: scale(1),
        marginHorizontal: scale(8),
        height: scale(30),
        backgroundColor: colors.N4,
    },
    inputStyle: {
        ...textStyles.Sub1,
    },
    btnMax: {
        height: scale(28),
        width: scale(61),
        borderRadius: scale(14),
        backgroundColor: colors.R2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnConfirm: {
        alignSelf: 'center',
        marginTop: scale(20),
    },
});
