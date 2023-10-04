import { CButton, CInput, Row } from 'components';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import { colors, IconArrowUp, IconCloseFilledN2, IconLogo, IconSearch, textStyles } from 'assets';
import { images } from 'assets';
import { device, scale } from 'device';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNFTsInfo } from 'utils/hooks/useNFTsInfo';
import { getPublicKey } from 'utils/selectors';
import { NFTContent } from './NFTContent';

const hitSlop = { top: 10, bottom: 10, right: 10 };

type TSortField = 'nftName' | 'contractName';

function NFTScreen() {
  const { top } = useSafeAreaInsets();

  const [sort, setSort] = useState<TSortField>('nftName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<any>();
  const publicKey = useSelector(getPublicKey);
  const { filteredData: nfts, isLoading, isFetching, refetch } = useNFTsInfo(publicKey, search, sort, order);

  const onFilterWith = (type: TSortField) => {
    if (type !== sort) {
      setSort(type);
      setOrder('desc');
    } else {
      setOrder((currentOrder) => (currentOrder === 'asc' ? 'desc' : 'asc'));
    }
  };

  const onClearSearch = () => {
    setSearch('');
    inputRef.current?.setText('');
    inputRef.current?.blur();
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} translucent={true} barStyle="dark-content" animated={true} />
      <Row ml={24} mt={10} mb={16} style={styles.header}>
        <IconLogo width={scale(28)} height={scale(28)} />
        <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>My Collection</Text>
      </Row>
      <View style={styles.searchWrapper}>
        <IconSearch style={styles.iconSearch} />
        <CInput
          ref={inputRef}
          onChangeText={(text) => {
            setSearch(text);
          }}
          placeholder="Enter name"
          placeholderTextColor={colors.N4}
          containerStyle={styles.containerInputStyle}
          inputStyle={styles.inputSearch}
          rightComponent={
            !!search && (
              <CButton onPress={onClearSearch} hitSlop={hitSlop}>
                <IconCloseFilledN2 width={scale(20)} height={scale(20)} style={styles.icClearText} />
              </CButton>
            )
          }
        />
      </View>
      <View style={styles.sortWrapper}>
        <TouchableOpacity style={styles.btnFilter} onPress={() => onFilterWith('nftName')}>
          <Text style={styles.titleSelect}>Name</Text>
          <IconArrowUp
            style={[{ transform: [{ rotate: sort === 'nftName' && order === 'desc' ? '180deg' : '0deg' }] }]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnFilter} onPress={() => onFilterWith('contractName')}>
          <Text style={styles.titleSelect}>Contract Name</Text>
          <IconArrowUp
            style={[
              {
                transform: [{ rotate: sort === 'contractName' && order === 'desc' ? '180deg' : '0deg' }],
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.nftListWrapper, { minHeight: scale(315) }]}>
        {isLoading ? (
          <View style={styles.flexCenter}>
            <ActivityIndicator size="small" color={colors.N2} />
          </View>
        ) : (
          <NFTContent nfts={nfts} isFetching={isFetching} refetch={refetch} />
        )}
      </View>
      <Image source={images.bgnft2} style={styles.bg} />
    </View>
  );
}

export default NFTScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    height: device.h,
    position: 'relative',
  },
  header: { alignItems: 'center' },
  sortWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
    marginBottom: scale(26),
    marginTop: scale(16),
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  bg: {
    width: '100%',
    height: device.h + 110,
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
  },
  title: {
    ...textStyles.H3,
    color: colors.N700,
    paddingLeft: scale(15),
    paddingBottom: scale(24),
  },
  iconSearch: {
    position: 'absolute',
    top: '50%',
    left: scale(20),
    zIndex: 2,
    width: scale(20),
    height: scale(15),
    transform: [{ translateY: -scale(15) }],
  },
  filter: {
    transform: [{ rotate: '180deg' }],
  },
  searchWrapper: {
    position: 'relative',
    height: scale(55),
    marginHorizontal: scale(16),
  },
  containerInputStyle: {
    borderWidth: 0,
    borderRadius: scale(50),
    backgroundColor: colors.W1,
  },
  inputSearch: {
    fontSize: scale(16),
    paddingLeft: scale(54),
    backgroundColor: colors.W1,
    borderRadius: scale(50),
    paddingRight: scale(30),
  },
  btnFilter: {
    backgroundColor: colors.cFFFFFF,
    borderRadius: scale(50),
    width: scale(164),
    height: scale(50),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
  },
  nftListWrapper: {
    paddingTop: scale(24),
    paddingHorizontal: scale(16),
    backgroundColor: colors.cFFFFFF,
    borderTopRightRadius: scale(40),
    borderTopLeftRadius: scale(40),
  },
  titleSelect: {
    ...textStyles.Body1,
    fontSize: scale(14),
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icClearText: {
    right: scale(20),
  },
});
