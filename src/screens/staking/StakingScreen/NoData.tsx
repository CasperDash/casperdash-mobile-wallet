import * as React from 'react';
import { View, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import { images, colors, textStyles } from 'assets';
import { scale } from 'device';

interface IAppProps {
  isLoading?: boolean;
  bottom: number;
}

export const NoData: React.FC<IAppProps> = ({ isLoading, bottom }) => {
  return (
    <View style={[styles.loadingContainer, { minHeight: scale(150) + bottom }]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.N2} />
      ) : (
        <>
          <Image source={images.nonft} style={styles.imgNoData} />
          <Text
            style={[
              {
                ...textStyles.Body1,
                color: colors.N4,
              },
            ]}
          >
            No Data
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgNoData: {
    width: scale(180),
    height: scale(180),
    resizeMode: 'contain',
  },
});
