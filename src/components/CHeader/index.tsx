import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { colors, IconBack, textStyles } from 'assets';
import { scale } from 'device';

type Props = {
  title: any;
  showBack?: boolean;
  onBack?: () => void;
  renderRight?: any;
  onPressRight?: () => void;
  titleStyle?: TextStyle;
  style?: ViewStyle;
};

const CHeader = ({ title, showBack = true, onBack, renderRight, onPressRight, titleStyle, style }: Props) => {
  const navigation = useNavigation();
  const goBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.headerContainer, style]}>
      {showBack && (
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 10, left: 20, right: 30 }}
          onPress={goBack}
          style={styles.btnGoBack}
        >
          <IconBack width={scale(20)} height={scale(17)} style={styles.icon} />
        </TouchableOpacity>
      )}
      <View style={styles.emptyView} />
      <View
        style={[
          styles.titleHeaderContainer,
          {
            maxWidth: renderRight ? scale(375 - 24 * 2 - 20 * 2 - 45) : scale(375 - 24 * 2 - 20 * 2),
          },
        ]}
      >
        <Text numberOfLines={1} style={[styles.titleHeader, titleStyle]}>
          {title}
        </Text>
      </View>
      <View style={styles.emptyView} />
      {renderRight && (
        <TouchableOpacity style={styles.btnRight} onPress={onPressRight}>
          {renderRight()}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: scale(56),
    backgroundColor: colors.cFFFFFF,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnGoBack: {
    position: 'absolute',
    left: scale(25),
    zIndex: 1,
  },
  icon: {},
  titleHeaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: scale(375 - 25 * 2 - 20 * 2),
    paddingTop: scale(2),
  },
  titleHeader: {
    ...textStyles.H5,
    textAlign: 'center',
    paddingRight: 0,
    fontSize: scale(24),
    color: colors.N2,
  },
  emptyView: {
    width: scale(52),
    height: 10,
  },
  btnRight: {
    width: scale(45),
    height: scale(56),
    right: scale(25),
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default CHeader;
