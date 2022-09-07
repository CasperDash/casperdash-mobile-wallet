import React, { useRef } from 'react';
import { StyleSheet, Linking, Text } from 'react-native';
import {
  colors,
  IconAboutUs,
  IconCircleRight,
  IconLock,
  textStyles,
} from 'assets';
import { CAlert, CButton, CHeader, CLayout, Col } from 'components';
import { scale } from 'device';
import { SettingMenu } from 'screens/settings/data';
import SettingMenuComponent from '../components/SettingMenuComponent';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { Config, Keys } from 'utils';
import { CASPERDASH_URL } from 'utils/constants/key';

function SettingsScreen() {
  const navigation = useNavigation();
  const alertRef = useRef<any>();

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

  const onDeleteAllData = () => {
    const alert = {
      alertMessage: 'Are you sure you want to \n Delete All Data?',
    };
    alertRef.current.show(alert);
  };

  const deleteAllData = () => {
    Promise.all(
      Object.entries(Keys).map(key => {
        return Config.deleteItem(key[1]);
      }),
    ).then(async () => {
      resetStack(AuthenticationRouter.CREATE_NEW_WALLET);
    });
  };

  const resetStack = (name: string) => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: 'AuthenticationStack',
            state: {
              routes: [
                {
                  name: name,
                },
              ],
            },
          },
        ],
      }),
    );
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'Settings'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={10} py={24} style={styles.container}>
        {listMenu.map((item, index) => {
          return <SettingMenuComponent data={item} key={index} />;
        })}
        <CButton onPress={onDeleteAllData} style={styles.btnDelete}>
          <Text style={styles.txtDelete}>Delete All Data</Text>
        </CButton>
      </Col>
      <CAlert ref={alertRef} onConfirm={deleteAllData} />
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
  btnDelete: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(16),
    minWidth: scale(134),
    height: scale(36),
    borderRadius: scale(18),
    borderWidth: scale(1),
    borderColor: colors.N4,
    alignSelf: 'center',
    marginTop: scale(70),
  },
  txtDelete: {
    ...textStyles.Body2,
  },
});
