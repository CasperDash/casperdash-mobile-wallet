import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { CButton, Row } from 'components';
import { colors, IconCopy, textStyles } from 'assets';
import { scale } from 'device';
import { getValueByFormat } from 'utils/helpers/format';
import { toFormattedDate } from 'utils/date';
import { copyToClipboard } from 'utils/hooks/useCopyClipboard';

interface Props {
  data: any;
  deploy: any;
  index: number;
}

const CTransferDetailComponent = ({ data, deploy, index }: Props) => {
  const deployValue = deploy[data.value];
  const formattedValue = data.format
    ? data.format === 'date'
      ? toFormattedDate(deploy.timestamp)
      : getValueByFormat(deployValue, { format: data.format })
    : deployValue;

  const copy = async () => {
    copyToClipboard(formattedValue);
  };

  return (
    <>
      <Text style={[styles.title, index === 0 && { marginTop: 0 }]}>{data.label}</Text>
      <CButton disabled={!data.copy} enabledOpacity={true} onPress={copy}>
        <Row style={styles.row}>
          <Text style={styles.value}>
            {formattedValue}{' '}
            {data.copy && <IconCopy style={{ color: colors.N2 }} width={scale(15)} height={scale(15)} />}
          </Text>
        </Row>
      </CButton>
    </>
  );
};

export default CTransferDetailComponent;

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
