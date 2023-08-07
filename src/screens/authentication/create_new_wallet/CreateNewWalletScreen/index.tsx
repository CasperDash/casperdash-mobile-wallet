import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { images } from 'assets';
import { CLayout, Col } from 'components';
import { scale } from 'device';
import { ListItem } from 'screens/authentication/create_new_wallet/components';
import { ListCreateNewWalletMenu } from 'screens/authentication/data/data';

function CreateNewWalletScreen() {
  const { navigate } = useNavigation();

  return (
    <CLayout>
      <Col style={styles.flex}>
        <Col.C style={styles.topContainer}>
          <Image source={images.logo} style={styles.logo} />
        </Col.C>
        <Col.T style={styles.flex}>
          {ListCreateNewWalletMenu.map((item, index) => {
            return <ListItem data={item} key={index} onPress={navigate} />;
          })}
        </Col.T>
      </Col>
    </CLayout>
  );
}

export default CreateNewWalletScreen;

const styles = StyleSheet.create({
  topContainer: {
    width: '100%',
    height: '40%',
  },
  logo: {
    width: scale(124),
    height: scale(122),
  },
  flex: {
    flex: 1,
  },
});
