import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, textStyles } from 'assets';
import { CHeader, Col, CLayout, Row, CInput } from 'components';
import { scale } from 'device';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SlippageToleranceItem from 'screens/home/TransactionSettingScreen/SlippageToleranceItem';
import { TextInputMask } from 'react-native-masked-text';

const listSlippageTolerance = ['0.1', '0.5', '1.0'];

const TransactionSettingScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const [selectedItem, setSelectedItem] = useState<string>('');
  console.log('selectedItem', selectedItem);
  return (
    <CLayout
      statusBgColor={colors.cF8F8F8}
      edges={['right', 'top', 'left']}
      bgColor={colors.cF8F8F8}>
      <CHeader
        title={'Transaction Setting'}
        style={{ backgroundColor: colors.cF8F8F8 }}
      />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainerStyle,
            { paddingBottom: bottom + scale(20) },
          ]}>
          <Text style={styles.title}>Slippage Tolerance</Text>
          <Row style={styles.rowItems}>
            {listSlippageTolerance.map((item, index) => {
              return (
                <SlippageToleranceItem
                  item={item}
                  isSelected={selectedItem === item}
                  onSelect={setSelectedItem}
                  key={index}
                />
              );
            })}
          </Row>
          <TextInputMask
            type={'custom'}
            value={selectedItem}
            options={{
              precision: 1,
              separator: ',',
              delimiter: '.',
              suffixUnit: '%',
              unit: '',
              mask: '999 AAA SSS',
            }}
            style={styles.input}
            onChangeText={setSelectedItem}
          />
          <Text style={styles.title}>Transaction Deadline</Text>
          <TextInputMask
            type={'custom'}
            value={selectedItem}
            options={{
              precision: 1,
              separator: ',',
              delimiter: '.',
              suffixUnit: 'Minutes',
              unit: '',
              mask: '999 AAA SSS',
            }}
            style={styles.input}
            onChangeText={setSelectedItem}
          />
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
};

export default TransactionSettingScreen;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    backgroundColor: colors.W1,
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginTop: scale(24),
    marginBottom: scale(16),
  },
  rowItems: {
    flexWrap: 'wrap',
  },
  input: {
    height: scale(48),
    flex: 1,
    fontFamily: fonts.Poppins.regular,
    color: colors.c000000,
    paddingVertical: 0,
    fontSize: scale(18),
    textAlignVertical: 'center',
    paddingHorizontal: scale(16),
    borderRadius: scale(16),
    backgroundColor: colors.N5,
  },
});
