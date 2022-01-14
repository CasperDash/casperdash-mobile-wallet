import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ScreenProps} from "navigation/ScreenProps";
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import _ from 'lodash';
import {CLayout, CHeader} from "components";
import {scale} from "device";
import CButton2 from "components/CButton2";
import {useNavigation} from "@react-navigation/native";
import {CheckItem} from "screens/authentication/create_new_wallet/components";
import {StackNavigationProp} from "@react-navigation/stack";

const numberOfRandom = 6;

// @ts-ignore
const DoubleCheckItScreen: React.FC<ScreenProps<CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN>> = ({route}) => {
    const {data} = route.params;
    const [listData, setListData] = useState<any>([]);
    const [listDataSelected, setListDataSelected] = useState<any>([]);

    const {navigate} = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        const randomList = _.sampleSize(data, numberOfRandom);
        let restList = getArrayNotInArray(data, randomList);
        restList = _.shuffle(restList);

        const list = randomList.map((item, index) => {
            let listWords = [{...item, isKey: true}];
            const randomWords = _.sampleSize(restList, 2);
            restList = getArrayNotInArray(restList, randomWords);
            listWords = listWords.concat(randomWords);
            listWords = _.shuffle(listWords);
            return listWords;
        });
        setListData(list);
    }, []);

    const getArrayNotInArray = (source: any, sample: any) => {
        return source.filter((i: any) => {
            return sample.indexOf(i) === -1;
        })
    };

    const onSelectWords = (rowIndex: number, id: any) => {
        if (listData && listData[rowIndex]) {
            const listDataTemp = [...listData];
            const listDataSelectedTemp = [...listDataSelected];

            listDataTemp[rowIndex].forEach((item: any, index: number) => {
                listDataTemp[rowIndex][index].isSelected = item.id === id;
                if (item.id === id) {
                    if (item.isKey) {
                        listDataSelectedTemp[rowIndex] = item.word;
                    } else {
                        listDataSelectedTemp[rowIndex] = null;
                    }
                }

            })
            setListDataSelected(listDataSelectedTemp);
            setListData(listDataTemp);
        }
    };

    const openChoosePin = () => {
        navigate(CreateNewWalletRouter.CHOOSE_PIN_SCREEN)
    }

    return (
        <CLayout>
            <CHeader title={`Let's double check it`}/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingVertical: scale(20)}}>
                {
                    listData && listData.length > 0 && listData.map((row: any, rowIdx: number) => {
                        const keyWords = row.find((i: any) => i.isKey);
                        return <CheckItem
                            data={row}
                            keyWords={keyWords}
                            key={rowIdx}
                            onPress={onSelectWords}
                            rowIndex={rowIdx}/>
                    })
                }
            </ScrollView>
            <CButton2
                onPress={openChoosePin}
                style={styles.btnNext}
                disabled={listDataSelected.filter((i: any) => !!i).length !== numberOfRandom}
                text={'Next'}
            />
        </CLayout>
    );
};

export default DoubleCheckItScreen;

const styles = StyleSheet.create({
    btnNext: {
        alignSelf: 'center',
        marginVertical: scale(20)
    }
})
