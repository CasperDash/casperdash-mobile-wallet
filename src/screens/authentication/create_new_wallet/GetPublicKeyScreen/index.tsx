import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'device';
import { textStyles } from 'assets';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { Config } from 'utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Keys from 'utils/keys';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { getLedgerPublicKey, getListKeys } from 'utils/services/ledgerServices';
import CasperApp from '@zondax/ledger-casper';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import Col from 'react-native-col';
import { ScrollView } from 'react-native-gesture-handler';
import KeyComponent from '../components/KeyComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { convertBalanceFromHex } from 'utils/helpers/balance';
const delay = (ms: number) => new Promise(success => setTimeout(success, ms));

interface Props {
  transport: any;
  setTransport: (transport: any) => void;
}

const GetPublicKeyScreen = ({ transport, setTransport }: Props) => {
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listKeys, setListKeys] = useState<any>([]);
  const [publicKey, setPublicKey] = useState<any>(null);

  const unmountRef = useRef<boolean>(false);
  const dispatch = useDispatch();
  const { replace } = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setupFetchAddress();
    return () => {
      unmountRef.current = true;
    };
  }, []);

  const setupFetchAddress = async () => {
    while (!publicKey) {
      if (unmountRef.current) {
        return;
      }
      await fetchAddress();
      await delay(700);
    }
    await fetchAddress();
  };

  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      const casperApp = new CasperApp(transport);
      const ledgerPublicKey = await getLedgerPublicKey(casperApp);
      if (unmountRef.current) {
        return;
      }
      if (ledgerPublicKey) {
        setError(null);
        setIsLoading(false);
        const keys = await getListKeys(casperApp, listKeys.length, 5);
        setIsLoading(true);
        dispatch(
          allActions.user.getAccounts(
            { publicKeys: keys },
            async (err: any, data: any) => {
              if (err) {
                setError(err);
                return;
              }

              if (!data || !data.length) {
                setListKeys(keys);
                return;
              }

              const keysWithBalance = keys.map(key => {
                const found = data.find(
                  (item: { publicKey: string }) =>
                    item.publicKey === key.publicKey,
                );
                const balance =
                  found && found.balance
                    ? convertBalanceFromHex(found.balance.hex)
                    : 0;
                return {
                  ...key,
                  balance,
                };
              });
              setIsLoading(false);
              setListKeys(keysWithBalance);
            },
          ),
        );
        unmountRef.current = true;
      } else {
        setTransport(null);
      }
    } catch (err) {
      if (unmountRef.current) {
        return;
      }
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountInformation = async (key: any) => {
    const { keyIndex } = key;
    const casperApp = new CasperApp(transport);
    const ledgerPublicKey = await getLedgerPublicKey(casperApp, keyIndex);
    setIsLoading(true);
    setPublicKey(ledgerPublicKey);
    dispatch(
      allActions.user.getAccountInformation(
        { publicKey: ledgerPublicKey },
        async (err: any, data: any) => {
          const notFundAccount =
            err && err.message && err.message.includes('ValueNotFound');
          if (data || notFundAccount) {
            await Config.saveItem(Keys.ledger, transport.device);
            const info = {
              publicKey: ledgerPublicKey,
              loginOptions: {
                connectionType: 'ledger',
                keyIndex,
              },
            };
            await Config.saveItem(Keys.casperdash, info);
            setIsLoading(false);
            replace(AuthenticationRouter.CHOOSE_PIN, {
              screen: ChoosePinRouter.CHOOSE_PIN_SCREEN,
              params: {
                showBack: false,
              },
            });
          } else {
            setIsLoading(false);
            setTransport(null);
            Config.alertMess(err);
          }
        },
      ),
    );
  };

  /**
   * Render the key component to display public key and index.
   */
  const _renderKeys = () => {
    const height = insets.bottom === 0 ? 0 : insets.bottom + scale(72);
    return (
      listKeys &&
      listKeys.length > 0 && (
        <Col
          style={[
            styles.listContainer,
            {
              paddingBottom: scale(72) + insets.bottom,
              minHeight: scale(315) + height,
            },
          ]}>
          {
            <>
              <Text style={styles.title}>Choose your key</Text>
              <ScrollView>
                {listKeys.map((ledgerKey: Array<object>, i: any) => {
                  return (
                    <KeyComponent
                      key={i}
                      onPress={getAccountInformation}
                      value={ledgerKey}
                    />
                  );
                })}
              </ScrollView>
            </>
          }
        </Col>
      )
    );
  };

  return (
    <View style={styles.ShowAddressScreen}>
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        !publicKey &&
        error && (
          <Text style={styles.error}>
            A problem occurred, make sure to open the Casper application on your
            Ledger Nano X. ({String((error && error.message) || error)})
          </Text>
        )
      )}
      {!isLoading && _renderKeys()}
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
