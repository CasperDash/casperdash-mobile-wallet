import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import { CHeader, CLayout, CLoading, Col } from 'components';
import { colors, fonts, textStyles } from 'assets';
import { scale } from 'device';
// @ts-ignore
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Config, Keys } from 'utils';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import {
  EncryptionType,
  IWallet,
  User,
  ValidationResult,
} from 'casper-storage';
import { WalletDescriptor } from 'casper-storage/dist/tsc/user/wallet-info';
import { IHDKey } from 'casper-storage/src/bips/bip32';

const ConfirmPinScreen: React.FC<
  // @ts-ignore
  ScreenProps<ChoosePinRouter.CONFIRM_PIN_SCREEN>
> = ({ route }) => {
  const { pin, phrases } = route.params;
  const [pinConfirm, setPinConfirm] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();
  const pinLength = 6;

  const onTextChange = async (text: string) => {
    setPinConfirm(text);
    if (text && pin && pin === text) {
      await setupUser(text);
    }
  };

  const setupUser = async (txtConfirmPin: string) => {
    try {
      setLoading(true);

      const user = new User(pin, {
        passwordOptions: {
          // @ts-ignore
          passwordValidator: () => new ValidationResult(true),
        },
      });

      user.setHDWallet(phrases, EncryptionType.Ed25519);
      const acc0: IWallet<IHDKey> = await user.getWalletAccount(0);
      user.setWalletInfo(
        acc0.getReferenceKey(),
        new WalletDescriptor('Account 1'),
      );
      const publicKey = await acc0.getPublicAddress();
      const hashingOptions = user.getPasswordHashingOptions();
      dispatch(
        allActions.user.getAccountInformation(
          { publicKey },
          async (err: any, res: any) => {
            if (res) {
              setLoading(false);
              const userInfo = user.serialize();
              const info = {
                publicKey: publicKey,
                loginOptions: {
                  connectionType: 'passphase',
                  passphase: phrases,
                  hashingOptions: hashingOptions,
                },
                userInfo: userInfo,
              };
              await Config.saveItem(Keys.casperdash, info);
              await Config.saveItem(Keys.pinCode, txtConfirmPin);

              const wallets = user.getHDWallet()?.derivedWallets || [];
              const selectedWallet = wallets[0];
              await Config.saveItem(Keys.selectedWallet, selectedWallet);

              navigation.dispatch(
                CommonActions.reset({
                  routes: [
                    {
                      name: 'MainStack',
                    },
                  ],
                }),
              );

              dispatch(allActions.main.loadLocalStorage());
              const message = {
                message: 'Logged in successfully',
                type: MessageType.success,
              };
              dispatch(allActions.main.showMessage(message));
            } else {
              setLoading(false);
              Config.alertMess(err);
            }
          },
        ),
      );
    } catch (e: any) {
      setLoading(false);
      const message = {
        message: e && e.message ? e.message : 'Error',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message, 10000));
    }
  };

  return (
    <CLayout>
      <CHeader title={'Confirm PIN'} />
      <Col.C mt={78}>
        <Text style={styles.title}>Confirm security PIN</Text>
        <SmoothPinCodeInput
          placeholder={<View style={styles.pinPlaceholder} />}
          mask={
            <View
              style={[styles.pinPlaceholder, { backgroundColor: colors.R1 }]}
            />
          }
          maskDelay={500}
          password
          cellStyle={null}
          keyboardType={'number-pad'}
          autoFocus
          value={pinConfirm}
          codeLength={pinLength}
          cellSpacing={0}
          restrictToNumbers
          cellStyleFocused={null}
          onTextChange={onTextChange}
          textStyle={styles.textStyle}
        />
        {!!pinConfirm &&
          !!pin &&
          pinConfirm.length === 6 &&
          pinConfirm !== pin && (
            <Text
              style={[
                styles.title,
                { color: colors.R1, marginTop: scale(20) },
              ]}>
              Incorrect PIN code
            </Text>
          )}
      </Col.C>
      {isLoading && <CLoading />}
    </CLayout>
  );
};

export default ConfirmPinScreen;

const styles = StyleSheet.create({
  title: {
    ...textStyles.Body1,
    color: colors.c232635,
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  pinPlaceholder: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: colors.cFFFFFF,
    borderColor: colors.R1,
    borderWidth: scale(1),
  },
  textStyle: {
    color: colors.N1,
    fontSize: scale(20),
    fontFamily: fonts.Lato.regular,
  },
});
