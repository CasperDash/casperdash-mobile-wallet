import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CHeader, CLayout, Row } from 'components';
import { SelectDropdownComponent, DropdownItem } from '../../create_new_wallet/components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Phrase } from 'screens/authentication/data/data';
import { PhraseInputItem } from 'screens/authentication/import_wallet/components';
import ClipboardManager from 'utils/helpers/clipboard';
import { useDispatch } from 'react-redux';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import { DERIVATION_PATH, NUMBER_OF_RECOVERY_WORDS } from '../../../../utils/constants/key';
import SelectDropdown from 'react-native-select-dropdown';
import { EncryptionType, KeyFactory } from 'react-native-casper-storage';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';
import { ListItem } from '@rneui/themed';
import { SensitiveInfoWrapper } from 'components/SensitiveInfoWrapper';

const ImportPhraseScreen = () => {
  const dispatch = useDispatch();

  const keyManager = KeyFactory.getInstance();

  const [algorithm, setAlgorithm] = useState<EncryptionType>(EncryptionType.Ed25519);
  const [derivationPath, setDerivationPath] = useState(DERIVATION_PATH[0]);
  const { navigate } = useNavigation<StackNavigationProp<any>>();
  const [isWrongPhrase, setWrongPhrase] = useState<boolean>(false);
  const [numberOfWord, setNumberOfWords] = useState<number>(NUMBER_OF_RECOVERY_WORDS[0]);
  const [isExpandedAdvanced, setIsExpandedAdvanced] = useState<boolean>(false);

  const handleOnSelectAlgo = (algorithmSelected: EncryptionType) => {
    setAlgorithm(algorithmSelected);
  };

  const createList = (isRight: boolean, numOfWords: number) => {
    return Array.from({ length: numOfWords / 2 }, (_, idx) => ({
      id: isRight ? idx + numOfWords / 2 : idx,
      word: '',
    }));
  };

  const [listLeft, setListLeft] = useState<Array<Phrase>>(createList(false, numberOfWord));
  const [listRight, setListRight] = useState<Array<Phrase>>(createList(true, numberOfWord));

  const onChangeNumberOfWords = (number: number) => {
    setNumberOfWords(number);
    setListLeft(createList(false, number));
    setListRight(createList(true, number));
  };

  const onChangeText = (text: string, index: number, listIndex: number) => {
    if (isWrongPhrase) {
      setWrongPhrase(false);
    }
    if (listIndex === 1) {
      setListLeft(getList(text, listLeft, index));
    }
    if (listIndex === 2) {
      setListRight(getList(text, listRight, index));
    }
  };

  const getList = (text: string, list: Array<Phrase>, index: number) => {
    return list.map((phrase: Phrase, idx) => {
      if (index === idx) {
        phrase.word = text;
      }
      return phrase;
    });
  };

  const onPress = async () => {
    if (listLeft.find((i) => i.word === '') || listRight.find((i) => i.word === '')) {
      //paste phrase
      const phraseString = await ClipboardManager.getString();
      if (phraseString && phraseString.length > 0) {
        let listWords: Array<Phrase> = phraseString.split(/\s+/).map((word, index) => ({
          id: index,
          word: word,
        }));
        if (listWords.length < numberOfWord) {
          const lastEmptyList = Array.from({ length: numberOfWord - listWords.length }, (_, idx) => ({
            id: listWords.length + idx,
            word: '',
          }));
          listWords = listWords.concat(lastEmptyList);
        } else {
          listWords = listWords.slice(0, numberOfWord);
        }
        const left: Array<Phrase> = listWords.length > 0 ? listWords.slice(0, Math.round(numberOfWord / 2)) : [];
        const right: Array<Phrase> =
          listWords.length > 0 && left.length > 0 ? listWords.slice(left.length, listWords.length) : [];
        setListLeft(left);
        setListRight(right);
      }
    } else {
      //import phrase
      importPhrase();
    }
  };

  const importPhrase = () => {
    const phrasesLeft = listLeft.reduce(
      (previous: string, current: Phrase) => previous + current.word.trim() + ' ',
      '',
    );
    const phrasesRight = listRight.reduce(
      (previous: string, current: Phrase) => previous + current.word.trim() + ' ',
      '',
    );
    const phrases = (phrasesLeft + phrasesRight).trim();
    if (keyManager.validate(phrases)) {
      navigate(AuthenticationRouter.CHOOSE_PIN, {
        screen: ChoosePinRouter.CHOOSE_PIN_SCREEN,
        params: {
          showBack: true,
          phrases: phrases,
          algorithm,
          derivationPath: derivationPath.value,
        },
      });
    } else {
      const message = {
        message: 'Invalid Recovery Phrase',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message));
    }
  };

  const onCancel = () => {
    if (isWrongPhrase) {
      setWrongPhrase(false);
    }
    setListLeft(
      Array.from({ length: numberOfWord / 2 }, (_, idx) => ({
        id: idx,
        word: '',
      })),
    );
    setListRight(
      Array.from({ length: numberOfWord / 2 }, (_, idx) => ({
        id: idx + numberOfWord / 2,
        word: '',
      })),
    );
  };

  return (
    <CLayout>
      <CHeader title={'Import Phrase'} />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <ListItem.Accordion
            content={<Text style={styles.label}>Advanced Settings</Text>}
            isExpanded={isExpandedAdvanced}
            onPress={() => setIsExpandedAdvanced(!isExpandedAdvanced)}
            style={styles.advancedSettings}
          >
            <Row.LR pt={16} px={16}>
              <View style={styles.selectType}>
                <Text style={styles.algorithmLabel}>Encryption Type</Text>
                <Text style={styles.algorithmDescription}>
                  We recommend to choose ed25519 over secp256k1 for stronger security and better performance, unless you
                  explicitly want to use secp256k1 in order to compatible with Bitcoin, Ethereum chains
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
                  renderCustomizedRowChild={(item: any, index) => <DropdownItem item={item} key={index} />}
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
            <Row.LR pt={16} px={16}>
              <View style={styles.selectType}>
                <Text style={styles.algorithmLabel}>Derivation path</Text>
                <Text style={styles.algorithmDescription}>
                  A derivation path is a piece of data which tells a Hierarchical Deterministic (HD) wallet how to
                  derive a specific key within a tree of keys
                </Text>
                <SelectDropdown
                  dropdownStyle={[styles.rowPicker, styles.dropdownStyle]}
                  buttonStyle={styles.rowPicker}
                  dropdownOverlayColor={'rgba(0,0,0,0.1)'}
                  rowStyle={styles.rowStyle}
                  data={DERIVATION_PATH}
                  onSelect={(selectedItem) => {
                    setDerivationPath(selectedItem);
                  }}
                  renderCustomizedButtonChild={(item: any, index) => {
                    if (!item) {
                      return null;
                    }
                    return <SelectDropdownComponent item={item.label} key={index} />;
                  }}
                  renderCustomizedRowChild={(item: any) => (
                    <Row.LR px={16} key={item.value}>
                      <Text style={textStyles.Body1}>{item.label}</Text>
                    </Row.LR>
                  )}
                  defaultValueByIndex={1}
                  buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, _index) => {
                    return item;
                  }}
                  defaultValue={derivationPath}
                />
              </View>
            </Row.LR>
          </ListItem.Accordion>
          <Row.LR pt={16} px={16} style={styles.numberRow}>
            <Text style={styles.numberOfWordsLabel}>Number of words</Text>
            {NUMBER_OF_RECOVERY_WORDS.map((number, index) => {
              return (
                <CTextButton
                  key={index}
                  type={numberOfWord === number ? 'default' : 'line'}
                  style={[styles.numberOfWordsButton, { marginRight: scale(12) }]}
                  text={number.toString()}
                  onPress={() => onChangeNumberOfWords(number)}
                  variant={numberOfWord === number ? 'primary' : 'secondary'}
                />
              );
            })}
          </Row.LR>
          <Row.LR py={16} px={16} mt={16} ml={16} style={styles.body}>
            <SensitiveInfoWrapper>
              <View style={styles.flex}>
                {listLeft.map((item, index) => {
                  return (
                    <PhraseInputItem
                      data={item}
                      onChangeText={(text: string) => onChangeText(text, index, 1)}
                      key={index}
                    />
                  );
                })}
              </View>
              <View style={styles.flex}>
                {listRight.map((item, index) => {
                  return (
                    <PhraseInputItem
                      data={item}
                      onChangeText={(text: string) => onChangeText(text, index, 2)}
                      key={index}
                    />
                  );
                })}
              </View>
            </SensitiveInfoWrapper>
          </Row.LR>
          {isWrongPhrase && <Text style={styles.txtError}>Wrong Phrase</Text>}
        </KeyboardAwareScrollView>
        <Row.C>
          <CTextButton
            type={'line'}
            style={[styles.btnNext, { marginRight: scale(15) }]}
            text={'Clear'}
            onPress={onCancel}
            variant="secondary"
          />
          <CTextButton
            onPress={onPress}
            style={styles.btnNext}
            text={
              listLeft.find((i) => i.word === '') || listRight.find((i) => i.word === '') ? 'Paste Phrase' : 'Import'
            }
          />
        </Row.C>
      </View>
    </CLayout>
  );
};

