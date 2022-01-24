import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, LayoutAnimation, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Row, Col, CButton, CPaginationDot} from 'components';
import {ListIntro} from 'screens/authentication/data/data';
import {colors, fonts, IconArrowLeft, IconArrowRight, textStyles} from 'assets';
import {device, scale} from 'device';
import IntroItem from 'screens/authentication/WelcomeScreen/IntroItem';
import {useNavigation} from '@react-navigation/native';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import {StackNavigationProp} from '@react-navigation/stack';
import {Config, Keys} from 'utils';

const introDescription = 'Casper Dash is a platform that aims to build a new creative economy.';

const translatePreset = {
    duration: 300,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
};

function WelcomeScreen() {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const arrayImgSlider = Array.from({length: ListIntro.length}, (_, i) => (i * scale(375)));
    const flatListRef = useRef<any>(null);
    const navigation = useNavigation<StackNavigationProp<any>>();

    const navigate = (n: number) => {
        if (currentIndex === 0 && n === -1 || currentIndex === 2 && n === 1) {
            return;
        }
        LayoutAnimation.configureNext(translatePreset);
        setCurrentIndex(i => i + n);
    };

    useEffect(() => {
        const offset = arrayImgSlider[currentIndex] ?? 0;
        flatListRef.current?.scrollToOffset({offset: offset, animated: true});
    }, [currentIndex]);

    const onMomentumScrollEnd = (e: any) => {
        let x = e.nativeEvent.contentOffset.x;
        x = Math.round(x);
        const index = arrayImgSlider.indexOf(x);
        if (index > -1) {
            LayoutAnimation.configureNext(translatePreset);
            setCurrentIndex(index);
        }
    };

    const openCreateNewWallet = async () => {
        await Config.saveItem(Keys.overview, 1);
        navigation.replace(AuthenticationRouter.CREATE_NEW_WALLET);
    };

    const _renderGetStarted = () => {
        return <CButton
            onPress={openCreateNewWallet}
            style={styles.btnGetStarted}>
            <Text style={styles.sub1}>Get started now</Text>
        </CButton>;
    };

    const _renderNavigatorButton = () => {
        return <Col style={styles.navigatorContainer}>
            <CButton style={styles.btnArrow} onPress={() => navigate(-1)}>
                <IconArrowLeft width={scale(14)} height={scale(9)}/>
            </CButton>
            <View style={styles.line}/>
            <CButton style={styles.btnArrow} onPress={() => navigate(+1)}>
                <IconArrowRight width={scale(14)} height={scale(9)}/>
            </CButton>
        </Col>;
    };

    return (
        <View style={[styles.container]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={false}
                contentContainerStyle={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    minHeight: device.h,
                }}>
                <Row.LR px={24} pt={20} mb={20} style={{alignItems: 'center'}}>
                    <CButton
                        onPress={openCreateNewWallet}
                        style={styles.btnSkip}>
                        <Text style={styles.txtSkip}>Skip</Text>
                    </CButton>
                    <CPaginationDot
                        lineStyle
                        length={3}
                        style={styles.pagination}
                        active={currentIndex}
                        activeLineWidth={scale(24)}
                        activeLineHeight={scale(4)}
                        borderRadius={scale(4)}
                        activeLineColor={colors.R1}
                        lineSpace={scale(4)}
                        passiveLineWidth={scale(12)}
                        passiveLineHeight={scale(4)}
                        passiveLineColor={colors.cE0E0E0}
                    />
                </Row.LR>
                <FlatList
                    ref={flatListRef}
                    data={ListIntro}
                    extraData={ListIntro}
                    horizontal={true}
                    scrollEventThrottle={1}
                    decelerationRate={'fast'}
                    style={{
                        flexGrow: 0,
                    }}
                    snapToOffsets={arrayImgSlider}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    getItemLayout={(data, index) => (
                        {length: scale(375), offset: scale(375) * index, index}
                    )}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => {
                        return <IntroItem {...item} key={index}/>;
                    }}
                    keyExtractor={(item, index) => `${index}-${item.id ? item.id : ''}`}
                />
                <Text style={styles.body2}>{introDescription}</Text>
                <Col style={styles.footer}>
                    {
                        currentIndex === 2 ? _renderGetStarted() : _renderNavigatorButton()
                    }
                </Col>
            </ScrollView>
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-start',
        flex: 1,
    },
    txtSkip: {
        ...textStyles.Sub2,
        fontFamily: fonts.DMSans.regular,
        color: colors.Neutrals2,
        fontWeight: '700',
    },
    btnSkip: {
        backgroundColor: colors.gray6,
        borderRadius: scale(16),
        paddingHorizontal: scale(16),
        paddingVertical: scale(8),
    },
    pagination: {
        flex: 1,
        height: 'auto',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    body2: {
        ...textStyles.Body2,
        color: colors.N3,
        textAlign: 'center',
        marginTop: scale(16),
        width: scale(375 - 64),
        alignSelf: 'center',
        lineHeight: 26,
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: scale(20),
        paddingBottom: scale(20),
    },
    navigatorContainer: {
        width: scale(154),
        height: scale(64),
        borderRadius: scale(32),
        borderWidth: scale(1),
        borderColor: colors.gray6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnArrow: {
        width: scale(76),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    line: {
        height: scale(24),
        width: scale(2),
        borderRadius: scale(2),
        backgroundColor: colors.N2,
    },
    btnGetStarted: {
        width: scale(193),
        height: scale(48),
        backgroundColor: colors.R1,
        borderRadius: scale(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sub1: {
        ...textStyles.Sub1,
        color: colors.Neutrals8,
        marginTop: scale(2),
    },
});
