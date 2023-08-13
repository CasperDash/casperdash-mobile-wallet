import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconVerified } from 'assets';
import { getValueByFormat } from 'utils/helpers/format';
import { IValidatorDetailsResponse } from 'services/Validators/validatorsApis';
import { IValidator } from 'utils/hooks/useValidators';

interface ValidatorItemProps {
  data: IValidator;
  onSelectValidator: Function;
  validatorsDetail?: IValidatorDetailsResponse;
}

function ValidatorItem({ data, onSelectValidator, validatorsDetail }: ValidatorItemProps) {
  const validatorDetail = validatorsDetail?.[data.validatorPublicKey];
  return (
    <CButton onPress={() => onSelectValidator(data)}>
      <Row px={16} py={16} style={styles.container}>
        <Col.L pr={1} style={styles.verifiedIconCol}>
          {data.priority && <IconVerified />}
        </Col.L>
        <Image source={{ uri: validatorDetail?.logo || data.logo || data.icon }} style={styles.icon} />
        <Row.LR pl={4} style={styles.rightContainer}>
          <Col.L>
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={[styles.title, { width: scale(100) }]}>
              {validatorDetail?.name || data?.name || data.validatorPublicKey}
            </Text>
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={[textStyles.Body1, { width: scale(100) }]}>
              {data.validatorPublicKey}
            </Text>
          </Col.L>
          <Col.R>
            <Text style={textStyles.Body1}>
              {getValueByFormat(data.delegationRate || 0, {
                format: 'percentage',
              })}{' '}
              Fee
            </Text>
            <Text style={textStyles.Body1}>
              {getValueByFormat(data.weight || 0, {
                format: 'mote',
                maximumFractionDigits: 2,
              })}{' '}
              CSPR
            </Text>
          </Col.R>
        </Row.LR>
      </Row>
    </CButton>
  );
}

export default ValidatorItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: scale(36),
    height: scale(36),
  },
  verifiedIcon: {
    width: scale(22),
    height: scale(34),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N1,
  },
  rightContainer: {
    flex: 2,
  },
  verifiedIconCol: {
    minWidth: 25,
  },
});
