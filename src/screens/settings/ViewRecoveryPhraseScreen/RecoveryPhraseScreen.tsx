import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CLayout, CHeader } from 'components';
import { colors } from 'assets';
import { scale } from 'device';
import { Row } from 'components';
import CTextButton from 'components/CTextButton';
import { useSelector } from 'react-redux';
import { getUser } from 'utils/selectors/user';
import { User } from 'react-native-casper-storage';
import { DEFAULT_NUMBER_OF_RECOVERY_WORDS } from 'utils/constants/key';
import { PhraseItem } from '../../authentication/create_new_wallet/components';

import { useCopyToClipboard } from 'utils/hooks/useCopyClipboard';

const RecoveryPhraseScreen = () => {
  const copyToClipboard = useCopyToClipboard();

  const user = useSelector<any, User>(getUser);

  const hdWallet = user.getHDWallet();

  const recoveryPhaseArr = hdWallet.id.split(' ');

  return (
    <CLayout>
      <CHeader title={'Recovery Phrase'} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Row.LR pt={16} px={16} style={styles.body}>
            {new Array(2).fill(undefined).map((_, index) => {
              const words = recoveryPhaseArr.slice(
                index * (DEFAULT_NUMBER_OF_RECOVERY_WORDS / 2),
                (index + 1) * (DEFAULT_NUMBER_OF_RECOVERY_WORDS / 2),
              );

              return (
                <View style={styles.flex} key={index}>
                  {words.map((item, i) => {
                    return (
                      <PhraseItem
                        data={{
                          word: item,
                          id:
                            index * (DEFAULT_NUMBER_OF_RECOVERY_WORDS / 2) +
                            (i + 1),
                        }}
                        key={`${index}-${i}`}
                      />
                    );
                  })}
                </View>
              );
            })}
          </Row.LR>
        </ScrollView>
        <Row.C>
          <CTextButton
            type={'line'}
            style={[{ marginRight: scale(15) }]}
            text={'Copy'}
            onPress={async () => {
              copyToClipboard(hdWallet.id);
            }}
          />
        </Row.C>
      </View>
    </CLayout>
  );
};

export default RecoveryPhraseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.W1,
  },
  body: {
    width: scale(343),
    borderRadius: scale(16),
    borderWidth: scale(1),
    borderColor: colors.gray6,
  },
  flex: {
    height: '100%',
  },
  contentContainerStyle: {
    alignItems: 'center',
    paddingVertical: scale(25),
  },
});
