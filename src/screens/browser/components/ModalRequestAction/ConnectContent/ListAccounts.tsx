// Create sample react native template component
import { scale } from 'device';
import React from 'react';

import { View, StyleSheet, ActivityIndicator, ScrollView, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { AccountInfo, useMyAccounts } from 'utils/hooks/useAccountInfo';
import AccountItem from '../../ModalAccount/AccountItem';

type Props = {
  style?: StyleProp<ViewStyle>;
  onSelectAccount?: (account: AccountInfo) => void;
  selectedUid?: string;
};

const ListAccounts = ({ style, onSelectAccount, selectedUid }: Props) => {
  const { data: accounts, isLoading } = useMyAccounts({
    onError: (err) => {
      console.log('err: ', err);
    },
  });

  const listAccounts = accounts?.map((account) => {
    const logo = getBase64IdentIcon(account.publicKey);

    return {
      logo: {
        uri: logo,
      },
      account,
      description: `${account?.publicKey?.slice(0, 4)}...${account?.publicKey?.slice(-8)}`,
    };
  });

  return (
    <ScrollView style={[styles.container, style]}>
      {isLoading ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : (
        listAccounts?.map(({ account, logo, description }, index) => {
          const isSelected = selectedUid === account.walletInfo?.uid;
          return (
            <TouchableOpacity key={`account-${account.walletInfo?.uid}`} onPress={() => onSelectAccount?.(account)}>
              <AccountItem
                style={styles.accountItem}
                key={index}
                logo={logo}
                account={account}
                description={description}
                buttonText={isSelected ? 'Selected' : 'Select'}
                selectedUid={selectedUid}
                buttonType={selectedUid === account.walletInfo?.uid ? 'default' : 'line'}
                onPress={() => onSelectAccount?.(account)}
              />
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '80%',
  },
  accountItem: {
    padding: scale(12),
  },
});

export default ListAccounts;
