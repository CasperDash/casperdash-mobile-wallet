import { colors, IconArrowDown, textStyles } from 'assets';
import { CHeader, CLayout, Col } from 'components';
import { scale } from 'device';
import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ValidatorScreen() {
  const insets = useSafeAreaInsets();

  const [data, setData] = useState([]);

  useEffect(() => {}, []);

  return (
    <CLayout
      statusBgColor={colors.cF8F8F8}
      edges={['right', 'top', 'left']}
      bgColor={colors.cF8F8F8}>
      <CHeader title={'Select Validator'} style={styles.headerContainer} />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={{ paddingHorizontal: scale(16) }}>
            <Text style={styles.title}>Validator</Text>
            <View style={styles.slectValidator}>
              <Text style={styles.nameValidator}>Enter Validator</Text>
              <IconArrowDown />
            </View>
          </View>
          <View style={styles.validatorlist}>
            <Text style={styles.title}>Validator List ({data.length})</Text>
          </View>
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
}

export default ValidatorScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.cFFFFFF,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },

  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginTop: scale(24),
    marginBottom: scale(16),
  },
  headerContainer: {
    backgroundColor: colors.N5,
    justifyContent: 'flex-start',
    paddingLeft: scale(24),
  },
  slectValidator: {
    backgroundColor: colors.N5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(9),
    borderRadius: scale(16),
    marginBottom: scale(32),
  },
  nameValidator: {
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
  },
  validatorlist: {
    borderTopColor: colors.N5,
    borderTopWidth: 2,
    paddingHorizontal: scale(16) 
  },
});
