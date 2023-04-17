import React, { useCallback, useEffect, useRef, useState } from 'react';
import { colors, IconLogo, textStyles } from 'assets';
import { Row, CLayout, Col } from 'components';
import { scale } from 'device';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfLoadingSelector, checkIfRefreshingSelector, getPublicKey } from 'utils/selectors';
import { useScrollToTop } from '@react-navigation/native';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { ScreenProps } from 'navigation/ScreenProps';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { types as stakingTypes } from 'redux_manager/staking/staking_action';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStakeFromValidators, useStakedHistory } from 'utils/hooks/useStakeDeploys';
import StakedInformationItem from 'screens/staking/StakingScreen/StakedInformationItem';
import { IValidator, useValidatorsDetail } from 'utils/hooks/useValidators';
import StakedHistoryItem from './StakedHistoryItem';
import { StakingRewards } from './StakingRewards';
import { NoData } from './NoData';
import StakingForm from './StakingForm';
import { EViews } from '../utils';

// @ts-ignore
const StakingScreen: React.FC<ScreenProps<StakingRouter.STAKING_SCREEN>> = ({
  route,
}: {
  route: { params: { selectedValidator: IValidator } };
}) => {
  const { selectedValidator } = route?.params || {};
  const { bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const scrollViewRef = useRef<any>();
  useScrollToTop(scrollViewRef);

  const { data: validatorsDetail, isLoading: isLoadingValidatorsDetail } = useValidatorsDetail();

  //State
  const [view, setView] = useState<EViews>(EViews.info);

  // Selector
  const publicKey = useSelector(getPublicKey);
  const stackingList = useStakeFromValidators(publicKey!);
  const stakedHistory = useStakedHistory(publicKey!);

  const isLoading = useSelector((state: any) =>
    // @ts-ignore
    checkIfLoadingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

  const isRefreshing = useSelector((state: any) =>
    // @ts-ignore
    checkIfRefreshingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

  const getData = useCallback(
    (refreshing: boolean) => {
      if (isLoading && !refreshing) {
        return;
      }
      dispatch(
        allActions.staking.getValidatorsInformation({ refreshing, publicKey }, (error: any, _: any) => {
          if (error) {
            dispatch(
              allActions.main.showMessage({
                message: error.message,
                type: MessageType.error,
              }),
            );
          }
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, publicKey],
  );

  useEffect(() => {
    getData(false);
  }, [getData]);

  const renderItems = () => {
    const listItems = view === EViews.history ? stakedHistory : stackingList;
    const Comp = view === EViews.history ? StakedHistoryItem : StakedInformationItem;
    return listItems && listItems.length > 0 ? (
      listItems.map((item: any, index: any) => {
        return <Comp value={item} key={index} validatorsDetail={validatorsDetail} />;
      })
    ) : (
      <NoData isLoading={isLoading || isLoadingValidatorsDetail} bottom={bottom} />
    );
  };

  const renderStakingForm = () => (
    <StakingForm
      publicKey={publicKey!}
      setView={setView}
      view={view}
      selectedValidator={selectedValidator}
      isRefreshing={isRefreshing}
    />
  );

  return (
    <CLayout statusBgColor={colors.cF8F8F8} bgColor={colors.cF8F8F8}>
      <Row pl={24} pr={16} pt={10} pb={22} style={styles.alignCenter}>
        <IconLogo width={scale(28)} height={scale(28)} />
        <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>Staking</Text>
      </Row>
      <Col style={styles.container}>
        {view === EViews.rewards ? (
          <View style={{ marginTop: scale(22) }}>
            {renderStakingForm()}
            <StakingRewards publicKey={publicKey!} />
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: scale(22) }}
            contentContainerStyle={styles.contentContainerStyle}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => getData(true)} />}
          >
            {renderStakingForm()}
            {renderItems()}
          </ScrollView>
        )}
      </Col>
    </CLayout>
  );
};

export default StakingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  contentContainerStyle: {
    paddingBottom: scale(100),
  },
  alignCenter: {
    alignItems: 'center',
  },
});
