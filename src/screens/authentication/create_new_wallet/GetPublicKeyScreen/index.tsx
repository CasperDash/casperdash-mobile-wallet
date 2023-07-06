import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'device';
import { textStyles } from 'assets';
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
import CLoading from 'components/CLoading';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { useListAccountInfo } from 'utils/hooks/useAccountInfo';

const delay = (ms: number) => new Promise((success) => setTimeout(success, ms));

interface Props {
  transport: any;
  setTransport: (transport: any) => void;
}

const GetPublicKeyScreen = ({ transport, setTransport }: Props) => {
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingKeys, setLoadingKeys] = useState<{ publicKey: string; keyIndex: number }[]>([]);
  const [publicKey, setPublicKey] = useState<string>();

  const { massagedData: listKeys } = useListAccountInfo(loadingKeys.map((key) => key.publicKey));

  const unmountRef = useRef<boolean>(false);
  const { replace } = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setupFetchAddress();
    return () => {
      unmountRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const casperApp = new CasperApp(transport);
      const ledgerPublicKey = await getLedgerPublicKey(casperApp);
      if (unmountRef.current) {
        return;
      }
      setIsLoading(true);
      if (ledgerPublicKey) {
        setError(null);
        const keys = await getListKeys(casperApp, listKeys.length, 5);
        setLoadingKeys(keys);

        unmountRef.current = true;
      } else {
        setTransport(null);
      }
    } catch (err) {
      setIsLoading(false);
      if (unmountRef.current) {
        return;
      }
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountInformation = async (key: any): Promise<void> => {
    const keyIndex = loadingKeys.find((item) => item.publicKey === key.publicKey)?.keyIndex;
    const casperApp = new CasperApp(transport);
    const ledgerPublicKey = await getLedgerPublicKey(casperApp, keyIndex);
    setIsLoading(true);
    setPublicKey(ledgerPublicKey);

    await Config.saveItem(Keys.ledger, transport.device);
    const info = {
      publicKey: ledgerPublicKey,
      loginOptions: {
        connectionType: CONNECTION_TYPES.ledger,
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
          ]}
        >
          {
            <>
              <Text style={styles.title}>Choose your key</Text>
              <ScrollView>
                {listKeys.map((ledgerKey, i: number) => {
                  return (
                    <KeyComponent
                      key={ledgerKey.publicKey}
                      onPress={getAccountInformation}
                      value={ledgerKey}
                      index={i}
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
        <CLoading />
      ) : (
        !publicKey &&
        error && (
          <Text style={styles.error}>
            A problem occurred, make sure to open the Casper application on your Ledger Nano X. (
            {String((error && error.message) || error)})
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
