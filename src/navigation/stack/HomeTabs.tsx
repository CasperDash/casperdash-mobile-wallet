import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Col } from 'components';
import { isIos, scale } from 'device';
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
  IconBrowser,
  IconBrowserActive,
} from 'assets';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StakingNavigation from 'navigation/StakingNavigation';
import NFTNavigation from 'navigation/NFTNavigation';
import MarketNavigation from 'navigation/MarketNavigation';
import HomeNavigation from 'navigation/HomeNavigation';
import BrowserNavigation from 'navigation/BrowserNavigation';

const Tab = createBottomTabNavigator();

interface TProps {
  focused?: boolean;
  children: React.ReactNode;
  label: string;
}

const TabItem = ({ focused, children }: TProps) => {
  return (
    <Col.B style={styles.tab}>
      {children}
      {focused && <View />}
    </Col.B>
  );
};

const tabBarHeight = scale(40);

const tabIcon18 = {
  width: scale(18),
  height: scale(18),
};

const tabIcon20 = {
  width: scale(20),
  height: scale(20),
};

const listTabs = [
  {
    name: 'Home',
    component: HomeNavigation,
    tabItemActive: <IconMenuHomeActive {...tabIcon18} />,
    tabItemInActive: <IconMenuHome {...tabIcon18} />,
  },
  {
    name: 'Staking',
    component: StakingNavigation,
    tabItemActive: <IconMenuStakingActive {...tabIcon18} />,
    tabItemInActive: <IconMenuStaking {...tabIcon18} />,
  },
  {
    name: 'Collection',
    component: NFTNavigation,
    tabItemActive: <IconMenuNFTActive {...tabIcon18} />,
    tabItemInActive: <IconMenuNFT {...tabIcon18} />,
  },
  {
    name: 'Browser',
    component: BrowserNavigation,
    tabItemActive: <IconBrowserActive {...tabIcon20} />,
    tabItemInActive: <IconBrowser {...tabIcon20} />,
  },
  {
    name: 'Market',
    component: MarketNavigation,
    tabItemActive: <IconMenuMarketActive {...tabIcon18} />,
    tabItemInActive: <IconMenuMarket {...tabIcon18} />,
  },
];

const HomeTabs = () => {
  const insets = useSafeAreaInsets();

  const renderIcon = ({ focused, tab }: { focused: any; tab: any }) => (
    <TabItem {...{ focused }} label={tab.name}>
      {focused ? tab.tabItemActive : tab.tabItemInActive}
    </TabItem>
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator initialRouteName="Home">
        {listTabs.map((tab, index) => {
          return (
            <Tab.Screen
              key={`${tab.name}-${index}`}
              name={tab.name}
              component={tab.component}
              options={{
                tabBarIcon: ({ focused }) => renderIcon({ focused, tab }),
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: [
                  styles.tab,
                  {
                    height: tabBarHeight + insets.bottom,
                  },
                ],
              }}
            />
          );
        })}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),

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
});

export default HomeTabs;
