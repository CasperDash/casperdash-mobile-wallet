import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import {scale} from 'device';
import {colors, IconCircleClose, textStyles} from 'assets';
import {Row, Col, CButton} from 'components';
import CTextButton from 'components/CTextButton';

interface AlertType {
    alertMessage: string,
    buttonLeft?: string,
    buttonRight?: string
}

interface CAlertProps {
    onCancel?: () => void,
    onConfirm?: () => void,
}

const defaultAlertType = {
    alertMessage: '',
    buttonLeft: 'Cancel',
    buttonRight: 'Confirm',
};

const CAlert = forwardRef(({onCancel, onConfirm}: CAlertProps, ref) => {

    const [isVisible, setVisible] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertType>(defaultAlertType);

    useImperativeHandle(ref, () => ({
        show: show,
    }));

    const show = (data: AlertType) => {
        setVisible(true);
        setAlert({...alert, ...data});
    };

    const hide = () => {
        setVisible(false);
    };

    const cancel = () => {
        hide();
        onCancel && onCancel();
    };

    const confirm = () => {
        hide();
        onConfirm && onConfirm();
    };

    return (
        <Modal
            style={styles.container}
            useNativeDriver={true}
            hideModalContentWhileAnimating
            coverScreen={true}
            onBackdropPress={hide}
            backdropColor={'transparent'}
            isVisible={isVisible}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}>
            <Col
                style={styles.body}>
                <Row.R>
                    <CButton onPress={hide}>
                        <IconCircleClose width={scale(24)} height={scale(24)}/>
                    </CButton>
                </Row.R>
                <Text style={styles.message}>{alert.alertMessage}</Text>
                <Row.LR>
                    <CTextButton
                        onPress={cancel}
                        text={alert.buttonLeft}
                        type={'line'}
                        style={styles.button}/>
                    <CTextButton
                        onPress={confirm}
                        text={alert.buttonRight}
                        style={styles.button}/>
                </Row.LR>
            </Col>
        </Modal>
    );
});

export default CAlert;

const styles = StyleSheet.create({
    container: {
        margin: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        width: scale(320),
        minHeight: scale(223),
        backgroundColor: colors.W1,
        borderRadius: scale(16),
        padding: scale(16),

        shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: scale(16),
        shadowOpacity: 0.6,

        elevation: 10,
    },
    message: {
        ...textStyles.Body1,
        marginVertical: scale(32),
        alignSelf: 'center',
        width: '100%',
        textAlign: 'center',
        lineHeight: 30,
    },
    button: {
        width: scale(136),
        height: scale(48),
    },
});
