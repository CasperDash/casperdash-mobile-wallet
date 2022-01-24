import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import {scale} from 'device';
import {colors, IconMessageSuccess, IconMessageError, IconMessageWarning, textStyles} from 'assets';
import {useSelector} from 'react-redux';
import {MessageType} from './types';
import {Row, Col} from 'components';

const CMessage = () => {
    const {CMessageData} = useSelector((state: any) => state && state.main);

    const getIcon = (type: string) => {
        const arrImage = new Map([
            [MessageType.success, {icon: <IconMessageSuccess width={scale(30)} height={scale(30)}/>, color: colors.G1}],
            [MessageType.error, {icon: <IconMessageError width={scale(30)} height={scale(30)}/>, color: colors.R3}],
            [MessageType.warning, {icon: <IconMessageWarning width={scale(30)} height={scale(30)}/>, color: colors.Y1}],
        ]);
        return arrImage.get(type);
    };

    const Type = CMessageData && getIcon(CMessageData.type);

    return (
        <Modal
            style={styles.container}
            useNativeDriver={true}
            hideModalContentWhileAnimating
            coverScreen={true}
            backdropColor={'transparent'}
            isVisible={!!CMessageData}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}>
            <Row.TL
                style={[styles.body, !CMessageData && {opacity: 0}]}>
                {Type && Type.icon}
                <Col pl={16}>
                    <Text
                        style={[styles.title, Type && {color: Type.color}]}>{CMessageData && CMessageData.type ? CMessageData.type : ''}</Text>
                    <Text
                        style={styles.content}>{CMessageData && CMessageData.message ? CMessageData.message : ''}</Text>
                </Col>
            </Row.TL>
        </Modal>
    );
};

export default CMessage;

const styles = StyleSheet.create({
    container: {
        margin: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        width: scale(287),
        backgroundColor: colors.W1,
        minHeight: scale(108),
        borderRadius: scale(16),
        padding: scale(24),

        shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: scale(16),
        shadowOpacity: 0.6,

        elevation: 10,
    },
    content: {
        ...textStyles.Body1,
        marginTop: scale(12),
        color: colors.N2,
    },
    title: {
        ...textStyles.H5,
        marginTop: scale(-5),
    },
});
