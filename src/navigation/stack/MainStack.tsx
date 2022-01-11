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
    IconMenuSetting,
    IconMenuSettingActive
} from 'assets';


import {
    createStackNavigator,
    TransitionPresets,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeStack from 'navigation/stack/HomeStack';
import StakingNavigation from "navigation/StakingNavigation";
import NFTNavigation from "navigation/NFTNavigation";
import MarketNavigation from "navigation/MarketNavigation";
import SettingsNavigation from "navigation/SettingsNavigation";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface TProps {
    focused?: boolean;
    children: React.ReactNode;
    label: string;
}

const TabItem = ({focused, children, label}: TProps) => {
    return (
        <Col.B style={styles.tab}>
            {children}
        </Col.B>
    );
};

const tabBarHeight = scale(82);

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
                        }
                    ],
                    keyboardHidesTabBar: Platform.OS === 'android',
                }}>
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <TabItem {...{focused}} label={'Home'}>
                                {
                                    focused ? <IconMenuHomeActive width={scale(24)} height={scale(24)}/> :
                                        <IconMenuHome width={scale(24)} height={scale(24)}/>
                                }
                            </TabItem>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Staking"
                    component={StakingNavigation}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <TabItem {...{focused}} label={'Staking'}>
                                {
                                    focused ? <IconMenuStakingActive width={scale(24)} height={scale(24)}/> :
                                        <IconMenuStaking width={scale(24)} height={scale(24)}/>
                                }
                            </TabItem>
                        ),
                    }}
                />
                <Tab.Screen
                    name="NFT"
                    component={NFTNavigation}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <TabItem {...{focused}} label={'NFT'}>
                                {
                                    focused ? <IconMenuNFTActive width={scale(24)} height={scale(24)}/> :
                                        <IconMenuNFT width={scale(24)} height={scale(24)}/>
                                }
                            </TabItem>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Market"
                    component={MarketNavigation}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <TabItem {...{focused}} label={'Market'}>
                                {
                                    focused ? <IconMenuMarketActive width={scale(24)} height={scale(24)}/> :
                                        <IconMenuMarket width={scale(24)} height={scale(24)}/>
                                }
                            </TabItem>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsNavigation}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <TabItem {...{focused}} label={'Manager'}>
                                {
                                    focused ? <IconMenuSettingActive width={scale(24)} height={scale(24)}/> :
                                        <IconMenuSetting width={scale(24)} height={scale(24)}/>
                                }
                            </TabItem>
                        ),
                    }}
                />
            </Tab.Navigator>

        </View>
    );
};

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen name="HomeTabs" component={HomeTabs}/>
        </Stack.Navigator>
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

        backgroundColor: colors.cFFFFFF
    },
    labelStyle: {
        marginTop: scale(5),
        fontFamily: fonts.Poppins.regular,
        fontSize: scale(12),
        color: colors.c000000,
    },
});

export default MainStack;
