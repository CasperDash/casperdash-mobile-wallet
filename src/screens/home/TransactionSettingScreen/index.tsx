import React, { useRef, useState } from 'react';
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
  const [transactionDeadline, setTransactionDeadline] = useState<string>('');
  const percentRef = useRef<any>();

  const onChangeText = (text: string, rawText?: string) => {
    if (rawText && parseFloat(rawText) >= 100) {
      setSelectedItem('100.0');
      return;
    }
    setSelectedItem(text);
  };

  const onChangeTransactionDeadline = (text: string, rawText?: string) => {
    if (rawText && parseFloat(rawText) >= 60) {
      setTransactionDeadline('60');
      return;
    }
    setTransactionDeadline(text);
  };

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
          <Text style={styles.title}>Slippage Tolerance (%)</Text>
          <Row style={styles.rowItems}>
            {listSlippageTolerance.map((item, index) => {
              return (
                <SlippageToleranceItem
                  item={item}
                  isSelected={selectedItem === item}
                  onSelect={onChangeText}
                  key={index}
                />
              );
            })}
          </Row>
          <TextInputMask
            ref={percentRef}
            type={'money'}
            value={selectedItem}
            options={{
              precision: 1,
              separator: '.',
              delimiter: ',',
              unit: '',
            }}
            includeRawValueInChangeText={true}
            style={styles.input}
            onChangeText={onChangeText}
          />
          <Text style={styles.title}>Transaction Deadline (Minutes)</Text>
          <TextInputMask
            ref={percentRef}
            type={'custom'}
            options={{
              mask: '99',
            }}
            keyboardType={'numeric'}
            value={transactionDeadline}
            style={styles.input}
            includeRawValueInChangeText={true}
            onChangeText={onChangeTransactionDeadline}
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
    paddingVertical: 0,
    textAlignVertical: 'center',
    paddingRight: 0,
    paddingLeft: scale(20),
    minWidth: scale(90),
    borderRadius: scale(16),
    backgroundColor: colors.N5,
    fontFamily: fonts.Poppins.regular,
    color: colors.c000000,
    fontSize: scale(18),
  },
});
