import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  colors,
  textStyles,
  IconLogo,
  IconAbout,
  IconHandShake,
  IconSupport,
  IconDocument,
  IconProtection,
} from 'assets';
import { CHeader, CLayout, Col } from 'components';
import { scale } from 'device';
import { SettingMenu } from 'screens/settings/data';
import SettingMenuComponent from '../components/SettingMenuComponent';
import { CASPERDASH_URL, DOCS_URL, PRIVACY_URL, SUPPORT_URL, TERMS_URL } from 'utils/constants/key';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { useNavigateSimpleWebView } from 'utils/hooks/useNavigateSimpleWebView';

const AboutCasperDash = () => {
  const { navigateToWebView } = useNavigateSimpleWebView();
  const { data: configurations } = useConfigurations();

  const navigateTo = (url: string, title: string) => {
    navigateToWebView({
      url,
      title,
    });
  };

  let listMenu: Array<SettingMenu> = [
    {
      id: 1,
      title: 'Documentation',
      icon: () => <IconDocument />,
      onPress: () => navigateTo(configurations?.DOCS_URL || DOCS_URL, 'Documentation'),
    },
    {
      id: 2,
      title: 'Support',
      icon: () => <IconSupport />,
      onPress: () => {
        if (configurations?.SUPPORT_URL || SUPPORT_URL) {
          Linking.openURL(configurations?.SUPPORT_URL || SUPPORT_URL);
        }
      },
    },
    {
      id: 3,
      title: 'Terms of Use',
      icon: () => <IconHandShake style={{ width: scale(32), height: scale(32) }} />,
      onPress: () => navigateTo(configurations?.TERMS_URL || TERMS_URL, 'Terms of Use'),
    },
    {
      id: 4,
      title: 'Privacy Policy',
      icon: () => <IconProtection />,
      onPress: () => navigateTo(configurations?.PRIVACY_URL || PRIVACY_URL, 'Privacy Policy'),
    },
    {
      id: 5,
      title: 'About Us',
      icon: () => <IconAbout width={scale(32)} height={scale(32)} />,
      onPress: () => navigateTo(CASPERDASH_URL, 'About Us'),
    },
  ];

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'About CasperDash'} style={styles.header} />
      <View style={styles.container}>
        <View style={styles.information}>
          <View style={styles.logoWrapper}>
            <IconLogo width={scale(64)} height={scale(64)} />
          </View>
          <View style={styles.versionWrapper}>
            <Text>
              CasperDash v{DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
            </Text>
          </View>
        </View>
        <Col style={styles.col}>
          {listMenu
            .sort((a, b) => a.id - b.id)
            .map((item) => {
              return <SettingMenuComponent data={item} key={`setting-${item.id}`} />;
            })}
        </Col>
      </View>
    </CLayout>
  );
};

export default AboutCasperDash;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.cF8F8F8,
  },
  container: {
    marginTop: scale(10),
    paddingVertical: scale(24),
    flex: 1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    backgroundColor: colors.W1,
  },
  logoWrapper: {},
  information: {
    alignItems: 'center',
  },
  versionWrapper: {
    marginTop: scale(20),
  },
  col: {
    marginTop: scale(36),
  },
  title: {
    ...textStyles.Body1,
    color: colors.N2,
  },
});
