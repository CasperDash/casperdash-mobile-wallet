import { colors, images, textStyles } from 'assets';
import { CHeader, CInput, CLayout, Col } from 'components';
import { scale } from 'device';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getListValidators } from 'utils/selectors/validator';
import {
  checkIfLoadingSelector,
  checkIfRefreshingSelector,
  getPublicKey,
} from 'utils/selectors';
import { types as stakingTypes } from 'redux_manager/staking/staking_action';
import ValidatorItem from 'screens/staking/ValidatorScreen/ValidatorItem';
import { useNavigation } from '@react-navigation/native';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';

// @ts-ignore
function ValidatorScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const publicKey = useSelector(getPublicKey);
  const isLoading = useSelector((state: any) =>
    // @ts-ignore
    checkIfLoadingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

  const isRefreshing = useSelector((state: any) =>
    // @ts-ignore
    checkIfRefreshingSelector(state, [stakingTypes.GET_VALIDATORS_INFORMATION]),
  );

  const [search, setSearch] = useState('');
  const listValidators = useSelector(getListValidators(search));

  const onReload = () => {
    dispatch(
      allActions.staking.getValidatorsInformation(
        { refreshing: true, publicKey },
        (error: any, _: any) => {
          if (error) {
            console.error(error);
            dispatch(
              allActions.main.showMessage({
                message: error.message,
                type: MessageType.error,
              }),
            );
          }
        },
      ),
    );
  };

  const onSelectValidator = (validator: any) => {
    navigate('Staking', {
      screen: StakingRouter.STAKING_SCREEN,
      params: {
        selectedValidator: validator,
      },
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <ValidatorItem
        data={item}
        key={`${index} - ${item.public_key}`}
        onSelectValidator={onSelectValidator}
      />
    );
  };

  const renderNoData = () => {
    return (
      <View style={styles.noNFT}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.N2} />
        ) : (
          <>
            <Image source={images.nonft} style={styles.imgNft} />
            <Text style={styles.txtNoValidator}>There is no Validator</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <CLayout
      statusBgColor={colors.cF8F8F8}
      edges={['right', 'top', 'left']}
      bgColor={colors.cF8F8F8}>
      <CHeader title={'Select Validator'} style={styles.headerContainer} />
      <Col mt={16} style={styles.container}>
        <View style={{ paddingHorizontal: scale(16), paddingTop: scale(4) }}>
          <Text style={styles.title}>Validator</Text>
          <CInput
            onChangeText={setSearch}
            style={styles.input}
            placeholder={'Enter Validator'}
            placeholderTextColor={colors.N3}
          />
        </View>
        <View style={styles.headerList}>
          <Text style={styles.title}>
            Validator List ({listValidators.length || 0})
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + scale(20),
            minHeight: scale(400),
          }}
          data={listValidators}
          extraData={listValidators}
          refreshing={isRefreshing}
          onRefresh={onReload}
          keyExtractor={(item, index) => `${index} - ${item.tokenId}`}
          ListEmptyComponent={renderNoData}
          renderItem={renderItem}
        />
      </Col>
    </CLayout>
  );
}

export default ValidatorScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.cFFFFFF,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginTop: scale(20),
    marginBottom: scale(16),
  },
  headerContainer: {
    backgroundColor: colors.cF8F8F8,
    justifyContent: 'flex-start',
    paddingLeft: scale(24),
  },
  input: {
    ...textStyles.Body1,
    color: colors.N2,
    borderRadius: scale(16),
    width: scale(375 - 16 * 2),
    height: scale(48),
    backgroundColor: colors.N5,
    alignItems: 'center',
    marginBottom: scale(32),
  },
  nameValidator: {
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
  },
  headerList: {
    borderTopColor: colors.N5,
    borderTopWidth: scale(2),
    paddingHorizontal: scale(16),
  },
  txtNoValidator: {
    ...textStyles.Body1,
    color: colors.N4,
  },
  noNFT: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(60),
  },
  contentContainerStyle: {},
  imgNft: {
    width: scale(200),
    height: scale(200),
  },
});
