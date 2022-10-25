import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { CButton, Row } from 'components';
import { SettingMenu } from 'screens/settings/data';
import { scale } from 'device';
import { textStyles } from 'assets';

interface Props {
  data: SettingMenu;
}

const SettingMenuComponent = ({ data }: Props) => {
  const Icon = data.icon;
  const SubIcon = data.subIcon;
  const ActionComp = data.actionComp;

  return (
    <CButton onPress={data.onPress}>
      <Row.LR px={16} pb={32} style={styles.container}>
        <Row.C>
          <Icon />
          <Text style={styles.title}>{data.title}</Text>
        </Row.C>
        {ActionComp && <ActionComp />}
        {SubIcon && <SubIcon />}
      </Row.LR>
    </CButton>
  );
};

export default SettingMenuComponent;

const styles = StyleSheet.create({
  container: {
    width: scale(375),
  },
  title: {
    ...textStyles.Body1,
    marginHorizontal: scale(16),
  },
});
