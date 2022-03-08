import React, {useState, useEffect} from 'react';

import {
    ActivityIndicator,
    Image,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {fonts} from "assets";
import {scale} from "device";

function isSame(prev, next) {
    return prev.source === next.source;
}

function CFastImage(props) {
    const {
        onPress,
        style,
        overlayColor,
        styleImage,
        source,
        disabled,
        resizeMode,
        resizeMethod,
        width,
        height,
        heightOffset,
        sourceDef,
        colorDef,
        text,
        textStyle,
        textContainerStyle,
    } = props;

    const [heightState, setHeight] = useState(() => {
        if (height && height > 0) {
            return height;
        } else if (heightOffset && heightOffset > 0) {
            return heightOffset;
        }
        return (width || Dimensions.get('window').width) / 2;
    });
    const [widthState, setWidth] = useState(() => width || Dimensions.get('window').width);
    const [load, setLoad] = useState(!!source);
    const [error, setError] = useState(false);

    const _onLoadStart = () => {
        setLoad(true);
    };

    const _onLoadEnd = () => {
        setLoad(false);
    };

    const _onError = (e) => {
        setError(!!e);
        setLoad(false);
    };

    const _onPress = () => {
        if (onPress) {
            onPress(props);
        }
    };

    return (
        <TouchableOpacity
            style={[
                {backgroundColor: colorDef ? colorDef : '#efefef'},
                style,
                styles.container,
                {width: widthState, height: heightState},
            ]}
            onPress={_onPress}
            disabled={disabled}>
            <FastImage onLoadStart={_onLoadStart}
                       onLoadEnd={_onLoadEnd}
                       onError={_onError}
                       source={source && !error ? {uri: source} : (sourceDef ? sourceDef : null)}
                       resizeMode={resizeMode}
                       resizeMethod={resizeMethod}
                       style={[
                           styleImage,
                           styles.image,
                           {overlayColor: overlayColor},
                           {width: widthState, height: heightState},
                       ]}
            />
            {
                text && !load &&
                <View style={[textContainerStyle ? textContainerStyle : styles.indicator, {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                }]}>
                    <Text style={textStyle ? textStyle : styles.title} numberOfLines={2}>
                        {text}
                    </Text>
                </View>

            }
            {
                load &&
                <View style={[styles.indicator, {width: widthState, height: heightState}]}>
                    <ActivityIndicator/>
                </View>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
    },

    image: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },

    indicator: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    title: {
        fontSize: scale(16),
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        paddingHorizontal: scale(5),
        fontFamily: fonts.Poppins.regular,
    },
});

export default React.memo(CFastImage, isSame);

