import React from 'react';
import { StyleSheet, StatusBar, StatusBarStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from 'assets';

type LProps = {
  children: React.ReactNode;
  bgColor?: string;
  statusBgColor?: string;
  barStyle?: StatusBarStyle;
  edges?: any;
};

const defaultEdges = ['right', 'top', 'left', 'bottom'];

const CLayout = ({ children, bgColor, statusBgColor, barStyle = 'dark-content', edges = defaultEdges }: LProps) => {
  return (
    <SafeAreaView edges={edges} style={[{ backgroundColor: bgColor || colors.cFFFFFF }, styles.layout]}>
      <StatusBar animated backgroundColor={statusBgColor || colors.cFFFFFF} barStyle={barStyle} />
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
