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
import {useDispatch, useSelector} from 'react-redux';
import {getPublicKey} from 'utils/selectors/user';
import {getTransferDeploy} from 'utils/services/userServices';
import {getTransferTokenDeploy} from 'utils/services/tokenServices';
import {useConfirmDeploy} from 'utils/hooks/useConfirmDeploy';
import {allActions} from 'redux_manager';
import {MessageType} from 'components/CMessge/types';

// @ts-ignore
const ConfirmSendScreen: React.FC<ScreenProps<MainRouter.CONFIRM_SEND_SCREEN>> = ({route}) => {

    const publicKey = useSelector(getPublicKey);
    const {bottom} = useSafeAreaInsets();
    const dispatch = useDispatch();

    const {
        token,
        selectedToken,
        transferAmount: amount,
        receivingAddress: toAddress,
        transferID,
        networkFee: fee,
    } = route.params;

    const price = (selectedToken && selectedToken.price) || 0;
    const symbol = selectedToken && selectedToken.symbol ? selectedToken.symbol : '';

    const {executeDeploy, isDeploying} = useConfirmDeploy();

    const buildTransferDeploy = (transferDetails: any) => {
        return token.address === 'CSPR'
            ? getTransferDeploy({
                ...transferDetails,
                transferID,
            })
            : getTransferTokenDeploy({
                ...transferDetails,
                contractInfo: {address: token.address, decimals: token.decimals},
            });
    };

    const showMessage = (message: string, type?: string) => {
        const messages = {
            message: message,
            type: type ?? MessageType.normal,
        };
        dispatch(allActions.main.showMessage(messages, 2000));
    };

    const onSendTransaction = async () => {
        try {
            if (isDeploying) {
                return;
            }
            const transferDetails = {
                fromAddress: publicKey,
                toAddress,
                amount,
                fee,
            };

            const buildDeployFn = () => buildTransferDeploy(transferDetails);
            const {deployHash, signedDeploy} = await executeDeploy(
                buildDeployFn,
                transferDetails.fromAddress,
                transferDetails.toAddress,
                showMessage
            );

            if (deployHash) {
                dispatch(
                    allActions.home.pushTransferToLocalStorage(publicKey, {
                        ...transferDetails,
                        deployHash: deployHash,
                        status: 'pending',
                        timestamp: signedDeploy.deploy.header.timestamp,
                        transferId: transferID,
                        address: token.address,
                        decimals: token.decimals,
                        symbol,
                    }),
                );
            }
        } catch (error: any) {
            showMessage(error && error.message || 'Transaction Failed', MessageType.error);
        }
    };

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
                        <Text style={styles.value}>{`${fee} CSPR`}</Text>
                        <Text style={styles.caption}>Receiving Address</Text>
                        <Text style={styles.value}>{toAddress}</Text>
                        <Text style={styles.caption}>Transfer ID</Text>
                        <Text style={styles.value}>{transferID}</Text>
                    </Col>
                </ScrollView>
                <CTextButton
                    onPress={onSendTransaction}
                    style={[styles.btnSend, {marginBottom: bottom + scale(10)}]}
                    text={isDeploying ? 'Sending' : 'Send'}/>
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
