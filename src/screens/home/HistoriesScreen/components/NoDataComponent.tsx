import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {colors, images, textStyles} from 'assets';
import {Col} from 'components';
import {scale} from 'device';

const NoDataComponent = () => {
    return (
        <Col.C mt={25}>
            <Image source={images.nodata} style={styles.img}/>
            <Text style={[textStyles.Body2, {color: colors.c828489}]}>No Data</Text>
        </Col.C>
    );
};

export default NoDataComponent;

const styles = StyleSheet.create({
    img: {
        width: scale(200),
        height: scale(200),
    },
});
