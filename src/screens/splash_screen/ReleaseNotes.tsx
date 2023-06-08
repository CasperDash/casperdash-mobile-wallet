import { CheckBox } from '@rneui/themed';
import { CAlert } from 'components';
import * as React from 'react';
import { Config, Keys } from 'utils';
import { useReleaseNotes } from 'utils/hooks/useReleaseNotes';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Text, View, Linking, StyleSheet } from 'react-native';
import { checkVersion, CheckVersionResponse } from 'react-native-check-version';
import Splash from 'react-native-splash-screen';
import { colors } from 'assets';
import { scale } from 'device';
import { IReleaseNotes } from 'services/ReleaseNotes/releaseNotes';

interface IReleaseNotesProps {
  onFinish: () => void;
}

const ReleaseNotes: React.FunctionComponent<IReleaseNotesProps> = ({ onFinish }) => {
  const [shouldShowAgain, setShouldShowAgain] = React.useState(false);
  const [newVersionInfo, setNewVersionInfo] = React.useState<CheckVersionResponse>();
  const [isLoadingVersion, setIsLoadingVersion] = React.useState(false);

  const alertRef = React.useRef<any>();

  const { isLoading, refetch: fetchReleaseNotes } = useReleaseNotes({ enabled: false });

  const showReleaseNotes = React.useCallback(
    (releaseNotes: IReleaseNotes[]) => {
      const isForceUpdate = releaseNotes?.some((item) => item.isForceUpdate);
      const alert = {
        buttonLeft: 'Skip',
        buttonRight: 'Update',
        showButtonLeft: !isForceUpdate,
        alertMessage: (
          <>
            <ScrollView style={styles.container}>
              <Text style={styles.title}>New version available!!</Text>
              {releaseNotes?.map((item) => (
                <View key={item.version} style={{ flex: 1 }}>
                  <Text style={styles.version}>{item.version}</Text>
                  {item.releaseNotes?.map((note, index) => (
                    <Text key={index}>- {note}</Text>
                  ))}
                </View>
              ))}
            </ScrollView>
            <CheckBox
              onPress={() => setShouldShowAgain((prev) => !prev)}
              checked={shouldShowAgain}
              title="Do not show again"
              checkedColor={colors.R1}
            />
          </>
        ),
      };
      alertRef.current.show(alert);
    },
    [shouldShowAgain],
  );

  React.useEffect(() => {
    Splash.hide();
    setIsLoadingVersion(true);
    async function checkUpdateVersion() {
      const newVersion = await checkVersion();
      // return if no need update
      if (!newVersion.needsUpdate) {
        onFinish();
        return;
      }
      const skipVersion = await Config.getItem(Keys.skipShowReleaseNotesVersion);
      // return if skip show on current version
      if (skipVersion === newVersion.version) {
        onFinish();
        return;
      }
      // set state info
      setNewVersionInfo(newVersion);
      const res = await fetchReleaseNotes();
      setIsLoadingVersion(false);
      if (res.data?.length) {
        showReleaseNotes(res.data);
      } else {
        onFinish();
      }
    }
    checkUpdateVersion();
  }, [onFinish, showReleaseNotes, fetchReleaseNotes]);

  const updateSkipFlag = async () => {
    if (shouldShowAgain) {
      await Config.saveItem(Keys.skipShowReleaseNotesVersion, newVersionInfo?.version);
    }
  };

  const onCancel = async () => {
    await updateSkipFlag();
    onFinish();
  };

  const onConfirm = async () => {
    await updateSkipFlag();
    if (newVersionInfo?.url) {
      Linking.openURL(newVersionInfo?.url);
    }
    onFinish();
  };

  return (
    <>
      {(isLoading || isLoadingVersion) && <ActivityIndicator />}
      <CAlert ref={alertRef} hideClose onCancel={onCancel} onConfirm={onConfirm} hideOnClickOutside={false} />
    </>
  );
};

export default ReleaseNotes;

const styles = StyleSheet.create({
  container: {
    maxHeight: scale(200),
  },
  title: {
    color: colors.R1,
    marginBottom: scale(4),
    fontWeight: '600',
    fontSize: scale(20),
  },
  version: {
    fontWeight: '700',
    marginBottom: scale(2),
    fontSize: scale(16),
    marginTop: scale(4),
  },
});
