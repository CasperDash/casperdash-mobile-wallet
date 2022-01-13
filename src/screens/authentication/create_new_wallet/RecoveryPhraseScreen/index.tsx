import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {CLayout} from "components";
import CHeader from "components/CHeader";
import {colors} from "assets";
import {scale} from "device";
import {PhraseItem} from "../components";
import {Col, Row} from 'components';

import Phrase from '../../data/phrase.json';
import CButton2 from "components/CButton2";
import {useNavigation} from "@react-navigation/native";
import CreateNewWalletRouter from "navigation/CreateNewWalletNavigation/CreateNewWalletRouter";

const RecoveryPhraseScreen = () => {

    const [listLeft, setListLeft] = useState([]);
    const [listRight, setListRight] = useState([]);
    const {navigate} = useNavigation();

    useEffect(() => {
        const left = Phrase.slice(0, Math.round(Phrase.length / 2));
        const right = Phrase.slice(left.length, Phrase.length);
        setListLeft(left);
        setListRight(right);
    }, []);

    const openDoubleCheckIt = () => {
        navigate(CreateNewWalletRouter.DOUBLE_CHECK_IT_SCREEN, {data: Phrase});
    }

    return (
        <CLayout>
            <CHeader
                title={'Recovery Phrase'}/>
            <View style={styles.container}>
                <ScrollView
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Row.LR pt={16} px={16} mb={72} style={styles.body}>
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
                    <CButton2
                        onPress={openDoubleCheckIt}
                        text={'Next'}
                    />
                </ScrollView>
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
        paddingTop: scale(25)
    }
})
