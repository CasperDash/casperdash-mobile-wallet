import React, { useRef, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { CInput, CLayout, CLoading } from 'components';
import { CHeader, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { Config, Keys } from 'utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useTokenInfo, useTokenInfoByPublicKey } from 'utils/hooks/useTokenInfo';
import { getPublicKey } from 'utils/selectors';

// TODO: recheck add custom token
function AddCustomTokenScreen() {
  const publicKey = useSelector(getPublicKey);
  const inputTokenAddress = useRef<string>('');
  const [tokenAddress, setTokenAddress] = useState('');
  const { goBack } = useNavigation<StackNavigationProp<any>>();
  const { refetch, error, isLoading, remove } = useTokenInfo(tokenAddress, { enabled: false });
  const { refreshTokenInfo } = useTokenInfoByPublicKey(publicKey);

  const onChange = (value?: string) => {
    inputTokenAddress.current = value ?? '';
    remove();
  };

  const onAddPublicKey = async () => {
    setTokenAddress(inputTokenAddress.current);
    const { data } = await refetch();
    if (data?.address) {
      let tokensAddressList = (await Config.getItem(Keys.tokensAddressList)) || [];
      const isExist = tokensAddressList.find((address: string) => address === data.address);
      if (!isExist) {
        tokensAddressList.push(data.address);
      }

      await Config.saveItem(Keys.tokensAddressList, tokensAddressList);
      refreshTokenInfo();
      goBack();
    }
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'Add Token'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={10} py={24} style={styles.container}>
        <Text style={styles.title}>Token Address</Text>
        <CInput
          placeholder={'Enter token address'}
          inputStyle={styles.input}
          onChangeText={onChange}
          style={styles.inputContainer}
        />
        <Text style={styles.errorText}>{error?.message}</Text>
        <CTextButton
          onPress={onAddPublicKey}
          disabled={!!error || !inputTokenAddress}
          style={styles.btnAdd}
          text={'Add'}
        />
      </Col>
      {isLoading && <CLoading />}
    </CLayout>
  );
}

export default AddCustomTokenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  title: {
    ...textStyles.Body1,
    color: colors.N3,
    marginBottom: scale(8),
    marginHorizontal: scale(24),
  },
  input: {
    ...textStyles.Body1,
    color: colors.N2,
  },
  btnAdd: {
    width: scale(327),
    alignSelf: 'center',
  },
  errorText: {
    ...textStyles.Body2,
    color: colors.R1,
    marginHorizontal: scale(24),
    marginBottom: scale(20),
  },
  inputContainer: {
    marginBottom: scale(6),
    paddingHorizontal: scale(24),
  },
});
