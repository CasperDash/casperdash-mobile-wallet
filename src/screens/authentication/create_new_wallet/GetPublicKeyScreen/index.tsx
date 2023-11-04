import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'device';
import { textStyles } from 'assets';
import { Config } from 'utils';
import Keys from 'utils/keys';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import Col from 'react-native-col';
import { ScrollView } from 'react-native-gesture-handler';
import KeyComponent from '../components/KeyComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CLoading from 'components/CLoading';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { IAccountInfo, useLedgerAccounts } from 'utils/hooks/useAccountInfo';
import CTextButton from 'components/CTextButton';
import { setSelectedWallet } from 'utils/helpers/account';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import MainRouter from 'navigation/stack/MainRouter';

const GetPublicKeyScreen = ({ device }: { device: any }) => {
  const [error, setError] = useState<any>();

  const { mergedData, isLoading, fetchNextPage, isFetching } = useLedgerAccounts(
    { startIndex: 0, numberOfKeys: 5 },
    {
      onError: (err) => {
        if (!mergedData.length) setError(err);
      },
      retry: 1,
    },
  );

  const { replace } = useStackNavigation();
  const insets = useSafeAreaInsets();

  const onSelectKey = async (wallet: IAccountInfo): Promise<void> => {
    // get casperdash data info
    const casperDashData = await Config.getItem(Keys.casperdash);
    // if not exist, save ledger info and go to choose pin screen
    if (!casperDashData) {
      const info = {
        publicKey: wallet.publicKey,
        loginOptions: {
          connectionType: CONNECTION_TYPES.ledger,
          keyIndex: wallet.ledgerKeyIndex,
        },
      };
      await Config.saveItem(Keys.casperdash, info);
      await Config.saveItem<IAccountInfo[]>(Keys.ledgerWallets, [{ ...wallet, ledgerDeviceId: device.id }]);
      await setSelectedWallet(wallet);

      replace(AuthenticationRouter.CHOOSE_PIN, {
        screen: ChoosePinRouter.CHOOSE_PIN_SCREEN,
        params: {
          showBack: false,
        },
      });
      // if exist, add ledger account to list and go to accounts screen
    } else {
      const ledgerWallets: IAccountInfo[] = (await Config.getItem(Keys.ledgerWallets)) || [];
      const found = ledgerWallets.find((item) => item.publicKey === wallet.publicKey);
      if (!found) {
        ledgerWallets.push({ ...wallet, ledgerDeviceId: device.id });
        await Config.saveItem(Keys.ledgerWallets, ledgerWallets);
      }
      replace(MainRouter.ACCOUNT_LIST_SCREEN);
    }
  };

  /**
   * Render the key component to display public key and index.
   */
  const renderKeys = () => {
    const height = insets.bottom === 0 ? 0 : insets.bottom + scale(72);
    return (
      mergedData?.length > 0 && (
        <Col
          style={[
            styles.listContainer,
            {
              minHeight: scale(315) + height,
            },
          ]}
        >
          {
            <>
              <Text style={styles.title}>Choose your key</Text>
              <ScrollView>
                {mergedData.map((ledgerKey) => {
                  return <KeyComponent key={ledgerKey.publicKey} onPress={onSelectKey} value={ledgerKey} />;
                })}
              </ScrollView>
              <CTextButton text={'Load more'} onPress={fetchNextPage} />
            </>
          }
        </Col>
      )
    );
  };

  return (
    <View style={styles.ShowAddressScreen}>
      {(isLoading || isFetching) && <CLoading />}
      {error && !mergedData.length ? (
        <Text style={styles.error}>
          A problem occurred, make sure to open the Casper application on your Ledger Nano X. (
          {String((error && error.message) || error)})
        </Text>
      ) : (
        renderKeys()
      )}
    </View>
  );
};

export default GetPublicKeyScreen;

const styles = StyleSheet.create({
  listContainer: {},
  ShowAddressScreen: {
    flex: 1,
    padding: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...textStyles.Sub1,
    color: '#c00',
    marginBottom: scale(16),
  },
  loading: {
    ...textStyles.Sub1,
    color: '#999',
    fontSize: scale(16),
  },
  title: {
    fontSize: scale(16),
    marginBottom: scale(16),
  },
  address: {
    marginTop: scale(16),
    color: '#555',
    fontSize: scale(14),
  },
});
