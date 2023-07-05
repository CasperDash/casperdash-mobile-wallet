import React, { useEffect } from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import { CLayout, Col } from 'components';
import { images } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import Sentry from '@sentry/react-native';

export const ErrorFallback = ({ resetErrorBoundary, error }: { error: any; resetErrorBoundary: any }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <CLayout>
      <Col style={styles.flex}>
        <Col.C style={styles.topContainer}>
          <Image source={images.logo} style={styles.logo} />
        </Col.C>
        <Col.C>
          <Text>Oops! Something went wrong. Please try again.</Text>
          <CTextButton onPress={resetErrorBoundary} text="Retry" style={[styles.button]} />
        </Col.C>
      </Col>
    </CLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
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
  button: {
    width: scale(136),
    height: scale(40),
    marginTop: scale(20),
  },
});
