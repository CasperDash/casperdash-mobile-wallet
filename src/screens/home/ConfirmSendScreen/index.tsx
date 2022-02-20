import React from 'react';
import {CLayout, Col, CHeader} from 'components';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {colors, textStyles} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenProps} from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import {toFormattedCurrency, toFormattedNumber} from 'utils/helpers/format';

// @ts-ignore
const ConfirmSendScreen: React.FC<ScreenProps<MainRouter.CONFIRM_SEND_SCREEN>> = ({route}) => {

    const {bottom} = useSafeAreaInsets();
    const {selectedToken, transferAmount: amount, receivingAddress, transferID, networkFee} = route.params;
    const price = (selectedToken && selectedToken.price) || 0;
    const symbol = selectedToken && selectedToken.symbol ? selectedToken.symbol : '';

    return (
        <CLayout
            edges={['right', 'top', 'left']}
            statusBgColor={colors.cF8F8F8}
            bgColor={colors.cF8F8F8}>
            <CHeader title={'Confirm'} style={{backgroundColor: colors.cF8F8F8}}/>
            <Col mt={16} style={styles.container}>
                <ScrollView
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Col pt={24}>
                        <Text style={styles.caption}>Asset</Text>
                        <Text style={styles.value}>{symbol}</Text>
                        <Text style={styles.caption}>Transfer Amount</Text>
                        <Text
                            style={styles.value}>{`${toFormattedNumber(amount, {maximumFractionDigits: 4}, 'en-US')} (${toFormattedCurrency(amount * price, {maximumFractionDigits: 2}, 'en-US')})`}</Text>
                        <Text style={styles.caption}>Network Fee</Text>
                        <Text style={styles.value}>{`${networkFee} CSPR`}</Text>
                        <Text style={styles.caption}>Receiving Address</Text>
                        <Text style={styles.value}>{receivingAddress}</Text>
                        <Text style={styles.caption}>Transfer ID</Text>
                        <Text style={styles.value}>{transferID}</Text>
                    </Col>
                </ScrollView>
                <CTextButton
                    style={[styles.btnSend, {marginBottom: bottom + scale(10)}]}
                    text={'Send'}/>
            </Col>
        </CLayout>
    );
};

export default ConfirmSendScreen;

const styles = StyleSheet.create({
    caption: {
        ...textStyles.Sub1,
        color: colors.N3,
    },
    value: {
        ...textStyles.Sub1,
        color: colors.N2,
        marginTop: scale(5),
        marginBottom: scale(16),
    },
    btnSend: {
        alignSelf: 'center',
    },
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
});
