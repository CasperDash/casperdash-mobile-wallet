import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, UIManager, LayoutAnimation} from 'react-native';
import {
    colors,
    textStyles,
    IconScanCode,
    IconSetting,
    IconEyeOff,
    IconEye,
    IconPencilFilled,
    IconCopy,
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

function HomeScreen() {

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const {navigate} = useNavigation();
    const dispatch = useDispatch();
    const key = '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38';
    const amount = 45678.89;

    const [isShowAmount, setIsShowAmount] = useState<boolean>(true);

    const onToggleAmount = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsShowAmount(i => !i);
    };

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
                            <IconPencilFilled width={scale(16)} height={scale(16)}/>
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
                    <CButton onPress={onToggleAmount}>
                        {isShowAmount ? <IconEye width={scale(20)} height={scale(14)}/> :
                            <IconEyeOff width={scale(20)} height={scale(19)}/>}
                    </CButton>
                </Row.C>
                <Row.C>
                    {AccountActions.map((action, index) => {
                        return <ButtonAction data={action} key={index}/>;
                    })}
                </Row.C>
            </Col>
        );
    };

    return (
        <CLayout bgColor={colors.cF8F8F8}>
            <View style={styles.container}>
                <Row.LR pl={24} pr={16} pt={10} pb={24}>
                    <Text style={textStyles.H3}>Home</Text>
                    <Row.C>
                        <CButton
                            onPress={() => navigate(MainRouter.SETTINGS_SCREEN)}
                            style={[styles.circleBtn, {marginRight: scale(16)}]}>
                            <IconSetting width={scale(21)} height={scale(21)}/>
                        </CButton>
                        <CButton style={styles.circleBtn}>
                            <IconScanCode width={scale(21)} height={scale(21)}/>
                        </CButton>
                    </Row.C>
                </Row.LR>
                {_renderAccountComponent()}
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
});
