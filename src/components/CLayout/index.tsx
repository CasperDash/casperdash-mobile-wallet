import React from 'react';
import {StyleSheet, StatusBar, SafeAreaView, StatusBarStyle} from 'react-native';
import {colors} from 'assets';

type LProps = {
    children: React.ReactNode;
    bgColor?: string;
    statusBgColor?: string;
    barStyle?: StatusBarStyle,
};

const CLayout = ({children, bgColor, statusBgColor, barStyle = 'dark-content'}: LProps) => {
    return (
        <SafeAreaView
            style={[{backgroundColor: bgColor || colors.cFFFFFF}, styles.layout]}>
            <StatusBar
                animated
                backgroundColor={statusBgColor || colors.cFFFFFF}
                barStyle={barStyle}
            />
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    layout: {
        flex: 1,
    },
});

export default CLayout;
