import React, {useState, useRef, useEffect, forwardRef, useMemo, useImperativeHandle} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated, LayoutChangeEvent, LayoutAnimation, UIManager
} from 'react-native';

import {CTabRoute} from "components/CTab/CTabRoute";
import {device, scale} from "device";
import {colors, fonts, textStyles} from "assets";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {MaterialTopTabBarProps} from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import {StackParamList} from "navigation/ScreenProps";
import {useNavigation} from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator<StackParamList>();

interface CTabProps {
    data: any,
    onChangeIndex?: (index: number) => void,
    swipeEnabled?: boolean,
    tabBarPosition?: any,
    renderTabBar?: any,
    lazyPreloadDistance?: any,
    lazy?: boolean,
    screenOptions?: any,
    initialRouteName?: string,
    style?: any
}

const CTab2 = forwardRef((props: CTabProps, ref) => {
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const {
        data,
        swipeEnabled = true,
        lazyPreloadDistance,
        lazy = true,
        screenOptions,
        initialRouteName,
        tabBarPosition = 'top',
        style,
    } = props;

    const navigation = useNavigation();

    useImperativeHandle(ref, () => ({
        jumpTo: jumpTo,
    }));

    const jumpTo = (index: number) => {
        if (data && data.length > 0 && data[index] && data[index].title) {
            navigation.jumpTo(data[index].title);
        }
    };

    return (
        <Tab.Navigator
            initialRouteName={initialRouteName}
            initialLayout={{width: device.w}}
            tabBarPosition={tabBarPosition}
            style={style}
            screenOptions={{
                lazy: lazy,
                swipeEnabled: swipeEnabled,
                lazyPreloadDistance: lazyPreloadDistance,
                tabBarLabelStyle: styles.tabBarTitle,
                tabBarItemStyle: styles.tabBarItemStyle,
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: colors.c262421,
                tabBarInactiveTintColor: colors.cB1B1B1,
                tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
                ...screenOptions
            }}>
            {
                data.map((tab: CTabRoute, index: number) => {
                    return <Tab.Screen key={index} name={tab.title} component={tab.screen} options={tab.options}/>;
                })
            }
        </Tab.Navigator>
    )
});

export default CTab2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        height: scale(53),
    },
    tabBarTitle: {
        fontFamily: fonts.Poppins.demiBold,
        fontSize: scale(18),
        textTransform: 'capitalize'
    },
    tabBarItemStyle: {
        width: 'auto'
    },
    tabBarStyle: {
        width: 'auto',
        backgroundColor: colors.cF6F5F4,
        borderBottomWidth: scale(1),
        borderBottomColor: colors.cB1B1B1
    },
    tabBarIndicatorStyle: {
        height: scale(3),
        backgroundColor: colors.c262421
    },
});
