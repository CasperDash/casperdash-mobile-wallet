import React, { useRef, useState } from 'react';
import { StyleSheet, Linking, Text } from 'react-native';
import {
  colors,
  IconAboutUs,
  IconCircleRight,
  IconLock,
  textStyles,
  fonts,
} from 'assets';
import { CAlert, CButton, CHeader, CLayout, Col } from 'components';
import { scale } from 'device';
import { SettingMenu } from 'screens/settings/data';
import SettingMenuComponent from '../components/SettingMenuComponent';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { Config, Keys } from 'utils';
import { CASPERDASH_URL } from 'utils/constants/key';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import CConfirmPinModal from 'components/CConfirmPinModal';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';

function SettingsScreen() {
  const alertRef = useRef<any>();
  const dispatch = useDispatch();
  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);
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

  const onPressNext = () => {
    alertRef.current.hide();
    setShowConfirmPin(true);
  };

  const onDeleteAllData = () => {
    const alert = {
      buttonRight: 'Next',
      alertMessage: (
        <>
          <Text style={styles.deleteQuestion}>
            Are you sure you want to delete your wallet ?
          </Text>
          <Text style={styles.deleteMessage}>
            Your current wallet, accounts and assets will be removed from this
            app permanently. This action cannot be undone.
          </Text>
          <Text style={styles.deleteMessage}>
            Your can ONLY recover this wallet with your Secret Recovery Phase
            CasperDash does not have your Secret Recovery Phase.
          </Text>
        </>
      ),
    };
    alertRef.current.show(alert);
  };

  const deleteAllData = () => {
    Promise.all(
      Object.entries(Keys).map(key => {
        return Config.deleteItem(key[1]);
      }),
    ).then(async () => {
      dispatch(allActions.main.clearAllData());
      setShowConfirmPin(false);
      resetStack(AuthenticationRouter.CREATE_NEW_WALLET);
    });
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
        <CButton onPress={onDeleteAllData} style={styles.btnDelete}>
          <Text style={styles.txtDelete}>Delete All Data</Text>
        </CButton>
      </Col>
      {!showConfirmPin ? (
        <CAlert ref={alertRef} onConfirm={onPressNext} />
      ) : (
        <CConfirmPinModal
          isShow={showConfirmPin}
          onConfirm={deleteAllData}
          onCancel={() => setShowConfirmPin(false)}
        />
      )}
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
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  deleteMessage: {
    textAlign: 'center',
    fontSize: scale(16),
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  deleteQuestion: {
    color: colors.R1,
    fontWeight: '800',
    fontSize: scale(20),
    textAlign: 'center',
    marginBottom: scale(20),
  },
});
