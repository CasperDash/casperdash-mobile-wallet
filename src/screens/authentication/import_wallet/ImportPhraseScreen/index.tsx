import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CHeader, CLayout, CLoading, Row} from 'components';
import {colors, textStyles} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Phrase} from 'screens/authentication/data/data';
import {PhraseInputItem} from 'screens/authentication/import_wallet/components';
import Clipboard from '@react-native-clipboard/clipboard';
import {allActions} from 'redux_manager';
import { useDispatch } from 'react-redux';
import {Config} from 'utils';
import Keys from '../../../../utils/keys';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const ImportPhraseScreen = () => {
    const dispatch = useDispatch();
    const numberOfPhrases = 24;
    const [isLoading, setLoading] = useState<boolean>(false);
    const {replace} = useNavigation<StackNavigationProp<any>>();
    const [isWrongPhrase, setWrongPhrase] = useState<boolean>(false);

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
        if (isWrongPhrase){
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
            const phraseString = await Clipboard.getString();
            if (phraseString && phraseString.length > 0) {
                let listWords: Array<Phrase> = phraseString.split(/\s+/).map((word, index) => ({
                    id: index,
                    word: word,
                }));
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
            importPhrase();
        }
    };

    const importPhrase = () => {
        const phrasesLeft = listLeft.reduce((previous: string, current: Phrase) => previous + current.word + ' ', '');
        const phrasesRight = listRight.reduce((previous: string, current: Phrase) => previous + current.word + ' ', '');
        const phrases = (phrasesLeft + phrasesRight).trim();
        const publicKey = '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'; //TODO: get publicKey from phrases string
        setLoading(true);

        dispatch(allActions.user.getAccountInformation(publicKey, async (err: any, res: any) => {
            if (res) {
                setLoading(false);
                const info = {
                    publicKey: publicKey,
                    loginOptions: {
                        connectionType: 'passphase',
                        passphase: phrases,
                    },
                };
                await Config.saveItem(Keys.casperdash, info);
                replace(AuthenticationRouter.CHOOSE_PIN);
            } else {
                setLoading(false);
                setWrongPhrase(true);
            }
        }));
    };

    const onCancel = () => {
        if (isWrongPhrase){
            setWrongPhrase(false);
        }
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
                    {isWrongPhrase && <Text style={styles.txtError}>Wrong Phrase</Text>}
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
            {isLoading && <CLoading/>}
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
    txtError: {
        ...textStyles.Body2,
        color: colors.R3,
        marginTop: scale(8),
        alignSelf: 'flex-start',
        marginLeft: scale(16),
    },
});
