import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { CLayout, CHeader } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import {
  PhraseItem,
  SelectDropdownComponent,
  DropdownItem,
} from '../components';
import { Row } from 'components';
import CTextButton from 'components/CTextButton';
import { useNavigation } from '@react-navigation/native';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import { StackNavigationProp } from '@react-navigation/stack';
import { Phrase } from '../../data/data';
import { Config } from 'utils';
import SelectDropdown from 'react-native-select-dropdown';
import { EncryptionType } from 'react-native-casper-storage';
import { NUMBER_OF_RECOVERY_WORDS } from '../../../../utils/constants/key';
import { getRecoveryPhase } from '../../../../utils/helpers/account';
import { useCopyToClipboard } from 'utils/hooks/useCopyClipboard';

const RecoveryPhraseScreen = () => {
  const { navigate } = useNavigation<StackNavigationProp<any>>();
  const [algorithm, setAlgorithm] = useState<EncryptionType>(
    EncryptionType.Ed25519,
  );
  const copyToClipboard = useCopyToClipboard();

  const [numberOfWord, setNumberOfWords] = useState<number>(
    NUMBER_OF_RECOVERY_WORDS[0],
  );
  const phraseString = getRecoveryPhase(numberOfWord);

  const [wordArray, listLeft, listRight] = useMemo(() => {
    const listWords: Array<Phrase> = phraseString
      ? phraseString
          .split(/\s+/)
          .map((word, index) => ({ id: index + 1, word: word }))
      : [];
    const left: Array<Phrase> =
      listWords.length > 0
        ? listWords.slice(0, Math.round(listWords.length / 2))
        : [];
    const right: Array<Phrase> =
      listWords.length > 0 && left.length > 0
        ? listWords.slice(left.length, listWords.length)
        : [];
    return [listWords, left, right];
  }, [phraseString]);

  const handleOnSelectAlgo = (algorithmSelected: EncryptionType) => {
    setAlgorithm(algorithmSelected);
  };

  const openDoubleCheckIt = () => {
    try {
      if (wordArray && wordArray.length > 0) {
        navigate(CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN, {
          wordArray: JSON.parse(JSON.stringify(wordArray)),
          recoveryPhase: phraseString,
          algorithm,
        });
      }
    } catch (e) {
      Config.alertMess(e);
    }
  };

  return (
    <CLayout>
      <CHeader title={'Recovery Phrase'} />
      <View style={styles.container}>
        <Row.LR pt={16} px={16}>
          <View style={styles.selectType}>
            <Text style={styles.algorithmLabel}>Encryption Type</Text>
            <Text style={styles.algorithmDescription}>
              We recommend to choose ed25519 over secp256k1 for stronger
              security and better performance, unless you explicitly want to use
              secp256k1 in order to compatible with Bitcoin, Ethereum chains
            </Text>
            <SelectDropdown
              dropdownStyle={[styles.rowPicker, styles.dropdownStyle]}
              buttonStyle={styles.rowPicker}
              dropdownOverlayColor={'rgba(0,0,0,0.1)'}
              data={[EncryptionType.Ed25519, EncryptionType.Secp256k1]}
              onSelect={(selectedItem, _index) => {
                handleOnSelectAlgo(selectedItem);
              }}
              renderCustomizedButtonChild={(item: any, index) => {
                if (!item) {
                  return null;
                }
                return <SelectDropdownComponent item={item} key={index} />;
              }}
              renderCustomizedRowChild={(item: any, index) => (
                <DropdownItem item={item} key={index} />
              )}
              defaultValueByIndex={1}
              buttonTextAfterSelection={(selectedItem, _index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, _index) => {
                return item;
              }}
              defaultValue={algorithm}
            />
          </View>
        </Row.LR>
        <Row.LR pt={16} px={16} style={styles.numberRow}>
          {NUMBER_OF_RECOVERY_WORDS.map(number => {
            return (
              <CTextButton
                type={numberOfWord === number ? 'default' : 'line'}
                style={[styles.numberOfWordsButton, { marginRight: scale(12) }]}
                text={number.toString()}
                onPress={() => setNumberOfWords(number)}
                variant={numberOfWord === number ? 'primary' : 'secondary'}
              />
            );
          })}
        </Row.LR>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Row.LR pt={16} px={16} style={styles.body}>
            <View style={styles.flex}>
              {listLeft.map((item, index) => {
                return <PhraseItem data={item} key={index} />;
              })}
            </View>
            <View style={styles.flex}>
              {listRight.map((item, index) => {
                return <PhraseItem data={item} key={index} />;
              })}
            </View>
          </Row.LR>
        </ScrollView>
        <Row.C>
          <CTextButton
            type={'line'}
            style={[styles.btnNext, { marginRight: scale(15) }]}
            text={'Copy'}
            onPress={async () => {
              copyToClipboard(phraseString);
            }}
          />
          <CTextButton
            style={styles.btnNext}
            onPress={openDoubleCheckIt}
            text={'Next'}
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
  btnNext: {
    width: scale(164),
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  selectType: {
    flexDirection: 'column',
  },
  rowPicker: {
    minWidth: '100%',
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
    color: colors.W1,
    borderRadius: scale(16),
    borderWidth: 0,
  },
  dropdownStyle: {
    borderRadius: scale(10),
    color: colors.W1,
  },
  algorithmLabel: {
    ...textStyles.Sub2,
    color: colors.N3,
    marginBottom: scale(12),
  },
  algorithmDescription: {
    ...textStyles.Cap2,
    marginBottom: scale(12),
  },
  numberOfWordsButton: {
    width: scale(60),
    height: scale(30),
  },
  numberRow: {
    justifyContent: 'flex-start',
  },
});
