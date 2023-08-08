import React, { useCallback } from 'react';
import { ActivityIndicator, Image, StyleSheet } from 'react-native';
import { CLayout, Col } from 'components';
import { images } from 'assets';
import Splash from 'react-native-splash-screen';
import { Config, Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { isEmpty } from 'lodash';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';
import { createAndStoreMasterPassword } from 'utils/helpers/account';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { JailbreakAlert } from './JailbreakAlert';
import { scale } from 'device';
import ReleaseNotes from './ReleaseNotes';

const SplashScreen = () => {
  const reStack = useRestack();
  const [isCheckVersionFinished, setIsCheckVersionFinished] = React.useState(false);

  const { isLoading } = useConfigurations();

  const setupNavigation = useCallback(async () => {
    const overview = await Config.getItem(Keys.overview);

    const casperDashInfo = await Config.getItem(Keys.casperdash);
    const legacyPin = await Config.getItem(Keys.pinCode);
    if (legacyPin) {
      await createAndStoreMasterPassword(legacyPin);
    }

    let screen = AuthenticationRouter.WELCOME_SCREEN;
    if (overview === 1 && !casperDashInfo) {
      screen = AuthenticationRouter.CREATE_NEW_WALLET;
    }

    if (!isEmpty(casperDashInfo)) {
      screen = AuthenticationRouter.ENTER_PIN;
    }

    reStack(StackName.AuthenticationStack, screen);
    Splash.hide();
  }, [reStack]);

  const onFinishJailBreakCheck = useCallback(() => {
    setupNavigation();
  }, [setupNavigation]);

  const onFinishReleaseNotes = useCallback(() => {
    setIsCheckVersionFinished(true);
    if (__DEV__) {
      setupNavigation();
    }
  }, [setupNavigation]);

  return (
    <CLayout>
      <Col style={styles.flex}>
        <Col.C style={styles.topContainer}>
          <Image source={images.logo} style={styles.logo} />
        </Col.C>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <ReleaseNotes onFinish={onFinishReleaseNotes} />
            {isCheckVersionFinished && !__DEV__ && <JailbreakAlert onFinish={onFinishJailBreakCheck} />}
          </>
        )}
      </Col>
    </CLayout>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topContainer: {
    width: '100%',
    height: '40%',
  },
  logo: {
    width: scale(124),
    height: scale(122),
  },
  flex: {
    flex: 1,
  },
});
