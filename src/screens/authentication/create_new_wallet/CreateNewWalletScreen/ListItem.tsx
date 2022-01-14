import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {CreateNewWalletMenu} from "screens/authentication/data/data";
import {Row, CButton} from 'components';
import {scale} from "device";
import {colors, fonts} from "assets";

interface ListItemProps {
    onPress: (screen: string) => void,
    data: CreateNewWalletMenu
}

function ListItem({data, onPress}: ListItemProps) {
    const Icon = data.icon;

    return (
        <CButton onPress={() => onPress(data.screen)}>
            <Row px={20} mb={16} style={styles.container}>
                <Icon/>
                <Text style={styles.title}>{data.title}</Text>
            </Row>
        </CButton>
    );
}

export default ListItem;

const styles = StyleSheet.create({
    container: {
        width: scale(327),
        height: scale(64),
        borderRadius: scale(32),
        borderWidth: scale(1),
        borderColor: colors.gray6,
        alignItems: 'center'
    },
    title: {
        fontFamily: fonts.Lato.regular,
        fontWeight: '400',
        fontSize: scale(17),
        fontStyle: 'normal',
        color: colors.N2,
        marginLeft: scale(20)
    }
})
