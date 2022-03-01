import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {ScreenProps} from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import {useSelector} from 'react-redux';
import {getPublicKey} from 'utils/selectors';
import {CButton, CHeader, CLayout, Col, Row} from 'components';
import {colors, images, textStyles} from 'assets';
import {scale} from 'device';
import TransactionItem from 'screens/home/HistoriesScreen/components/TransactionItem';
import NoDataComponent from 'screens/home/HistoriesScreen/components/NoDataComponent';
import {useNavigation} from '@react-navigation/native';

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
    console.log('token', token);
    const {symbol} = token;
    const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);

    // Selector
    /*const publicKey = useSelector(getPublicKey);
    const transferList = useDeploysWithStatus({symbol: symbol, publicKey, status: selectedStatus});
*/
    // Function
    const onTransactionClick = (deploy: any) => {
        navigate(MainRouter.TRANSFER_HISTORY_SCREEN, {deploy});
    };

    return (
        <CLayout bgColor={colors.cF8F8F8}
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
