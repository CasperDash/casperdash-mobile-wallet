import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  tabs: any[];
};

const ListBrowserTabs = ({ tabs }: Props) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        return (
          <View key={index}>
            <Text>{tab.title}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ListBrowserTabs;
