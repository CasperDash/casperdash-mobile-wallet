import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AccountAction} from 'screens/home/HomeScreen/data/data';
import {CButton, Col} from 'components';
import {scale} from 'device';
import {colors, textStyles} from 'assets';
import {useNavigation} from '@react-navigation/native';

interface Props {
    data: AccountAction
}

const ButtonAction = ({data}: Props) => {
    const {id, icon, title, screen} = data;
    const {navigate} = useNavigation();

    const IconAction = icon;

    return (
        <Col mx={id === 1 ? 32 : 0} mb={16} style={styles.container}>
            <CButton
                style={styles.button}
                // onPress={() => navigate(screen)}
            >
                <IconAction/>
            </CButton>
            <Text style={styles.title}>{title}</Text>
        </Col>
    );
};

export default ButtonAction;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    button: {
        width: scale(52),
        height: scale(52),
        borderRadius: scale(26),
        backgroundColor: colors.R2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...textStyles.Body2,
        color: colors.N3,
        marginTop: scale(12),
    },
});
