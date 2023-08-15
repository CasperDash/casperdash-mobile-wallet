import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, textStyles, IconSetting, IconLogo } from 'assets';
import { CButton, CLayout, Row } from 'components';
import { scale } from 'device';
import MainRouter from 'navigation/stack/MainRouter';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';
import { useDispatch, useSelector } from 'react-redux';
import TokenComponent from 'screens/home/HomeScreen/components/TokenComponent';
import { getPublicKey } from 'utils/selectors/user';
import Account from 'screens/home/HomeScreen/components/Account';
import { useTokenInfoByPublicKey } from 'utils/hooks/useTokenInfo';
import { News } from './components/News';
import { useStackNavigation } from 'utils/hooks/useNavigation';

function HomeScreen() {
  const { navigate } = useStackNavigation();
  const dispatch = useDispatch();
  const publicKey = useSelector(getPublicKey);
  const { allTokenInfo, refreshTokenInfo, isFetching, isLoading, isError } = useTokenInfoByPublicKey(publicKey);

  const onRefresh = () => {
    refreshTokenInfo();
  };

  if (isError) {
    const message = {
      message: 'Error on loading account info',
      type: MessageType.error,
    };
    dispatch(allActions.main.showMessage(message));
  }

  const openHistories = (token: any) => {
    navigate(MainRouter.HISTORIES_SCREEN, { token });
  };

  return (
    <CLayout edges={['top', 'left', 'right']} bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <Row.LR pl={24} pr={16} pt={10} pb={8}>
          <Row style={styles.alignCenter}>
            <IconLogo width={scale(28)} height={scale(28)} />
            <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>Home</Text>
          </Row>
          <Row.C>
            <CButton onPress={() => navigate(MainRouter.SETTINGS_SCREEN)} style={styles.circleBtn}>
              <IconSetting width={scale(21)} height={scale(21)} />
            </CButton>
          </Row.C>
        </Row.LR>
        <News />
        <ScrollView
          nestedScrollEnabled
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} style={{ backgroundColor: colors.cF8F8F8 }} />
          }
          showsVerticalScrollIndicator={false}
          style={styles.listTokensWrapper}
        >
          <Account />
          <View style={styles.listContainerWrapper}>
            <View style={[styles.listContainer]}>
              {isLoading ? (
                <View style={styles.flexCenter}>
                  <ActivityIndicator size="small" color={colors.N2} />
                </View>
              ) : (
                <ScrollView>
                  {allTokenInfo &&
                    allTokenInfo.length > 0 &&
                    allTokenInfo.map((value, i) => {
                      return <TokenComponent value={value} key={i} onPress={openHistories} />;
                    })}
                  {/* TODO: support add custom token later
             <CButton onPress={() => navigate(MainRouter.ADD_CUSTOM_TOKEN_SCREEN)} style={{ marginTop: scale(16) }}>
              <Row mx={16} style={styles.alignCenter}>
                <IconPlusCircle width={scale(14)} height={scale(14)} />
                <Text style={[textStyles.Body1, { marginLeft: scale(8) }]}>Add Custom Token</Text>
              </Row>
            </CButton>  */}
                </ScrollView>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </CLayout>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  circleBtn: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: colors.W1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainerWrapper: {
    backgroundColor: colors.cF8F8F8,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    width: scale(375),
    alignSelf: 'center',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  alignCenter: {
    alignItems: 'center',
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTokensWrapper: {
    flex: 1,
    backgroundColor: colors.W1,
  },
});
