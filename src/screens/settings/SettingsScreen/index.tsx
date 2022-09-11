import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import {
  colors,
  IconAboutUs,
  IconCircleRight,
  IconLock,
  textStyles,
} from 'assets';
import { CHeader, CLayout, Col } from 'components';
import { scale } from 'device';
import { SettingMenu } from 'screens/settings/data';
import SettingMenuComponent from '../components/SettingMenuComponent';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { CASPERDASH_URL } from 'utils/constants/key';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';
import DeleteAllDataButton from '../components/DeleteAllDataButton';

function SettingsScreen() {
  const reStack = useRestack();

  const listMenu: Array<SettingMenu> = [
    {
      id: 0,
      title: 'About Us',
      icon: () => <IconAboutUs width={scale(32)} height={scale(32)} />,
      subIcon: () => <IconCircleRight width={scale(17)} height={scale(17)} />,
      onPress: () => openUrl(),
    },
    {
      id: 1,
      title: 'Lock',
      icon: () => <IconLock width={scale(32)} height={scale(32)} />,
      onPress: () => lockScreen(),
    },
  ];

  const openUrl = async () => {
    const supported = await Linking.canOpenURL(CASPERDASH_URL);
    if (supported) {
      await Linking.openURL(CASPERDASH_URL);
    }
  };

  const lockScreen = () => {
    resetStack(AuthenticationRouter.ENTER_PIN);
  };

  const resetStack = (name: string) => {
    reStack(StackName.AuthenticationStack, name);
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'Settings'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={10} py={24} style={styles.container}>
        {listMenu.map((item, index) => {
          return <SettingMenuComponent data={item} key={index} />;
        })}
        <DeleteAllDataButton />
      </Col>
    </CLayout>
  );
}

export default SettingsScreen;

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
    color: colors.N2,
  },
});
