import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CLayout, CHeader } from 'components';
import { colors } from 'assets';
import { scale } from 'device';
import { PhraseItem } from '../components';
import { Row } from 'components';
import CButton2 from 'components/CTextButton';
import { useNavigation } from '@react-navigation/native';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import { StackNavigationProp } from '@react-navigation/stack';
import { Phrase } from '../../data/data';
import { Config } from 'utils';

const phraseString =
  'House Ego Assits Repair Respond Attitude Different Difficult Opposition Resident Populate Inhabit Situated Problem Failed Name Octupus Doctor Strange Ironman Capital Dimondhand Flash Vision';

const RecoveryPhraseScreen = () => {
  const { navigate } = useNavigation<StackNavigationProp<any>>();

  const [data, listLeft, listRight] = useMemo(() => {
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
  }, []);

  const openDoubleCheckIt = () => {
    try {
      if (data && data.length > 0) {
        navigate(CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN, {
          data: JSON.parse(JSON.stringify(data)),
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Row.LR pt={16} px={16} style={styles.body}>
            <View style={styles.flex}>
              {listLeft.map((item, index) => {
                return <PhraseItem data={item} key={index} index={index} />;
              })}
            </View>
            <View style={styles.flex}>
              {listRight.map((item, index) => {
                return (
                  <PhraseItem
                    data={item}
                    key={index}
                    index={listRight.length + index}
                  />
                );
              })}
            </View>
          </Row.LR>
        </ScrollView>
        <CButton2
          style={styles.btnNext}
          onPress={openDoubleCheckIt}
          text={'Next'}
        />
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
    alignSelf: 'center',
    marginVertical: scale(20),
  },
});
