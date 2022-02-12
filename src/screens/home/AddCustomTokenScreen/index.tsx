import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CInput, CLayout, CLoading} from "components";
import {CHeader, Col} from "components";
import {colors, textStyles} from "assets";
import {scale} from "device";
import CTextButton from "components/CTextButton";
import {Config, Keys} from "utils";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {allActions} from "redux_manager";
import {useDispatch} from "react-redux";

function AddCustomTokenScreen() {

    const [error, setError] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const {goBack} = useNavigation<StackNavigationProp<any>>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onChange = (value?: string) => {
        //TODO: validate public key
        setTokenAddress(value ?? '');
        // setError(isValidPublicKey(value) ? '' : 'Invalid public key');
    };

    const onAddPublicKey = async () => {
        setLoading(true);
        dispatch(allActions.home.getTokenAddressInfo(tokenAddress, async (err: any, res: any) => {
            if (res) {
                if(res.address){
                    let tokensAddressList = await Config.getItem(Keys.tokensAddressList);
                    if(tokensAddressList){
                        const isExist = tokensAddressList.find((address: string) => address === res.address);
                        if(!isExist){
                            tokensAddressList.push(res.address);
                        }
                    }
                    else {
                        tokensAddressList = [res.address];
                    }
                    await Config.saveItem(Keys.tokensAddressList, tokensAddressList);
                    dispatch(allActions.home.getTokenInfoWithBalance(undefined));
                }
                setLoading(false);
                goBack();
            } else {
                setLoading(false);
                setError(err && err.message ? err.message : 'Can not find token info');
            }
        }));
    };

    return (
        <CLayout bgColor={colors.cF8F8F8}>
            <CHeader title={'Add Token'} style={{backgroundColor: colors.cF8F8F8}}/>
            <Col
                mt={10}
                py={24}
                style={styles.container}>
                <Text style={styles.title}>Token Address</Text>
                <CInput
                    placeholder={'Enter token address'}
                    inputStyle={styles.input}
                    onChangeText={onChange}
                    style={styles.inputContainer}
                />
                <Text style={styles.errorText}>{error}</Text>
                <CTextButton
                    onPress={onAddPublicKey}
                    disabled={!!error || !tokenAddress}
                    style={styles.btnAdd}
                    text={'Add'}/>
            </Col>
            {isLoading && <CLoading/>}
        </CLayout>
    );
}

export default AddCustomTokenScreen;

const styles = StyleSheet.create(({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.W1,
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40)
    },
    title: {
        ...textStyles.Body1,
        color: colors.N3,
        marginBottom: scale(8),
        marginHorizontal: scale(24)
    },
    input: {
        ...textStyles.Body1,
        color: colors.N2,
    },
    btnAdd: {
        width: scale(327),
        alignSelf: 'center'
    },
    errorText: {
        ...textStyles.Body2,
        color: colors.R1,
        marginHorizontal: scale(24),
        marginBottom: scale(20)
    },
    inputContainer: {
        marginBottom: scale(6),
        paddingHorizontal: scale(24)
    }
}))
