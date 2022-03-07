import {CInput, Row} from 'components';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {colors, IconArrowUp, IconLogo, IconSearch, textStyles} from 'assets';
import { images } from 'assets';
import { device, scale } from 'device';
import NFTItem from './ListItem';
import { orderBy } from 'lodash';
import {nonAccentText} from 'utils/helpers/format';
import _ from 'lodash';
import {allActions} from 'redux_manager';
import {useDispatch} from 'react-redux';
import {useSafeAreaInsets} from "react-native-safe-area-context";

function NFTScreen() {
  const dispatch = useDispatch();
  const {top} = useSafeAreaInsets();
  const [isLoading, setLoading] = useState(true);
  const [nfts, setNFTs] = useState([]);
  const listNFTs = useRef<any>();
  const [sort, setSort] = useState('nftName');
  const [reload, setReload] = useState(false);
  const [filterName, setFilterName] = useState(false);
  const [filterContractName, setFilterContractName] = useState(false);

  useEffect(() => {
    getData(false);
  }, []);

  const getData = (isRefresh: boolean) => {
    dispatch(allActions.nft.fetchNFTInfo((error: any, data: any) => {
      if (data) {
        listNFTs.current = data;
        if (isRefresh){
          // @ts-ignore
          setNFTs(orderBy(data, 'nftName', 'asc'));
        }
        else {
          setNFTs(data);
        }
      }
      setReload(false);
      setLoading(false);
    }));
  };

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

  const onChangeText = (text: string) => {
    if (!text){
      setNFTs(listNFTs.current);
      return;
    }
    if (text && listNFTs.current){
      const newFilterArr = listNFTs.current.filter((x: any) => nonAccentText(x.nftName).includes(nonAccentText(text)));
      setNFTs(newFilterArr);
    }
  };

  const onReload = () => {
    setReload(true);
    getData(true);
  };

  const renderItem = ({item, index}: { item: any, index: number }) => {
    return <NFTItem data={item} key={`${index} - ${item.tokenId}`} index={index}/>;
  };

  const renderNoData = () => {
    return <View style={styles.noNFT}>
      <Image source={images.nonft} style={styles.imageNoNFT} />
      <Text style={styles.textNoNFT}>There is no NFT</Text>
    </View>;
  };

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <StatusBar
        backgroundColor={'rgba(52, 52, 52, 0)'}
        translucent={true}
        barStyle="dark-content"
        animated={true}
      />
      <Row ml={24} mt={10} mb={16} style={{alignItems: 'center'}}>
        <IconLogo width={scale(28)} height={scale(28)}/>
        <Text style={[textStyles.H3, {marginLeft: scale(16)}]}>My NFT</Text>
      </Row>
      <View style={styles.searchWrapper}>
        <IconSearch style={styles.iconSearch} />
        <CInput
          onChangeText={_.debounce(onChangeText, 500)}
          placeholder="Enter name"
          placeholderTextColor={colors.N4}
          containerStyle={styles.containerInputStyle}
          inputStyle={styles.inputSearch}
        />
      </View>
      <View style={styles.sortWrapper}>
        <TouchableOpacity
          style={styles.btnFilter}
          onPress={() => onFilterWith('nftName')}>
          <Text style={styles.titleSelect}>Name</Text>
          <IconArrowUp
            style={[
              { transform: [{ rotate: filterName ? '180deg' : '0deg' }] },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnFilter}
          onPress={() => onFilterWith('nftContractName')}>
          <Text style={styles.titleSelect}>Contract Name</Text>
          <IconArrowUp
            style={[
              {
                transform: [{ rotate: filterContractName ? '180deg' : '0deg' }],
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.nftListWrapper, {minHeight: scale(315)}]}>
        {isLoading ? <View style={styles.flexCenter}>
          <ActivityIndicator size="small" color={colors.N2}/>
        </View> : (
          <View>
            <Text style={styles.numNft}>
              {nfts.length + ' NFTs'}
            </Text>
            <FlatList
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.nftsList}
                data={nfts}
                refreshing={reload}
                extraData={nfts}
                onRefresh={onReload}
                keyExtractor={(item, index) => `${index} - ${item.tokenId}`}
                ListEmptyComponent={renderNoData}
                renderItem={renderItem}
            />
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
    left: 20,
    zIndex: 2,
    width: 20,
    height: 15,
    transform: [{ translateY: -15 }],
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
  nftsList: {
    paddingBottom: scale(310),
  },
  numNft: {
    ...textStyles.Sub1,
    marginBottom: scale(24),
  },
  noNFT: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scale(60),
    marginBottom: scale(20),
  },
  imageNoNFT: {
    width: scale(200),
    height: scale(200),
  },
  textNoNFT: {
    ...textStyles.Body1,
    color: colors.N4,
  },
  titleSelect:  {
    ...textStyles.Body1,
    fontSize: scale(14),
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
