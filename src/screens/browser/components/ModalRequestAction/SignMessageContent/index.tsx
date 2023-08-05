import { colors, textStyles } from 'assets';
import { CButton } from 'components';
import CTextButton from 'components/CTextButton';
import { scale } from 'device';
import _ from 'lodash';
import React, { useContext } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import BrowserContext from 'screens/browser/context';
import { useConnectedSite } from 'screens/browser/hooks/useConnectedSite';
import { SignMessageParams } from 'screens/browser/types/signing';
import { buildRawErrSender, buildRawSender } from 'screens/browser/utils/jsInjector';
import { useSignMessage } from 'utils/hooks/useSignMessage';

type Props = {
  onClose?: () => void;
  params: SignMessageParams;
};
const SignMessageContent = ({ onClose, params }: Props) => {
  const browserRef = useContext(BrowserContext);
  const { connectedSite } = useConnectedSite();
  const { signMessageAsync, isLoading } = useSignMessage(connectedSite?.account?.walletInfo);

  const handleOnApprove = async () => {
    if (!browserRef.current) return;

    const signedMessage = await signMessageAsync({
      message: params.message,
    });

    const jsScript = buildRawSender(RequestTypes.SIGN_MESSAGE, `'${signedMessage}'`);

    browserRef.current.injectJavaScript(jsScript);

    onClose?.();
  };

  const handleOnReject = () => {
    if (browserRef.current) {
      const jsScript = buildRawErrSender(RequestTypes.SIGN_MESSAGE, 'User Cancelled Signing');
      browserRef.current.injectJavaScript(jsScript);
    }

    onClose?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={textStyles.H5}>Sign Message</Text>
      </View>
      <View style={styles.body}>
        <ScrollView>
          <View>
            <Text style={styles.caption}>
              Public Key ({_.get(connectedSite, 'account.walletInfo.descriptor.name', 'Unknown')})
            </Text>
            <Text style={styles.value}>{connectedSite?.account?.publicKey}</Text>
          </View>
          <View>
            <Text style={styles.caption}>Message</Text>
            <Text style={styles.value}>{params.message}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <CButton onPress={handleOnApprove} style={[styles.button, styles.buttonPrimary]} disabled={isLoading}>
          {isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Approve</Text>}
        </CButton>
        <CTextButton
          text={'Reject'}
          type="line"
          onPress={handleOnReject}
          style={[styles.button, styles.buttonOutline]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    gap: scale(20),
    justifyContent: 'space-between',
    paddingVertical: scale(40),
  },
  caption: {
    ...textStyles.Sub2,
    color: colors.N3,
  },
  value: {
    ...textStyles.Sub2,
    color: colors.N2,
    marginTop: scale(5),
    marginBottom: scale(16),
  },
  header: {
    marginTop: scale(20),
    alignItems: 'center',
  },
  body: {
    padding: scale(20),
    flex: 1,
  },
  footer: {
    flexBasis: scale(40),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: scale(140),
    height: scale(40),
    borderRadius: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.R1,
  },
  buttonOutline: {},
  buttonText: {
    fontSize: scale(16),
    color: colors.W1,
    fontWeight: 'bold',
  },
});
export default SignMessageContent;
