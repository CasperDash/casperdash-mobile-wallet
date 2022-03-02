import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CButton, Row} from 'components';
import {colors, IconCopy, textStyles} from 'assets';
import {scale} from 'device';
import Clipboard from '@react-native-clipboard/clipboard';
import {MessageType} from 'components/CMessge/types';
import {allActions} from 'redux_manager';
import {useDispatch} from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import {getValueByFormat} from 'utils/helpers/format';
import {toFormattedDate} from 'utils/date';
import {STATUS_MAPPING} from 'screens/home/HistoriesScreen';

interface Props {
    data: any,
    deploy: any,
    index: number
}

const TransferDetailComponent = ({data, deploy, index}: Props) => {

    const dispatch = useDispatch();
    const locales = RNLocalize.getLocales();
    const defaultLocale = locales && locales[0] && locales[0].languageTag;
    const deployValue = deploy[data.value];
    const formattedValue = data.format ? (
        data.format === 'date' ? toFormattedDate(deploy.timestamp, defaultLocale) : getValueByFormat(deployValue, {format: data.format})
    ) : deployValue;

    const copy = async () => {
        await Clipboard.setString(formattedValue);
        const message = {
            message: 'Copied to Clipboard',
            type: MessageType.normal,
        };
        dispatch(allActions.main.showMessage(message, 1000));
    };

    return (
        <>
            <Text style={[styles.title, index === 0 && {marginTop: 0}]}>{data.label}</Text>
            <CButton disabled={!data.copy}
                     enabledOpacity={true}
                     onPress={copy}>
                <Row style={styles.row}>
                    <Text style={styles.value}>{formattedValue} {data.copy && <IconCopy
                        style={{color: colors.N2}}
                        width={scale(15)}
                        height={scale(15)}/>}</Text>
                </Row>
            </CButton>
        </>
    );
};

export default TransferDetailComponent;

const styles = StyleSheet.create({
    title: {
        ...textStyles.Sub1,
        color: colors.N3,
        marginTop: scale(20),
    },
    value: {
        ...textStyles.Body1,
        marginTop: scale(12),
        color: colors.N2,
    },
    row: {
        width: scale(375 - 16 * 2),
        alignItems: 'center',
    },
});
