import { StyleSheet, Text, View } from 'react-native';
import { colors, IconArrowDown, textStyles } from 'assets';
import { CButton } from 'components';
import * as React from 'react';
import { scale } from 'device';
import ValidatorItem from 'screens/staking/components/ValidatorItem';

type Props = {
  onPress?: () => void;
  publicKey?: string;
  name?: string;
  logo?: string;
  isShowArrow?: boolean;
};
// Test

const SelectValidatorButton = ({ onPress, publicKey, logo, name, isShowArrow = true }: Props) => {
  return (
    <CButton onPress={onPress}>
      <View style={styles.selectValidator}>
        {publicKey ? (
          <>
            <ValidatorItem logo={logo} publicKey={publicKey} name={name} />
            {isShowArrow && <IconArrowDown />}
          </>
        ) : (
          <>
            <Text style={styles.placeholder}>Select a validator</Text>
            {isShowArrow && <IconArrowDown />}
          </>
        )}
      </View>
    </CButton>
  );
};

const styles = StyleSheet.create({
  selectValidator: {
    height: scale(80),
    backgroundColor: colors.N5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(9),
    borderRadius: scale(16),
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameValidator: {
    ...textStyles.Body1,
    color: colors.N2,
    fontSize: scale(16),
    lineHeight: scale(30),
    width: scale(200),
  },
  placeholder: {
    ...textStyles.Body1,
    color: colors.N3,
  },
  publicKeyValidator: {
    ...textStyles.Body1,
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
    width: scale(200),
  },
  iconWrapper: {
    flexBasis: scale(50),
  },
  icon: {
    width: scale(36),
    height: scale(36),
  },
});

export default SelectValidatorButton;
