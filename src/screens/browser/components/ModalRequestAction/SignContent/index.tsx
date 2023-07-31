import React, { useContext } from 'react';
import { colors, textStyles } from 'assets';
import { DeployUtil } from 'casperdash-js-sdk';
import { scale } from 'device';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BrowserContext from 'screens/browser/context';
import { useGetParsedDeployData } from 'screens/browser/hooks/useGetParsedDeployData';
import { SignDeployParams } from 'screens/browser/types/signing';
import { buildRawSender } from 'screens/browser/utils/jsInjector';
import { useSignerWithWallet } from 'utils/hooks/useSignerWithUid';
import { useConnectedSite } from 'screens/browser/hooks/useConnectedSite';
import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import CTextButton from 'components/CTextButton';

type Props = {
  onClose?: () => void;
  params: SignDeployParams;
};
const SignContent = ({ onClose, params }: Props) => {
  const browserRef = useContext(BrowserContext);
  const { connectedSite } = useConnectedSite();
  const { sign } = useSignerWithWallet(connectedSite?.account?.walletInfo);

  const { data: parsedDeployData } = useGetParsedDeployData(params);

  const handleOnApprove = async () => {
    if (!browserRef.current) {
      return;
    }

    const deployFromJson = DeployUtil.deployFromJson(params.deploy);
    if (deployFromJson.err) {
      console.log('deployFromJson.err: ', deployFromJson.err);
      return;
    }

    const signedDeploy = await sign(deployFromJson.val, params.targetPublicKeyHex);
    const jsScript = buildRawSender(RequestTypes.SIGN, JSON.stringify(signedDeploy));

    browserRef.current.injectJavaScript(jsScript);

    onClose?.();
  };

  const handleOnReject = () => {
    if (!browserRef.current) return;

    onClose?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={textStyles.H5}>Sign Deploy</Text>
      </View>
      <View style={styles.body}>
        <ScrollView>
          <View>
            {parsedDeployData?.params.map((param, index) => (
              <View key={`param-${index}`}>
                <Text style={styles.caption}>{param.title}</Text>
                <Text style={styles.value}>{param.value}</Text>
              </View>
            ))}
          </View>
          <View>
            {parsedDeployData?.args.map((arg, index) => (
              <View key={`args-${index}`}>
                <Text style={styles.caption}>{arg.title}</Text>
                <Text style={styles.value} numberOfLines={3}>
                  {arg.value}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <CTextButton text={'Approve'} onPress={handleOnApprove} style={[styles.button, styles.buttonPrimary]} />
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
  buttonOutline: {
    borderRadius: scale(90),
    borderWidth: scale(1),
    borderColor: colors.c000000,
  },
});

export default SignContent;