export default ImportPhraseScreen;

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
    paddingVertical: scale(25),
  },
  btnNext: {
    width: scale(164),
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  txtError: {
    ...textStyles.Body2,
    color: colors.R3,
    marginTop: scale(8),
    alignSelf: 'flex-start',
    marginLeft: scale(16),
  },
  selectType: {
    flexDirection: 'column',
  },
  rowPicker: {
    minWidth: '100%',
    minHeight: scale(56),
    backgroundColor: colors.N5,
    color: colors.W1,
    borderRadius: scale(16),
    borderWidth: 0,
  },
  rowStyle: {
    height: scale(60),
  },
  dropdownStyle: {
    borderRadius: scale(10),
    color: colors.W1,
  },
  label: { ...textStyles.Sub2, color: colors.N3 },
  algorithmLabel: {
    ...textStyles.Sub2,
    color: colors.N3,
    marginBottom: scale(12),
  },

  algorithmDescription: {
    ...textStyles.Cap2,
    marginBottom: scale(12),
  },
  numberOfWordsLabel: {
    ...textStyles.Sub2,
    color: colors.N3,
    marginRight: scale(12),
  },
  numberOfWordsButton: {
    width: scale(60),
    height: scale(30),
  },
  numberRow: {
    justifyContent: 'flex-start',
    gap: scale(12),
  },
  advancedSettings: { paddingLeft: scale(4), justifyContent: 'center' },
});
