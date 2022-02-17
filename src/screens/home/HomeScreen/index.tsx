import React, {useEffect, useMemo, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import {
    colors,
    textStyles,
    IconScanCode,
    IconSetting,
    IconPlusCircle,
    IconLogo,
} from 'assets';
import {CButton, CLayout, Col, Row} from 'components';
import {scale} from 'device';
import {useNavigation} from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';
import {MessageType} from 'components/CMessge/types';
import {allActions} from 'redux_manager';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TokenComponent from 'screens/home/HomeScreen/components/TokenComponent';
import {getAllTokenInfo} from 'utils/selectors/user';
import Account from 'screens/home/HomeScreen/components/Account';
import {checkIfLoadingSelector} from 'utils/selectors';
import {types as homeTypes} from 'redux_manager/home/home_action';
import {types as userTypes} from 'redux_manager/user/user_action';

function HomeScreen() {

    const {navigate} = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const allTokenInfo = useSelector(getAllTokenInfo);

    // @ts-ignore
    const isLoading = useSelector((state: any) => checkIfLoadingSelector(state, [homeTypes.GET_TOKEN_INFO_WITH_BALANCE, homeTypes.FETCH_CSPR_MARKET_INFO, userTypes.GET_ACCOUNT_INFORMATION]));

    useEffect(() => {
        fetchCSPRMarketInfo();
        getTokenInfoWithBalance();
    }, []);

    const getTokenInfoWithBalance = () => {
        dispatch(allActions.home.getTokenInfoWithBalance((error: any) => {
            if (error) {
                showErrorMessage(error);
            }
        }));
    };

    const fetchCSPRMarketInfo = () => {
        dispatch(allActions.home.fetchCSPRMarketInfo((error: any) => {
            if (error) {
                showErrorMessage(error);
            }
        }));
    };

    const showErrorMessage = (error: any) => {
        const message = {
            message: error && error.message ? error.message : 'Error',
            type: MessageType.error,
        };
        dispatch(allActions.main.showMessage(message));
    };

    const _renderListTokens = () => {
        return (
            <Col
                style={[styles.listContainer, {paddingBottom: scale(72) + insets.bottom}, isLoading && {paddingTop: scale(16)}]}>
                {
                    isLoading ? <ActivityIndicator size="small" color={colors.N2}/> :
                        <>
                            {
                                allTokenInfo && allTokenInfo.length > 0 && allTokenInfo.map((value, i) => {
                                    return <TokenComponent value={value} key={i}/>;
                                })
                            }
                            <CButton
                                onPress={() => navigate(MainRouter.ADD_CUSTOM_TOKEN_SCREEN)}
                                style={{marginTop: scale(16)}}>
                                <Row mx={16} style={styles.alignCenter}>
                                    <IconPlusCircle width={scale(14)} height={scale(14)}/>
                                    <Text style={[textStyles.Body1, {marginLeft: scale(8)}]}>Add Custom Token</Text>
                                </Row>
                            </CButton>
                        </>
                }
            </Col>
        );
    };

    return (
        <CLayout bgColor={colors.cF8F8F8}>
            <View style={styles.container}>
                <Row.LR pl={24} pr={16} pt={10} pb={20}>
                    <Row style={styles.alignCenter}>
                        <IconLogo width={scale(28)} height={scale(28)}/>
                        <Text style={[textStyles.H3, {marginLeft: scale(16)}]}>Home</Text>
                    </Row>
                    <Row.C>
                        <CButton
                            onPress={() => navigate(MainRouter.SETTINGS_SCREEN)}
                            style={styles.circleBtn}>
                            <IconSetting width={scale(21)} height={scale(21)}/>
                        </CButton>
                        {/*<CButton style={[styles.circleBtn, {marginLeft: scale(16)}]}>
                            <IconScanCode width={scale(21)} height={scale(21)}/>
                        </CButton>*/}
                    </Row.C>
                </Row.LR>
                <Account/>
                <ScrollView
                    style={{marginTop: scale(16)}}
                    showsVerticalScrollIndicator={false}>
                    {_renderListTokens()}
                </ScrollView>
            </View>
        </CLayout>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    circleBtn: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(21),
        backgroundColor: colors.W1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listContainer: {
        width: '100%',
        minHeight: scale(500),
        backgroundColor: colors.W1,
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
    },
    alignCenter: {
        alignItems: 'center',
    },
});
