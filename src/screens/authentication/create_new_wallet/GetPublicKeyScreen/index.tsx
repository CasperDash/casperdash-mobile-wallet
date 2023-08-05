import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'device';
import { textStyles } from 'assets';
import { Config } from 'utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Keys from 'utils/keys';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import Col from 'react-native-col';
import { ScrollView } from 'react-native-gesture-handler';
import KeyComponent from '../components/KeyComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CLoading from 'components/CLoading';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { LedgerAccountInfo, useLedgerAccounts } from 'utils/hooks/useAccountInfo';
import CTextButton from 'components/CTextButton';
import Toast from 'react-native-toast-message';

interface Props {}

const GetPublicKeyScreen = ({}: Props) => {
  const [error, setError] = useState<any>();

  const { mergedData, isLoading, fetchNextPage, isFetching } = useLedgerAccounts(
    { startIndex: 0, numberOfKeys: 5 },
    {
      onError: (err) =>
        mergedData.length
          ? Toast.show({
              type: 'error',
              text1: 'Oops!',
              text2: 'A problem occurred, make sure to open the Casper application on your Ledger Nano X.',
            })
          : setError(err),
      retry: 1,
    },
  );

  const { replace } = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  const onSelectKey = async (key: LedgerAccountInfo): Promise<void> => {
    const info = {
      publicKey: key.publicKey,
      loginOptions: {
        connectionType: CONNECTION_TYPES.ledger,
        keyIndex: key.keyIndex,
      },
    };
    await Config.saveItem(Keys.casperdash, info);

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
