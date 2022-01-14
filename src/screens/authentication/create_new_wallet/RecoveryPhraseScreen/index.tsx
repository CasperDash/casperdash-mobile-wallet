import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {CLayout, CHeader} from "components";
import {colors} from "assets";
import {scale} from "device";
import {PhraseItem} from "../components";
import {Row} from 'components';

// @ts-ignore
import Phrase from '../../data/phrase.json';
import CButton2 from "components/CButton2";
import {useNavigation} from "@react-navigation/native";
import CreateNewWalletRouter from "navigation/CreateNewWalletNavigation/CreateNewWalletRouter";
import {StackNavigationProp} from "@react-navigation/stack";

const RecoveryPhraseScreen = () => {

    const {navigate} = useNavigation<StackNavigationProp<any>>();

    const [listLeft, setListLeft] = useState([]);
    const [listRight, setListRight] = useState([]);
    const [data, setData] = useState<any>(Phrase);

    useEffect(() => {
        const left = data.slice(0, Math.round(data.length / 2));
        const right = data.slice(left.length, data.length);
        setListLeft(left);
        setListRight(right);
    }, []);

    const openDoubleCheckIt = () => {
        navigate(CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN, {data: JSON.parse(JSON.stringify(data))});
    }

    return (
        <CLayout>
            <CHeader
                title={'Recovery Phrase'}/>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Row.LR pt={16} px={16} style={styles.body}>
                        <View style={styles.flex}>
                            {
                                listLeft.map((item, index) => {
                                    return <PhraseItem data={item} key={index} index={index}/>
                                })
                            }
                        </View>
                        <View style={styles.flex}>
                            {
                                listRight.map((item, index) => {
                                    return <PhraseItem data={item} key={index} index={listRight.length + index}/>
                                })
                            }
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
        marginVertical: scale(20)
    }
})
