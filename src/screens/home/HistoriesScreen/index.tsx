import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {ScreenProps} from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import {useTokenInfo} from 'utils/hooks/useTokensInfo';
import {useDispatch, useSelector} from 'react-redux';
import {getDeploysTransfer} from 'utils/selectors/transfer';
import {getPublicKey} from 'utils/selectors';
import {CButton, CHeader, CLayout, Col, Row} from 'components';
import {colors, images, textStyles} from 'assets';
import {scale} from 'device';
import TransactionItem from 'screens/home/HistoriesScreen/components/TransactionItem';
import NoDataComponent from 'screens/home/HistoriesScreen/components/NoDataComponent';
import {useNavigation} from '@react-navigation/native';
import {allActions} from 'redux_manager';
import {useDeploysWithStatus} from 'utils/hooks/useTransferDeploys';

const STATUS_MAPPING = [
    {value: '', label: 'All'},
    {value: 'pending', label: 'Pending'},
    {value: 'failed', label: 'Failed'},
    {value: 'completed', label: 'Completed'},
];

// @ts-ignore
const HistoriesScreen: React.FC<ScreenProps<MainRouter.HISTORIES_SCREEN>> = ({route}) => {
    const {token} = route.params;
    const {navigate} = useNavigation();
    const {symbol} = token;
    const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);
    const dispatch = useDispatch();
    // Selector
    const publicKey = useSelector(getPublicKey);
    const transferList = useDeploysWithStatus({symbol: symbol, publicKey, status: selectedStatus});
    console.log('transferList', transferList);

    // Function
    const onTransactionClick = (deploy: any) => {
        // navigate(MainRouter.TRANSFER_HISTORY_SCREEN, {deploy});
        dispatch(
            allActions.home.pushTransferToLocalStorage('02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38', {
                address: 'CSPR',
                amount: 2.5,
                decimals: undefined,
                deployHash: '86a9a699af58aa37f591eb1c86a3e88ee9b097f61d7e43987ce59c0de51f38d4',
                fee: 0.1,
                fromAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
                status: 'pending',
                symbol: 'CSPR',
                timestamp: '2022-02-25T14:48:04.274Z',
                toAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
                transferId: '',
            }),
        );
    };

    return (
        <CLayout bgColor={colors.cF8F8F8}
                 edges={['right', 'top', 'left']}
                 statusBgColor={colors.cF8F8F8}>
            <CHeader title={symbol} style={{backgroundColor: colors.cF8F8F8}}/>
            <Col
                mt={10}
            >
                <ScrollView
                    alwaysBounceHorizontal={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal>
                    <Row px={16}>
                        {
                            STATUS_MAPPING.map((status, i) => {
                                return <CButton
                                    onPress={() => setSelectedStatus(status.value)}
                                    key={i}
                                    style={[styles.btnStatus, selectedStatus === status.value && styles.selectedStatus]}>
                                    <Text style={textStyles.Body1}>{status.label}</Text>
                                </CButton>;
                            })
                        }
                    </Row>
                </ScrollView>

                <TransactionItem onPress={onTransactionClick} value={{}}/>
                <NoDataComponent/>
            </Col>
        </CLayout>
    );
};

export default HistoriesScreen;

const styles = StyleSheet.create({
    btnStatus: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(18),
        paddingHorizontal: scale(16),
        paddingVertical: scale(8),
    },
    selectedStatus: {
        backgroundColor: colors.R2,
    },
});
