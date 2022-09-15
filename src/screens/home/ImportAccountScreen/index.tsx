import React, { useState } from 'react';
import { Text, StyleSheet, Keyboard } from 'react-native';
import { CHeader, Col, Row, CInput, CLayout, CLoading } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { allActions } from 'redux_manager';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MessageType } from 'components/CMessge/types';
import { KeyParser, CasperLegacyWallet, User, WalletDescriptor } from 'react-native-casper-storage';
import { Config, Keys } from 'utils';

function ImportAccountScreen() {
  const [secretKey, setSecretKey] = useState('');
  const [name, setName] = useState('');
  const { goBack } = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const currentAccount = useSelector<any, User>(
    (state: any) => state.user.currentAccount,
  );
  const casperdash = useSelector((state: any) => state.main.casperdash || {});

  const onChange = (value?: string) => {
    setSecretKey(value ?? '');
  };

  const onAddPrivateKey = async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);

      const keyParser = KeyParser.getInstance();
      const keyValue = keyParser.convertPEMToPrivateKey(secretKey);
      const wallet = new CasperLegacyWallet(
        keyValue.key,
        keyValue.encryptionType,
      );

      currentAccount?.addLegacyWallet(wallet, new WalletDescriptor(name));
      const userInfo = await currentAccount.serialize(false);

      const publicKey = await wallet.getPublicKey();
      const info = {
        ...casperdash,
        userInfo: userInfo,
        publicKey: publicKey,
      };

      await Config.saveItem(Keys.casperdash, info);
      const walletInfo = currentAccount.getWalletInfo(wallet.getReferenceKey());

      const selectedWalletDetails = {
        walletInfo: {
          descriptor: walletInfo.descriptor,
          encryptionType: walletInfo.encryptionType,
          uid: walletInfo.uid,
        },
        publicKey,
      };

      await Config.saveItem(Keys.selectedWallet, selectedWalletDetails);
      setLoading(false);
      dispatch(allActions.user.loadSelectedWalletFromStorage());
      dispatch(allActions.main.loadLocalStorage());

      const message = {
        message: 'Success',
        type: MessageType.success,
      };
      dispatch(allActions.main.showMessage(message, 1000));

      goBack();
    } catch (e) {
      setLoading(false);
      const message = {
        message: 'Invalid secret key',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message, 1000));
    }
  };

  return (
    <CLayout
      bgColor={colors.cF8F8F8}
      edges={['top', 'left', 'right']}
      statusBgColor={colors.cF8F8F8}>
      <CHeader
        title={'Import Account'}
        style={{ backgroundColor: colors.cF8F8F8 }}
      />
      <Col mt={10} py={24} style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
          <Text style={[styles.title, { marginTop: scale(16) }]}>Name</Text>
          <CInput
            placeholder={'Enter name'}
            inputStyle={styles.input}
            onChangeText={setName}
            style={styles.inputContainer}
          />
          <Text style={styles.title}>Secret Key</Text>
          <CInput
            placeholder={'Enter your secret key'}
            inputStyle={[styles.input, { height: scale(120) }]}
            onChangeText={onChange}
            multiline
            value={secretKey}
            style={styles.inputContainer}
          />

          <Row.LR px={24} mt={60}>
            <CTextButton
              onPress={goBack}
              style={styles.btnAdd}
              text={'Cancel'}
              type={'line'}
              variant="secondary"
            />
            <CTextButton
              onPress={onAddPrivateKey}
              disabled={!secretKey || !name}
              style={styles.btnAdd}
              text={'Import'}
            />
          </Row.LR>
        </KeyboardAwareScrollView>
      </Col>
      {isLoading && <CLoading />}
    </CLayout>
  );
}

export default ImportAccountScreen;

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
    width: scale(154),
    alignSelf: 'center',
  },
  errorText: {
    ...textStyles.Body2,
    color: colors.R1,
    marginHorizontal: scale(24),
  },
  inputContainer: {
    marginBottom: scale(6),
    paddingHorizontal: scale(24),
  },
});
