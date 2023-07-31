import { scale } from 'device';
import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';
import CRowItemButton from 'components/CRowItemButton';
import { useGetDApps } from 'utils/hooks/useGetDApps';

type DApp = {
  logo: any;
  name: string;
  description: string;
  url: string;
};

const HomePageContent = () => {
  const { go } = useWebNavigate();

  const { data: dApps = [], isLoading } = useGetDApps();

  const handleOnPress = (url: string) => {
    go(url);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator animating />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {dApps.map((dapp: DApp, index: number) => (
            <CRowItemButton
              style={[styles.row, index !== 0 && styles.rowItem]}
              key={`dapp-${index}`}
              logo={{
                uri: dapp.logo,
              }}
              name={dapp.name}
              description={dapp.description}
              onPress={() => {
                handleOnPress(dapp.url);
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scale(20),
    height: '92%',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
