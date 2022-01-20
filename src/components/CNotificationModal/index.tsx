import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {scale} from 'device';
import {colors} from 'assets';


const CNotificationModal = forwardRef((props, ref): any => {

    useImperativeHandle(ref, () => ({
        show: show,
        hide: hide,
    }));

    const [isShow, setIsShow] = useState<boolean>(true);

    const show = () => {
        setIsShow(true);
    };

    const hide = () => {
        setIsShow(false);
    };

    return (
        <Modal
            onBackdropPress={hide}
            style={styles.container}
            useNativeDriver={true}
            hideModalContentWhileAnimating
            coverScreen={true}
            backdropColor={'transparent'}
            isVisible={isShow}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}>
            <View style={styles.body} />
        </Modal>
    );
});

export default CNotificationModal;

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

        shadowColor: 'rgba(35, 38, 53, 0.2)',
        shadowOffset: {
            width: scale(0),
            height: scale(4),
        },
        shadowRadius: scale(4),
        shadowOpacity: 0.4,

        elevation: 3,
    },
});
