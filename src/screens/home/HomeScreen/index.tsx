import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  colors,
  textStyles,
  IconSetting,
  IconPlusCircle,
  IconLogo,
} from 'assets';
import { CButton, CLayout, Col, Row } from 'components';
import { scale } from 'device';
import { useNavigation } from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TokenComponent from 'screens/home/HomeScreen/components/TokenComponent';
import { getAllTokenInfo, getPublicKey } from 'utils/selectors/user';
import Account from 'screens/home/HomeScreen/components/Account';
import {
  checkIfLoadingSelector,
  checkIfRefreshingSelector,
} from 'utils/selectors';
import { types as homeTypes } from 'redux_manager/home/home_action';
import { types as userTypes } from 'redux_manager/user/user_action';
import { Config } from 'utils';

function HomeScreen() {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const publicKey = useSelector(getPublicKey);
  const allTokenInfo = useSelector(getAllTokenInfo);

  const isLoading = useSelector((state: any) =>
    // @ts-ignore
    checkIfLoadingSelector(state, [
      homeTypes.GET_TOKEN_INFO_WITH_BALANCE,
      homeTypes.FETCH_CSPR_MARKET_INFO,
      userTypes.GET_ACCOUNT_INFORMATION,
      userTypes.GET_ACCOUNTS,
    ]),
  );
  // @ts-ignore
  const isRefreshing = useSelector((state: any) =>
    // @ts-ignore
    checkIfRefreshingSelector(state, [
      homeTypes.GET_TOKEN_INFO_WITH_BALANCE,
      homeTypes.FETCH_CSPR_MARKET_INFO,
      userTypes.GET_ACCOUNT_INFORMATION,
      userTypes.GET_ACCOUNTS,
    ]),
  );

  useEffect(() => {
    if (publicKey) {
      dispatch(
        allActions.user.getAccountInformation(
          { publicKey },
          async (err: any) => {
            if (err) {
              Config.alertMess(err);
            }
          },
        ),
      );
    }
  }, [publicKey, dispatch]);

  const onRefresh = () => {
    getAccountInformation(true);
    getData(true);
  };

  const showErrorMessage = useCallback(
    (error: any) => {
      const message = {
        message: error && error.message ? error.message : 'Error',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message));
    },
    [dispatch],
  );

  const getAccountInformation = (refreshing: boolean) => {
    dispatch(
      allActions.user.getAccountInformation({ refreshing }, (error: any) => {
        if (error) {
          showErrorMessage(error);
        }
      }),
    );
  };

  const getTokenInfoWithBalance = useCallback(
    (refreshing: boolean) => {
      dispatch(
        allActions.home.getTokenInfoWithBalance(
          { refreshing },
          (error: any) => {
            if (error) {
              showErrorMessage(error);
            }
          },
        ),
      );
    },
    [dispatch, showErrorMessage],
  );

  const fetchCSPRMarketInfo = useCallback(
    (refreshing: boolean) => {
      dispatch(
        allActions.home.fetchCSPRMarketInfo({ refreshing }, (error: any) => {
          if (error) {
            showErrorMessage(error);
          }
        }),
      );
    },
    [showErrorMessage, dispatch],
  );

  const getData = useCallback(
    (refreshing: boolean) => {
      fetchCSPRMarketInfo(refreshing);
      getTokenInfoWithBalance(refreshing);
    },
    [getTokenInfoWithBalance, fetchCSPRMarketInfo],
  );

  useEffect(() => {
    getData(false);
  }, [getData]);

  const openHistories = (token: any) => {
    navigate(MainRouter.HISTORIES_SCREEN, { token });
  };

  const _renderListTokens = () => {
    const height = insets.bottom === 0 ? 0 : insets.bottom + scale(72);
    return (
      <Col
        style={[
          styles.listContainer,
          {
            paddingBottom: scale(72) + insets.bottom,
            minHeight: scale(315) + height,
          },
        ]}>
        {isLoading ? (
          <View style={styles.flexCenter}>
            <ActivityIndicator size="small" color={colors.N2} />
          </View>
        ) : (
          <ScrollView>
            {allTokenInfo &&
              allTokenInfo.length > 0 &&
              allTokenInfo.map((value, i) => {
                return (
                  <TokenComponent
                    value={value}
                    key={i}
                    onPress={openHistories}
                  />
                );
              })}
            <CButton
              onPress={() => navigate(MainRouter.ADD_CUSTOM_TOKEN_SCREEN)}
              style={{ marginTop: scale(16) }}>
              <Row mx={16} style={styles.alignCenter}>
                <IconPlusCircle width={scale(14)} height={scale(14)} />
                <Text style={[textStyles.Body1, { marginLeft: scale(8) }]}>
                  Add Custom Token
                </Text>
              </Row>
            </CButton>
          </ScrollView>
        )}
      </Col>
    );
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <Row.LR pl={24} pr={16} pt={10} pb={20}>
          <Row style={styles.alignCenter}>
            <IconLogo width={scale(28)} height={scale(28)} />
            <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>Home</Text>
          </Row>
          <Row.C>
            <CButton
              onPress={() => navigate(MainRouter.SETTINGS_SCREEN)}
              style={styles.circleBtn}>
              <IconSetting width={scale(21)} height={scale(21)} />
            </CButton>
            {/*TODO: follow the figma's design*/}
            {/*<CButton style={[styles.circleBtn, {marginLeft: scale(16)}]}>
                            <IconScanCode width={scale(21)} height={scale(21)}/>
                        </CButton>*/}
          </Row.C>
        </Row.LR>
        <ScrollView
          nestedScrollEnabled
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          <Account />
          {_renderListTokens()}
        </ScrollView>
      </View>
    </CLayout>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  circleBtn: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: colors.W1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContainer: {
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
});
