import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {CHeader, CLayout, Row} from 'components';
import {colors} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Phrase} from 'screens/authentication/data/data';
import {PhraseInputItem} from 'screens/authentication/import_wallet/components';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import CNotificationModal from 'components/CNotificationModal';

const ImportPhraseScreen = () => {
    const numberOfPhrases = 24;
    const [listLeft, setListLeft] = useState<Array<Phrase>>(
        Array.from({length: numberOfPhrases / 2}, (_, idx) => ({
            id: idx,
            word: '',
        }))
    );
    const [listRight, setListRight] = useState<Array<Phrase>>(
        Array.from({length: numberOfPhrases / 2}, (_, idx) => ({
            id: idx + numberOfPhrases / 2,
            word: '',
        }))
    );

    const onChangeText = (text: string, index: number, listIndex: number) => {
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
            const phraseString = await Clipboard.getString();
            if (phraseString && phraseString.length > 0) {
                let listWords: Array<Phrase> = phraseString ? phraseString.split(/\s+/).map((word, index) => ({
                    id: index,
                    word: word,
                })) : [];
                if (listWords.length < numberOfPhrases) {
                    const lastEmptyList = Array.from({length: numberOfPhrases - listWords.length}, (_, idx) => ({
                        id: listWords.length + idx,
                        word: '',
                    }));
                    listWords = listWords.concat(lastEmptyList);
                } else {
                    listWords = listWords.slice(0, numberOfPhrases);
                }
                const left: Array<Phrase> = listWords.length > 0 ? listWords.slice(0, Math.round(numberOfPhrases / 2)) : [];
                const right: Array<Phrase> = listWords.length > 0 && left.length > 0 ? listWords.slice(left.length, listWords.length) : [];
                setListLeft(left);
                setListRight(right);
            }
        } else {
            //import phrase
            Toast.show({
                type: 'info',
            })
        }
    };

    const onCancel = () => {
        setListLeft(Array.from({length: numberOfPhrases / 2}, (_, idx) => ({
            id: idx,
            word: '',
        })));
        setListRight(Array.from({length: numberOfPhrases / 2}, (_, idx) => ({
            id: idx + numberOfPhrases / 2,
            word: '',
        })));
    };

    return (
        <CLayout>
            <CHeader title={'Import Phrase'}/>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Row.LR py={16} px={16} style={styles.body}>
                        <View style={styles.flex}>
                            {
                                listLeft.map((item, index) => {
                                    return <PhraseInputItem
                                        data={item}
                                        onChangeText={(text: string) => onChangeText(text, index, 1)}
                                        key={index}
                                    />;
                                })
                            }
                        </View>
                        <View style={styles.flex}>
                            {
                                listRight.map((item, index) => {
                                    return <PhraseInputItem
                                        data={item}
                                        onChangeText={(text: string) => onChangeText(text, index, 2)}
                                        key={index}
                                    />;
                                })
                            }
                        </View>
                    </Row.LR>
                </KeyboardAwareScrollView>
                <Row.C>
                    <CTextButton
                        type={'line'}
                        style={[styles.btnNext, {marginRight: scale(15)}]}
                        text={'Cancel'}
                        onPress={onCancel}
                    />
                    <CTextButton
                        onPress={onPress}
                        style={styles.btnNext}
                        text={(listLeft.find((i) => i.word === '') || listRight.find((i) => i.word === '')) ? 'Paste Phrase' : 'Import'}
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
        alignItems: 'center',
        paddingVertical: scale(25),
    },
    btnNext: {
        width: scale(164),
        alignSelf: 'center',
        marginVertical: scale(20),
    },
});
