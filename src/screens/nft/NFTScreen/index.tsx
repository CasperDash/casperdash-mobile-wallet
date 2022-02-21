/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CInput, CLayout } from 'components';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AppEth from '@ledgerhq/hw-app-eth';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';

import { colors, IconArrowUp, IconSearch } from 'assets';
import { images } from 'assets';
import { device, scale } from 'device';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlatList } from 'react-native-gesture-handler';

import NFTItem from './ListItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNFTInfo,
  sortNFTs,
  types,
} from '../../../redux_manager/nft/nft_action';
import { Config, Keys } from 'utils';
import { orderBy } from 'lodash';
import { navigate } from 'navigation/RootNavigation';
import NFTRouter from 'navigation/NFTNavigation/NFTRouter';

function NFTScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearchName] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [nfts, setNFTs] = useState([]);
  const [sort, setSort] = useState('nftName');
  const [reaload, setReload] = useState(false);
  const [filterName, setFilterName] = useState(false);
  const [filterContractName, setFilterContractName] = useState(false);

  const onFilterWith = (type: string) => {
    if (type === 'nftName') {
      setFilterName(!filterName);
    }
    setFilterContractName(!filterContractName);
    if (type === sort) {
      return nfts.reverse();
    }
    const newSortArr = orderBy(nfts, `${type}`, 'asc');
    setNFTs(newSortArr);
    setSort(type);
  };
  const onSubmitEdit = () => {
    if (search.length === 0) {
      setReload(true);
    }
    const newFillterArr = nfts.filter(
      x => x.nftName.toLowerCase().indexOf(search.toLowerCase()) > -1,
    );
    setNFTs(newFillterArr);
  };
  const loadTest = () => {
    navigate(NFTRouter.NFT_DETAIL, {
      metadata: [],
      background: 'nftBackground',
      totalSupply: 1,
    });
  };
  useEffect(() => {
    const loadNfts = async () => {
      const response = await Config.getItem(Keys.nfts);
      if (response) {
        setNFTs(response);
        setLoading(false);
        setReload(false);
      }
      setLoading(false);
      setReload(false);
    };
    loadNfts();
  }, [reaload]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'rgba(52, 52, 52, 0)'}
        translucent={true}
        barStyle="dark-content"
        animated={true}
      />
      <Text style={styles.title}>My NFT</Text>
      <View style={styles.searchWrapper}>
        <IconSearch style={styles.iconSearch} />
        <CInput
          onChangeText={setSearchName}
          placeholder="Enter name"
          containerStyle={styles.containerInputStyle}
          inputStyle={styles.inputSearch}
          onSubmitEditing={onSubmitEdit}
        />
      </View>
      <View style={styles.sortWrapper}>
        <TouchableOpacity
          style={styles.btnFilter}
          onPress={() => onFilterWith('nftName')}>
          <Text>Name</Text>
          <IconArrowUp
            style={[
              { transform: [{ rotate: filterName ? '180deg' : '0deg' }] },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnFilter}
          onPress={() => onFilterWith('nftContractName')}>
          <Text>Contract Name</Text>
          <IconArrowUp
            style={[
              {
                transform: [{ rotate: filterContractName ? '180deg' : '0deg' }],
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.nftListWrapper}>
        {isLoading ? (
          <Text>Loading ...</Text>
        ) : (
          <View>
            <Text style={styles.numNft}>
              {nfts.length === 1
                ? 'a ' + nfts.length + 'NFT'
                : nfts.length + ' NFTs'}
            </Text>
            {nfts.length === 0 ? (
              <View style={styles.noNFT}>
                <Image source={images.nonft} style={styles.imageNoNFT} />
                <Text style={styles.textNoNFT}>There is no NFT</Text>
              </View>
            ) : (
              <View>
                <FlatList
                  data={nfts}
                  renderItem={({ item }) => <NFTItem data={item} />}
                  keyExtractor={nfts.tokenId}
                  numColumns={2}
                  style={styles.flaslist}
                  refreshing={reaload}
                  columnWrapperStyle={styles.columnWrapper}
                />
              </View>
            )}
          </View>
        )}
      </View>
      <Image source={images.bgnft} style={styles.bg} />
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
    paddingTop: scale(46),
  },
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
    height: device.h + 90,
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
  },
  title: {
    fontSize: scale(32),
    fontWeight: '600',
    paddingLeft: scale(15),
    paddingBottom: scale(24),
  },

  iconSearch: {
    position: 'absolute',
    top: '50%',
    left: 20,
    zIndex: 2,
    width: 20,
    height: 15,
    transform: [{ translateY: -15 }],
  },
  filter: {
    transform: [{ rotate: '180deg' }],
  },
  notfilter: {
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
    paddingHorizontal: scale(30),
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
  flaslist: {
    marginBottom: scale(370),
  },
  numNft: {
    color: colors.N2,
    fontSize: scale(16),
    marginBottom: scale(24),
  },
  noNFT: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scale(60),
  },
  imageNoNFT: {},
  imageNFT: {
    width: '100%',
    height: scale(126),
    borderRadius: scale(16),
  },
  textNoNFT: {
    color: colors.N4,
    fontSize: scale(16),
  },
});
