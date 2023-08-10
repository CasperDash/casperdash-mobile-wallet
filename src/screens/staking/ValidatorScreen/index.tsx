import { colors, images, textStyles } from 'assets';
import { CHeader, CInput, CLayout, Col } from 'components';
import { scale } from 'device';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ValidatorItem from 'screens/staking/ValidatorScreen/ValidatorItem';
import { useNavigation } from '@react-navigation/native';
import { IValidator, useValidators, useValidatorsDetail } from 'utils/hooks/useValidators';
import { ScreenProps } from 'navigation/ScreenProps';

function ValidatorScreen({ route }: ScreenProps<'VALIDATOR_SCREEN'>) {
  const insets = useSafeAreaInsets();
  const { callbackScreen } = route.params;
  const { navigate } = useNavigation<any>();

  const { data: validatorsDetail, isLoading: isLoadingValidatorsDetail, isFetching } = useValidatorsDetail();

  const [search, setSearch] = useState('');
  const { filteredData: listValidators, refetch, isLoading } = useValidators(search);

  const onSelectValidator = (validator: IValidator) => {
    navigate('Staking', {
      screen: callbackScreen,
      params: {
        selectedValidator: validator,
      },
      merge: true,
    });
  };

  const renderItem = ({ item, index }: { item: IValidator; index: number }) => {
    return (
      <ValidatorItem
        data={item}
        key={`${index} - ${item.validatorPublicKey}`}
        onSelectValidator={onSelectValidator}
        validatorsDetail={validatorsDetail}
      />
    );
  };

  const renderNoData = () => {
    return (
      <View style={styles.noNFT}>
        {isLoading || isLoadingValidatorsDetail ? (
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
    <CLayout statusBgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} bgColor={colors.cF8F8F8}>
      <CHeader title={'Select Validator'} style={styles.headerContainer} />
      <Col mt={16} style={styles.container}>
        <View style={{ paddingHorizontal: scale(16), paddingTop: scale(4) }}>
          <Text style={styles.title}>Validator</Text>
          <CInput
            onChangeText={setSearch}
            style={styles.input}
            placeholder={'Search by name or public key'}
            placeholderTextColor={colors.N3}
          />
        </View>
        <View style={styles.headerList}>
          <Text style={styles.title}>Validator List ({listValidators.length || 0})</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + scale(20),
            minHeight: scale(400),
          }}
          data={listValidators}
          extraData={listValidators}
          refreshing={isFetching}
          onRefresh={refetch}
          keyExtractor={(item, index) => `${index} - ${item.validatorPublicKey}`}
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
