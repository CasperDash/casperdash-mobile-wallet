import {scale} from "device";
import {StyleSheet} from "react-native";

import IconBack from './images/ic_back.svg';
import IconMenuHome from './images/ic_menu_home.svg';
import IconMenuHomeActive from './images/ic_menu_home_active.svg';
import IconMenuStaking from './images/ic_menu_staking.svg';
import IconMenuStakingActive from './images/ic_menu_staking_active.svg';
import IconMenuNFT from './images/ic_menu_nft.svg';
import IconMenuNFTActive from './images/ic_menu_nft_active.svg';
import IconMenuMarket from './images/ic_menu_market.svg';
import IconMenuMarketActive from './images/ic_menu_market_active.svg';
import IconMenuSetting from './images/ic_menu_setting.svg';
import IconMenuSettingActive from './images/ic_menu_setting_active.svg';
import IconArrowLeft from './images/ic_arrow_left.svg';
import IconArrowRight from './images/ic_arrow_right.svg';

const images = {
    avatar: require('./images/avatar.png'),
    intro1: require('./images/intro1.png'),
    intro2: require('./images/intro2.png'),
    intro3: require('./images/intro3.png'),
};

const colors = {
    c000000: '#000000',
    cFFFFFF: '#FFFFFF',
    c26273C: '#26273C',
    cB2B2B2: '#B2B2B2',
    cE0E0E0: '#E0E0E0',

    N1: '#000000',
    N2: '#353945',
    N3: '#777E91',
    N4: '#D1D7E7',
    N5: '#F6F7FA',
    N6: '#FCFCFD',

    W1: '#FFFFFF',

    R1: '#FA2852',
    R2: '#FBD2D3',
    R3: '#E1372D',

    G1: '#83BD67',
    G2: '#DAEBD1',

    Y1: '#FFCD1A',

    B1: '#3772FF',
    B2: '#D7E3FF',

    Neutrals2: '#23262F',
    Neutrals8: '#FCFCFD',

    gray6: '#F2F2F2'
};

const fonts = {
    Poppins: {
        bold: 'Poppins-Bold',
        regular: 'Poppins-Regular',
        medium: 'Poppins-Medium',
        semiBold: 'Poppins-SemiBold'
    },
    DMSans: {
        bold: 'DMSans-Bold',
        regular: 'DMSans-Regular',
        medium: 'DMSans-Medium',
    },
};

const textStyles = StyleSheet.create({
    Body1: {
        fontFamily: fonts.Poppins.regular,
        fontWeight: '400',
        fontSize: scale(16),
        fontStyle: 'normal',
        color: colors.c000000
    },
    Body2: {
        fontFamily: fonts.Poppins.regular,
        fontWeight: '400',
        fontSize: scale(14),
        fontStyle: 'normal',
        color: colors.c000000
    },
    Sub1: {
        fontFamily: fonts.Poppins.regular,
        fontWeight: '500',
        fontSize: scale(16),
        fontStyle: 'normal',
        color: colors.c000000
    },
    Sub2: {
        fontFamily: fonts.Poppins.medium,
        fontWeight: '600',
        fontSize: scale(14),
        fontStyle: 'normal',
        color: colors.c000000
    },
    Cap2: {
        fontFamily: fonts.Poppins.regular,
        fontWeight: '400',
        fontSize: scale(10),
        fontStyle: 'normal',
        color: colors.c000000
    },
    H3: {
        fontFamily: fonts.Poppins.semiBold,
        fontWeight: '600',
        fontSize: scale(32),
        fontStyle: 'normal',
        color: colors.c000000
    },
    H5: {
        fontFamily: fonts.Poppins.medium,
        fontWeight: '600',
        fontSize: scale(24),
        fontStyle: 'normal',
        color: colors.c000000
    },
    H6: {
        fontFamily: fonts.Poppins.medium,
        fontWeight: '600',
        fontSize: scale(20),
        fontStyle: 'normal',
        color: colors.c000000
    }
});

export {
    colors,
    fonts,
    images,
    textStyles,
    IconBack,
    IconMenuHome,
    IconMenuHomeActive,
    IconMenuStaking,
    IconMenuStakingActive,
    IconMenuNFT,
    IconMenuNFTActive,
    IconMenuMarket,
    IconMenuMarketActive,
    IconMenuSetting,
    IconMenuSettingActive,
    IconArrowLeft,
    IconArrowRight,
};
