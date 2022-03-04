import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Row, Col, CButton} from 'components';
import {colors, IconStatusReceive, textStyles} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';

interface Props {
    value: any,
}

function StakedInformationItem({value}: Props) {

    return (
        <CButton>
            <Row py={16} style={styles.container}>
                <IconStatusReceive width={scale(24)} height={scale(24)}/>
                <Row.LRT pl={16} style={{flex: 1}}>
                    <Col.TL>
                        <Text style={styles.title} numberOfLines={1}
                              ellipsizeMode={'middle'}>{value.deployHash ?? '0xa64784...2583'}</Text>
                        <CTextButton text={'Undelegate'}
                                     type={'line'}
                                     textStyle={styles.textStyle}
                                     style={styles.btnUnDelegate}/>
                    </Col.TL>
                    <Col.TR>
                        <Text style={textStyles.Sub1}>{`${value.amount} ${value.symbol}`}</Text>
                        <Text style={[textStyles.Body2, {
                            marginTop: scale(4),
                        }]}>{''}</Text>
                    </Col.TR>
                </Row.LRT>
            </Row>
        </CButton>
    );
}

export default StakedInformationItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.N5,
    },
    title: {
        ...textStyles.Sub1,
        width: scale(130),
    },
    btnUnDelegate: {
        width: scale(125),
        height: scale(32),
        marginTop: scale(12)
    },
    textStyle: {
        ...textStyles.Body2,
    },
});
