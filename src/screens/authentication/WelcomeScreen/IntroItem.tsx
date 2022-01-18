import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Intro} from 'screens/authentication/data/data';
import {scale} from 'device';
import {colors, textStyles} from 'assets';

const IntroItem = (data: Intro) => {
    return (
        <View style={styles.introContainer}>
            <Image style={styles.introImage} source={data.image}/>
            <Text style={styles.title}>{data.title}</Text>
        </View>
    );
};

export default IntroItem;

const styles = StyleSheet.create({
    introContainer: {
        width: scale(375),
        justifyContent: 'center',
        alignItems: 'center',
    },
    introImage: {
        width: scale(280),
        height: scale(280),
    },
    title: {
        ...textStyles.H3,
        color: colors.N2,
        textAlign: 'center',
    },
});
