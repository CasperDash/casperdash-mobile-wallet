import { IconReload, IconUser, colors } from 'assets';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { scale } from 'device';
import { useLoadingProgress } from 'screens/browser/hooks/useLoadingProgress';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';
import { getwebUrl } from 'utils/selectors';
import ModalAccount from '../ModalAccount';
import _ from 'lodash';
import { useConnectedSite } from 'screens/browser/hooks/useConnectedSite';

const BrowserHeadBar = () => {
  const webUrl = useSelector(getwebUrl);
  const { isLoading: isWebLoading, cancel } = useLoadingProgress();
  const [url, setUrl] = useState(webUrl);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const { go, reload } = useWebNavigate();
  const { isConnected } = useConnectedSite();

  const handleOnSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const edittedUrl = event.nativeEvent.text;
    if (edittedUrl === webUrl) {
      reload();
    }

    go(edittedUrl);
  };

  const handleOnReloadPress = () => {
    reload();
  };

  const handleOnLoadingPress = () => {
    cancel();
  };

  const handleOnAccountPress = () => {
    setIsAccountVisible(true);
  };

  useEffect(() => {
    setUrl(webUrl);
  }, [webUrl]);

  const isDisabledAccount = _.isEmpty(webUrl) || !isConnected || isWebLoading;
  const isDisabledReload = _.isEmpty(webUrl);

  return (
    <View style={styles.container}>
      <View style={styles.home}>
        {isWebLoading ? (
          <TouchableOpacity onPress={handleOnLoadingPress}>
            <ActivityIndicator size="small" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleOnReloadPress} disabled={isDisabledReload}>
            <IconReload
              width={scale(18)}
              height={scale(18)}
              color={isDisabledReload ? colors.cB2B2B2 : colors.c000000}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          onSubmitEditing={handleOnSubmit}
          style={styles.input}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholder="Search or enter website name"
          value={url}
          onChangeText={(text) => {
            setUrl(text);
          }}
        />
      </View>
      <View>
        <TouchableOpacity onPress={handleOnAccountPress} disabled={isDisabledAccount}>
          <IconUser color={isDisabledAccount ? colors.cB2B2B2 : colors.c000000} />
        </TouchableOpacity>
        <ModalAccount isVisible={isAccountVisible} onClose={() => setIsAccountVisible(false)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingHorizontal: scale(10),
  },
  home: {
    flexBasis: scale(20),
  },
  inputWrapper: {
    marginHorizontal: scale(10),
    flex: 1,
    paddingHorizontal: scale(16),
    borderRadius: scale(16),
    backgroundColor: colors.cFFFFFF,
  },
  input: {
    height: scale(48),
    color: colors.c000000,
    paddingVertical: 0,
    fontSize: scale(12),
    textAlignVertical: 'center',
  },
  homeIcon: {
    width: scale(10),
    height: scale(10),
  },
});

export default BrowserHeadBar;
