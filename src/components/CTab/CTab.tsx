import React, {useState, useRef, useEffect, forwardRef, useMemo, useImperativeHandle} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CTabRoute} from "components/CTab/CTabRoute";
import {device, scale} from "device";
import {colors, textStyles} from "assets";

interface CTabProps {
    data: any,
    indexDef: number,
    onChangeIndex?: (index: number) => void,
    swipeEnabled?: boolean,
    tabBarPosition?: any,
    renderTabBar?: any,
    lazyPreloadDistance?: any,
}

const CTab = forwardRef((props: CTabProps, ref) => {

    useImperativeHandle(ref, () => ({
        changeTab: (index: number) => {
            setIndex(index);
        },
    }));

    const {
        data,
        indexDef,
        onChangeIndex,
        swipeEnabled = true,
        tabBarPosition = 'top',
        renderTabBar,
        lazyPreloadDistance
    } = props;

    const [index, setIndex] = useState<number>(indexDef ? indexDef : 0);
    const [routes] = useState(data);
    const scene = useMemo(() => {
        const dataScene: any = {};
        if (data && data.length > 0) {
            data.forEach((item: CTabRoute) => {
                dataScene[item.key] = item.screen
            })
        }
        return dataScene;
    }, [data]);

    const _handleIndexChange = (index: number) => {
        if (onChangeIndex) onChangeIndex(index);
        setIndex(index);
    };

    const _renderTabBar = () => {
        return (
            <View style={{
                width: scale(375 - 16 * 2),
                height: scale(44),
                marginHorizontal: scale(16),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: scale(6),
                backgroundColor: colors.skyLighter,
            }}>
                {data.map((route: CTabRoute, i: number) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => _handleIndexChange(i)}>
                            <View style={[styles.tab, {width: scale(375 - 16 * 2) / data.length}, index === i && styles.tabBarActive]}>
                                <Text
                                    style={[styles.tabBarTitle, index === i && styles.tabBarActive]}>{route.title}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={SceneMap(scene)}
            renderTabBar={renderTabBar ? renderTabBar(props) : _renderTabBar}
            onIndexChange={_handleIndexChange}
            screenDefault={index}
            tabBarPosition={tabBarPosition ?? "bottom"}
            lazy={true}
            lazyPreloadDistance={lazyPreloadDistance ? lazyPreloadDistance : 0}
            swipeEnabled={swipeEnabled}
            initialLayout={{width: device.w}}
        />
    )
});

export default CTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(6),
        height: scale(40),
    },
    tabBarTitle: {
        ...textStyles.subHeadingMedium,
        fontSize: scale(14),
        color: colors.inkLightest,
    },
    tabBarActive: {
        backgroundColor: colors.primaryLightest,
        color: colors.inkBasic
    }
});
