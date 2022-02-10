import React, {useState, useRef, useContext, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    UIManager,
    LayoutAnimation,
    ScrollView,
    Image
} from 'react-native';
import {
    colors,
    textStyles,
    IconScanCode,
    IconSetting,
    IconEyeOff,
    IconEye,
    IconPencilFilled,
    IconCopy,
    images,
    IconPlusCircle,
    IconLogo,
} from 'assets';
import {CButton, CLayout, Col, Row} from 'components';
import {scale} from 'device';
import {useNavigation} from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';
import Clipboard from '@react-native-clipboard/clipboard';
import {MessageType} from 'components/CMessge/types';
import {allActions} from 'redux_manager';
import {useDispatch} from 'react-redux';
import {AccountActions} from './data/data';
import ButtonAction from 'screens/home/HomeScreen/components/ButtonAction';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import TokenComponent from "screens/home/HomeScreen/components/TokenComponent";

function HomeScreen() {

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const {navigate} = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const key = '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38';
    const amount = 45678.89;

    const [isShowAmount, setIsShowAmount] = useState<boolean>(true);

    const onToggleAmount = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsShowAmount(i => !i);
    };

    useEffect(() => {
        getTokenInfoWithBalance();
    }, []);

    const getTokenInfoWithBalance = () => {
        dispatch(allActions.home.getTokenInfoWithBalance((error: any, data: any) => {
            if (error) {
                const message = {
                    message: error && error.message ? error.message : 'Error',
                    type: MessageType.error,
                };
                dispatch(allActions.main.showMessage(message));
            }
        }))
    }

    const saveKey = () => {
        Clipboard.setString(key);
        const message = {
            message: 'Copied to Clipboard',
            type: MessageType.normal,
        };
        dispatch(allActions.main.showMessage(message, 1000));
    };

    const _renderAccountComponent = () => {
        return (
            <Col px={16} py={16} mx={16} style={styles.accountContainer}>
                <Row.LR>
                    <CButton style={{maxWidth: scale(343 - 16) / 2}}>
                        <Row.C>
                            <Text
                                numberOfLines={1}
                                style={styles.titleAccount}>Account 1</Text>
                            {/*<IconPencilFilled width={scale(16)} height={scale(16)}/>*/}
                        </Row.C>
                    </CButton>

                    <CButton
                        onPress={saveKey}
                        style={{maxWidth: scale(343 - 16) / 2}}>
                        <Row.C>
                            <Text numberOfLines={1}
                                  ellipsizeMode={'middle'}
                                  style={[styles.titleAccount, {maxWidth: scale(100)}]}>
                                {key}
                            </Text>
                            <IconCopy width={scale(16)} height={scale(16)}/>
                        </Row.C>
                    </CButton>
                </Row.LR>
                <Row.C mx={16} mt={20} mb={24}>
                    <Text numberOfLines={1}
                          style={[textStyles.H3, {marginRight: scale(8)}]}>{isShowAmount ? (amount).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }) : '$*****00'}</Text>
                    {/*<CButton onPress={onToggleAmount}>
                        {isShowAmount ? <IconEye width={scale(20)} height={scale(14)}/> :
                            <IconEyeOff width={scale(20)} height={scale(19)}/>}
                    </CButton>*/}
                </Row.C>
                <Row.C>
                    {AccountActions.map((action, index) => {
                        return <ButtonAction data={action} key={index}/>;
                    })}
                </Row.C>
            </Col>
        );
    };

    const _renderListTokens = () => {
        return (
            <Col mt={16}
                 style={[styles.listContainer, {paddingBottom: scale(72) + insets.bottom}]}>
                <TokenComponent/>
                <CButton style={{marginTop: scale(16)}}>
                    <Row mx={16} style={styles.alignCenter}>
                        <IconPlusCircle width={scale(14)} height={scale(14)}/>
                        <Text style={[textStyles.Body1, {marginLeft: scale(8)}]}>Add Custom Token</Text>
                    </Row>
                </CButton>
            </Col>
        )
    }
    return (
        <CLayout bgColor={colors.cF8F8F8}>
            <View style={styles.container}>
                <Row.LR pl={24} pr={16} pt={10} pb={10}>
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingTop: scale(14)}}>
                    {_renderAccountComponent()}
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
    accountContainer: {
        width: scale(343),
        backgroundColor: colors.W1,
        borderRadius: scale(24),
        alignSelf: 'center',
    },
    titleAccount: {
        ...textStyles.Body2,
        marginRight: scale(10),
    },
    listContainer: {
        width: '100%',
        minHeight: scale(500),
        backgroundColor: colors.W1,
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
    },
    alignCenter: {
        alignItems: 'center'
    }
});
