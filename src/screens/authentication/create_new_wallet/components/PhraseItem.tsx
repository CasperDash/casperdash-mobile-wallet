import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Row} from 'components';
import {scale} from "device";
import {colors, fonts, textStyles} from "assets";

interface PhraseItemProps {
    data: any,
    index: number,
}

const PhraseItem = ({data, index}: PhraseItemProps) => {
    return (
        <Row mb={16} style={styles.container}>
            <Text numberOfLines={1} style={styles.title}>{index + 1}</Text>
            <Text numberOfLines={1} style={styles.title2}>{data?.word}</Text>
        </Row>
    );
};

export default PhraseItem;

const styles = StyleSheet.create({
    container: {
        width: scale(150),
        paddingVertical: scale(2),
        alignItems: 'center',
    },
    title: {
        ...textStyles.Body1,
        color: colors.c828489,
        fontFamily: fonts.Lato.regular,
        marginRight: scale(11)
    },
    title2: {
        ...textStyles.Body1,
        color: colors.N2,
        fontFamily: fonts.Lato.regular,
        flex: 1,
    }
})
