import { scale } from 'device';
import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';
import CRowItemButton from 'components/CRowItemButton';
import { useGetDApps } from 'utils/hooks/useGetDApps';
import { textStyles } from 'assets';
import { useNavigateSimpleWebView } from 'utils/hooks/useNavigateSimpleWebView';
import { useConfigurations } from 'utils/hooks/useConfigurations';

type DApp = {
  logo: any;
  name: string;
  description: string;
  url: string;
};

const HomePageContent = () => {
  const { go } = useWebNavigate();
  const { data: configuration } = useConfigurations();
  const { navigateToWebView } = useNavigateSimpleWebView();

  const { data: dApps = [], isLoading } = useGetDApps();

  const handleOnPress = (url: string) => {
    go(url);
  };

  const handleOnSubmitAppPress = () => {
    navigateToWebView({
      url: configuration?.DAPP_SUBMIT_URL,
      title: 'Submit dApp',
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator animating />
        </View>
      ) : (
        <View style={styles.content}>
          <ScrollView style={styles.scrollView}>
            {dApps.map((dapp: DApp, index: number) => (
              <CRowItemButton
                style={[styles.row, index !== 0 && styles.rowItem]}
                key={`dapp-${dapp.name}`}
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
          {configuration?.DAPP_SUBMIT_URL && (
            <View>
              <Text style={styles.questionTitle}>Are you a developer?</Text>
              <Text style={styles.questionDescription}>
                If you have dApp want to add to list, please submit{' '}
                <TouchableOpacity onPress={handleOnSubmitAppPress}>
                  <Text style={[styles.questionDescription, styles.questionLink]}>here.</Text>
                </TouchableOpacity>
              </Text>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
  },
  scrollView: {},
  questionTitle: {
    ...textStyles.Sub2,
  },
  questionDescription: {
    ...textStyles.Body2,
    fontSize: scale(12),
  },
  questionLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default HomePageContent;
