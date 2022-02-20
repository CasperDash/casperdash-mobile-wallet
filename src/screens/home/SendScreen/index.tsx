import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CButton, CHeader, CInputFormik, CLayout, Col} from 'components';
import {colors, textStyles} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainRouter from 'navigation/stack/MainRouter';
import {useSelector} from 'react-redux';
import {getAllTokenInfo, getTokenInfoByAddress} from 'utils/selectors/user';
import {ScreenProps} from 'navigation/ScreenProps';
import SelectDropdown from 'react-native-select-dropdown';
import DropdownItem from 'screens/home/SendScreen/DropdownItem';
import SelectDropdownComponent from 'screens/home/SendScreen/SelectDropdownComponent';
import {StackNavigationProp} from '@react-navigation/stack';

const isValidKey = (text: any) => {
    return text === '123';
};

const initialValues = {
    transferAmount: '0',
    receivingAddress: '',
    transferID: '',
};

const percent = 1;

// @ts-ignore
const SendScreen: React.FC<ScreenProps<MainRouter.CONFIRM_PIN_SCREEN>> = ({route}) => {

    const {bottom} = useSafeAreaInsets();
    const {replace} = useNavigation<StackNavigationProp<any>>();
    const {token} = route.params;

    const [selectedTokenAddress, setSelectedTokenAddress] = useState(token ? token.address : 'CSPR');

    const allTokenInfo = useSelector(getAllTokenInfo);
    const selectedToken = useSelector(getTokenInfoByAddress({address: selectedTokenAddress}));

    const minAmount = (selectedToken && selectedToken.minAmount && selectedToken.minAmount) || 0;

    const validationSchema = yup.object().shape({
        transferAmount: yup
            .number()
            .min(minAmount, `Amount must be at least ${minAmount} ${selectedToken && selectedToken.symbol}`)
            .required(`Amount must be more than 0 ${selectedToken && selectedToken.symbol}`)
            .test('max', 'Not enough balance.', function (value: any) {
                const fee = (selectedToken && selectedToken.transferFee) || 0;
                const displayValue = (selectedToken && selectedToken.balance && selectedToken.balance.displayValue) || 0;
                return selectedTokenAddress === 'CSPR' ? value + fee <= displayValue : true;
            }),
        receivingAddress: yup
            .string()
            .required('Required.')
            .test('isValidPublicKey', 'Invalid address.', function (value: any) {
                return isValidKey(value); //TODO: change isValidKey to isValidPublicKey in helpers/validator.js
            }),
        transferID: yup.string(),
    });

    const {handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setErrors} =
        useFormik({
            initialValues,
            validationSchema,
            onSubmit: () => onConfirm(),
        });

    const onConfirm = () => {
        replace(MainRouter.CONFIRM_SEND_SCREEN, {
            ...values,
            selectedToken: selectedToken,
            networkFee: token ? token.transferFee : 1,
        });
    };

    const setBalance = () => {
        const balance = (selectedToken && selectedToken.balance && selectedToken.balance.displayValue) || 0;
        const maxAmount = balance / percent - (selectedToken.address === 'CSPR' ? selectedToken.transferFee : 0);
        setFieldValue('transferAmount', maxAmount);
    };

    const onSelectedToken = (item: any) => {
        setErrors({});
        setSelectedTokenAddress(item && item.address ? item.address : '');
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
            statusBgColor={colors.cF8F8F8}
            edges={['right', 'top', 'left']}
            bgColor={colors.cF8F8F8}>
            <CHeader title={'Send'} style={{backgroundColor: colors.cF8F8F8}}/>
            <Col mt={16} style={styles.container}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Text style={styles.title}>Asset</Text>
                    <SelectDropdown
                        dropdownStyle={[styles.rowPicker, styles.dropdownStyle]}
                        buttonStyle={styles.rowPicker}
                        dropdownOverlayColor={'rgba(0,0,0,0.1)'}
                        defaultValue={selectedToken}
                        renderCustomizedButtonChild={(item: any, index) => {
                            if (!item) {
                                return null;
                            }
                            return <SelectDropdownComponent item={item} key={index}/>;
                        }}
                        renderCustomizedRowChild={(item: any, index) => <DropdownItem item={item} key={index}/>}
                        data={allTokenInfo}
                        onSelect={onSelectedToken}
                        buttonTextAfterSelection={(item) => item}
                        rowTextForSelection={(item) => item}
                    />
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
                    <Text style={[styles.title, styles.networkFee]}>{`${token ? token.transferFee : 1} CSPR`}</Text>
                </KeyboardAwareScrollView>
                <CTextButton
                    style={[styles.btnConfirm, {marginBottom: bottom + scale(10)}]}
                    onPress={handleSubmit}
                    text={'Confirm'}/>
            </Col>
        </CLayout>
    );
};

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
        minHeight: scale(48),
        maxHeight: scale(100),
        backgroundColor: colors.N5,
        borderRadius: scale(16),
        borderWidth: 0,
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
    networkFee: {
        marginTop: 0,
        marginBottom: scale(40),
        ...textStyles.Body1,
    },
    dropdownStyle: {
        borderRadius: scale(10),
    },
});