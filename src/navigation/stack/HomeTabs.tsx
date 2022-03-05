import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Col} from 'components';
import {isIos, scale} from 'device';
import {
    colors,
    fonts,
    IconMenuHome,
    IconMenuHomeActive,
    IconMenuStaking,
    IconMenuStakingActive,
    IconMenuNFT,
    IconMenuNFTActive,
    IconMenuMarket,
    IconMenuMarketActive,
    IconMenuKeyManagerActive,
    IconMenuKeyManager,
} from 'assets';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import StakingNavigation from 'navigation/StakingNavigation';
import NFTNavigation from 'navigation/NFTNavigation';
import MarketNavigation from 'navigation/MarketNavigation';
import HomeNavigation from 'navigation/HomeNavigation';
import KeyManagerNavigation from 'navigation/KeyManagerNavigation';

const Tab = createBottomTabNavigator();

interface TProps {
    focused?: boolean;
    children: React.ReactNode;
    label: string;
}

const TabItem = ({focused, children}: TProps) => {
    return (
        <Col.B style={styles.tab}>
            {children}
            {focused && <View style={styles.activeDot}/>}
        </Col.B>
    );
};

const tabBarHeight = scale(72);

const tabIcon24 = {
    width: scale(24),
    height: scale(24),
};

const tabIcon25 = {
    width: scale(25),
    height: scale(25),
};

const listTabs = [
    {
        name: 'Home',
        component: HomeNavigation,
        tabItemActive: <IconMenuHomeActive {...tabIcon24}/>,
        tabItemInActive:  <IconMenuHome {...tabIcon24}/>,
    },
    //TODO: enabled when these tabs are completed.
    /*{
        name: 'Staking',
        component: StakingNavigation,
        tabItemActive: <IconMenuStakingActive {...tabIcon24}/>,
        tabItemInActive:  <IconMenuStaking {...tabIcon24}/>,
    },*/
    {
        name: 'NFT',
        component: NFTNavigation,
        tabItemActive: <IconMenuNFTActive {...tabIcon25}/>,
        tabItemInActive:  <IconMenuNFT {...tabIcon25}/>,
    },
    /*{
        name: 'Market',
        component: MarketNavigation,
        tabItemActive: <IconMenuMarketActive {...tabIcon24}/>,
        tabItemInActive:  <IconMenuMarket {...tabIcon24}/>,
    },
    {
        name: 'KeyManager',
        component: KeyManagerNavigation,
        tabItemActive: <IconMenuKeyManagerActive {...tabIcon25}/>,
        tabItemInActive:  <IconMenuKeyManager {...tabIcon25}/>,
    },*/
];

const HomeTabs = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{flex: 1}}>
            <Tab.Navigator
                initialRouteName="Home"
                tabBarOptions={{
                    showLabel: false,
                    labelStyle: styles.labelStyle,
                    style: [
                        styles.tab, {
                            height: tabBarHeight + insets.bottom,
                        },
                    ],
                    keyboardHidesTabBar: Platform.OS === 'android',
                }}>
                {
                    listTabs.map((tab) => {
                        return <Tab.Screen
                            name={tab.name}
                            component={tab.component}
                            options={{
                                tabBarIcon: ({focused}) => (
                                    <TabItem {...{focused}} label={tab.name}>
                                        {
                                            focused ? tab.tabItemActive : tab.tabItemInActive
                                        }
                                    </TabItem>
                                ),
                            }}
                        />;
                    })
                }
            </Tab.Navigator>

        </View>
    );
};

const styles = StyleSheet.create({
    tab: {
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),

        shadowColor: isIos() ? 'rgba(55, 62, 125, 0.05)' : 'rgba(55, 62, 125, 1)',
        shadowOffset: {
            width: 0,
            height: scale(-6),
        },
        shadowRadius: scale(8),
        shadowOpacity: 0.8,

        backgroundColor: colors.cFFFFFF,
    },
    labelStyle: {
        marginTop: scale(5),
        fontFamily: fonts.Poppins.regular,
        fontSize: scale(12),
        color: colors.c000000,
    },
    activeDot: {
        width: scale(6),
        height: scale(6),
        backgroundColor: colors.R1,
        borderRadius: scale(3),
        position: 'absolute',
        bottom: scale(-12),
    },
});

export default HomeTabs;
