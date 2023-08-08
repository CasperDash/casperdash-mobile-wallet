import React from 'react';
import { StyleSheet, Switch, Image, Text } from 'react-native';
import { colors, IconLogo, IconCircleRight, IconLock, textStyles, images } from 'assets';
import { CHeader, CLayout, Col } from 'components';
import DeviceInfo from 'react-native-device-info';
import { scale } from 'device';
import { SettingMenu } from 'screens/settings/data';
import SettingMenuComponent from '../components/SettingMenuComponent';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';
import DeleteAllDataButton from '../components/DeleteAllDataButton';
import useBiometry, { BiometryType } from 'utils/hooks/useBiometry';
import useShowRecoveryPhrase from '../ViewRecoveryPhraseScreen';
import { getLoginOptions } from 'utils/selectors/user';
import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { useNavigation } from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';

function SettingsScreen() {
  const { navigate } = useNavigation();
  const reStack = useRestack();
  const loginOptions = useSelector(getLoginOptions);

  const { ShowRecoveryPhrase, setShowConfirmPin } = useShowRecoveryPhrase();
  const { isBiometryEnabled, biometryType, onUpdateBiometryStatus } = useBiometry();

  const lockScreen = () => {
    resetStack(AuthenticationRouter.ENTER_PIN);
  };

  const resetStack = (name: string) => {
    reStack(StackName.AuthenticationStack, name);
  };

  let listMenu: Array<SettingMenu> = [
    {
      id: 1,
      title: 'About CasperDash',
      icon: () => <IconLogo width={scale(32)} height={scale(32)} />,
      subIcon: () => <IconCircleRight width={scale(17)} height={scale(17)} />,
      onPress: () => navigate(MainRouter.ABOUT_CASPERDASH),
    },
    {
      id: 2,
      title: 'Lock',
      icon: () => <IconLock width={scale(32)} height={scale(32)} />,
      onPress: () => lockScreen(),
    },
    {
      id: 3,
      title: 'Recovery Phrase',
      icon: () => <Image source={images.backup} style={{ width: scale(32), height: scale(32) }} />,
      onPress: () => setShowConfirmPin(true),
      actionComp: ShowRecoveryPhrase,
      show: loginOptions?.connectionType === CONNECTION_TYPES.passPhase,
    },
    {
      id: 4,
      title: 'Version',
      icon: () => <Image source={images.version} style={{ width: scale(32), height: scale(32) }} />,
      actionComp: () => (
        <Text>
          {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
        </Text>
      ),
    },
  ];

  if (biometryType) {
    listMenu.push({
      id: 1,
      title: biometryType,
      icon: () => (
        <Image
          source={biometryType === BiometryType.FaceID ? images.faceId : images.touchId}
          style={{ width: scale(32), height: scale(32) }}
        />
      ),

      actionComp: () => <Switch value={isBiometryEnabled} onValueChange={onUpdateBiometryStatus} />,
    });
  }

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'Settings'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={10} py={24} style={styles.container}>
        {listMenu
          .filter((menu) => menu.show !== false)
          .sort((a, b) => a.id - b.id)
          .map((item, index) => {
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
