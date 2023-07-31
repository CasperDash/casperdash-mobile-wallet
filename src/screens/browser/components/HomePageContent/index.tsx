import { scale } from 'device';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { images } from 'assets';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';
import CRowItemButton from 'components/CRowItemButton';

type DApp = {
  logo: any;
  name: string;
  description: string;
  url: string;
};

const listDApps = [
  {
    logo: images.eggforce,
    name: 'EggForce',
    description: 'EggForce - Your Egg - Your Power',
    url: 'https://testnet.eggforce.io',
  },
  {
    logo: images.melem,
    name: 'Melem',
    description: 'Next generation of brand NFT programs powered by Web3',
    url: 'https://app.melem.io',
  },
  {
    logo: images.friendlyMarket,
    name: 'FriendlyMarket',
    description: 'Your gateway to decentralized finance',
    url: 'https://www.friendly.market',
  },
  {
    logo: images.casperPunk,
    name: 'Casper Punks',
    description: 'Official First Digital Collectible series',
    url: 'https://casperpunks.io',
  },
  {
    logo: images.casperStats,
    name: 'Casperstats',
    description: 'Casper Explorer',
    url: 'https://casperstats.io',
  },
];

const HomePageContent = () => {
  const { go } = useWebNavigate();

  const handleOnPress = (url: string) => {
    go(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {listDApps.map((dapp: DApp, index: number) => (
          <CRowItemButton
            style={[styles.row, index !== 0 && styles.rowItem]}
            key={`dapp-${index}`}
            logo={dapp.logo}
            name={dapp.name}
            description={dapp.description}
            onPress={() => {
              handleOnPress(dapp.url);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scale(20),
    height: '92%',
  },
  row: {
    paddingHorizontal: scale(8),
  },
  rowItem: {
    marginTop: scale(24),
  },
  scrollView: {},
});

export default HomePageContent;
