import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import _ from 'lodash';
import { CLayout, CHeader } from 'components';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { CheckItem } from 'screens/authentication/create_new_wallet/components';
import { getArrayNotInArray } from 'utils/collections';
import { allActions } from 'redux_manager';
import { useDispatch } from 'react-redux';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { MessageType } from 'components/CMessge/types';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import { NUMBER_WORDS_PER_ROW } from 'utils/constants/key';
import { useStackNavigation } from 'utils/hooks/useNavigation';

const DoubleCheckItScreen: React.FC<
  // @ts-ignore
  ScreenProps<CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN>
> = ({ route }) => {
  const [listData, setListData] = useState<any>([]);
  const [listDataSelected, setListDataSelected] = useState<any>([]);
  const { wordArray, algorithm, recoveryPhase, derivationPath } = route.params;
  const numberOfWords = Math.floor(wordArray?.length / NUMBER_WORDS_PER_ROW);

  const { navigate } = useStackNavigation();
  const dispatch = useDispatch();

  const isCheckingSuccess = __DEV__ ? true : listDataSelected.filter((i: any) => !!i).length === numberOfWords;

  useEffect(() => {
    const randomList = _.sampleSize(wordArray, numberOfWords);
    let restList = getArrayNotInArray(wordArray, randomList);
    restList = _.shuffle(restList);

    const list = randomList.map((item) => {
      let listWords = [{ ...item, isKey: true }];
      const randomWords = _.sampleSize(restList, 2);
      restList = getArrayNotInArray(restList, randomWords);
      listWords = listWords.concat(randomWords);
      listWords = _.shuffle(listWords);
      return listWords;
    });
    setListData(list);
  }, [numberOfWords, wordArray]);

  const onSelectWords = (rowIndex: number, id: any) => {
    if (listData && listData[rowIndex]) {
      const listDataSelectedTemp = [...listDataSelected];
      const listDataTemp = listData.map((row: any, rowIdx: number) => {
        if (rowIdx === rowIndex) {
          return row.map((item: any) => {
            const isSelected = item.id === id;
            item.isSelected = isSelected;
            if (isSelected) {
              listDataSelectedTemp[rowIndex] = item.isKey ? item.word : null;
            }
            return item;
          });
        }
        return row;
      });
      setListDataSelected(listDataSelectedTemp);
      setListData(listDataTemp);
    }
  };

  const onNext = () => {
    if (!isCheckingSuccess) {
      const message = {
        message: 'Invalid',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message));
      return;
    }

    navigate(AuthenticationRouter.CHOOSE_PIN, {
      screen: ChoosePinRouter.CHOOSE_PIN_SCREEN,
      params: {
        showBack: true,
        phrases: recoveryPhase,
        algorithm,
        derivationPath,
      },
    });
  };

  return (
    <CLayout>
      <CHeader
        title={`Double check (${
          listData.filter((row: any) => row.find((phrase: any) => phrase.isSelected)).length
        }/${numberOfWords})`}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: scale(20) }}>
        {listData &&
          listData.length > 0 &&
          listData.map((row: any, rowIdx: number) => {
            const keyWords = row.find((i: any) => i.isKey);
            return <CheckItem data={row} keyWords={keyWords} key={rowIdx} onPress={onSelectWords} rowIndex={rowIdx} />;
          })}
      </ScrollView>
      <CTextButton onPress={onNext} style={styles.btnNext} disabled={!isCheckingSuccess} text={'Next'} />
    </CLayout>
  );
};

export default DoubleCheckItScreen;

const styles = StyleSheet.create({
  btnNext: {
    alignSelf: 'center',
    marginVertical: scale(20),
  },
});
