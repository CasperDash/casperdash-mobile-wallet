import React, { useContext } from 'react';
import { colors, textStyles } from 'assets';
import { DeployUtil } from 'casperdash-js-sdk';
import { scale } from 'device';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import BrowserContext from 'screens/browser/context';
import { useGetParsedDeployData } from 'screens/browser/hooks/useGetParsedDeployData';
import { SignDeployParams } from 'screens/browser/types/signing';
import { buildRawErrSender, buildRawSender } from 'screens/browser/utils/jsInjector';
import { useConnectedSite } from 'screens/browser/hooks/useConnectedSite';
import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import CTextButton from 'components/CTextButton';
import { useSignDeploy } from 'utils/hooks/useSignDeploy';
import { CButton } from 'components';

type Props = {
  onClose?: () => void;
  params: SignDeployParams;
};
const SignContent = ({ onClose, params }: Props) => {
  const browserRef = useContext(BrowserContext);
  const { connectedSite } = useConnectedSite();
  const { signAsync, isLoading } = useSignDeploy(connectedSite?.account?.walletInfo);

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

    const signedDeploy = await signAsync({
      deploy: deployFromJson.val,
      mainAccountHex: params.targetPublicKeyHex,
    });
    const jsScript = buildRawSender(RequestTypes.SIGN, JSON.stringify(signedDeploy));

    browserRef.current.injectJavaScript(jsScript);

    onClose?.();
  };

  const handleOnReject = () => {
    if (browserRef.current) {
      const jsScript = buildRawErrSender(RequestTypes.SIGN, 'User Cancelled Signing');
      browserRef.current.injectJavaScript(jsScript);
    }

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
            {parsedDeployData?.params.map((param) => (
              <View key={`param-${param.title}`}>
                <Text style={styles.caption}>{param.title}</Text>
                <Text style={styles.value}>{param.value}</Text>
              </View>
            ))}
          </View>
          <View>
            {parsedDeployData?.args.map((arg) => (
              <View key={`args-${arg.title}`}>
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
        <CButton onPress={handleOnApprove} style={[styles.button, styles.buttonPrimary]} disabled={isLoading}>
          {isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Approve</Text>}
        </CButton>
        <CTextButton text={'Reject'} variant={'primary'} type="line" onPress={handleOnReject} style={[styles.button]} />
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
  buttonText: {
    fontSize: scale(16),
    color: colors.W1,
    fontWeight: 'bold',
  },
});

export default SignContent;
