import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from 'react-native';

import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { colors, fonts} from 'assets';
import { scale } from 'device';

const CListView = forwardRef((props, ref) => {
  let {
    data,
    keyExtractor,
    numColumns,
    inverted,
    extraData,
    style,
    nestedScrollEnabled,
    showsVerticalScrollIndicator,
    pagingEnabled,
    horizontal,
    renderHeader,
    renderFooter,
    renderPlaceholder,
    renderEmpty,
    renderSeparator,
    renderItem,
    onScroll,
    onContentSizeChange,
    onRefresh,
    onLoadMore,
    contentContainerStyle,
    stickyHeaderIndices,
  } = props;

  const _loadFirst = useRef(false);
  const _loadMore = useRef(true);
  const countLoadFirst = useRef(0);
  const listView = useRef();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //temp value to check when setState
  const isSetRefresh = useRef(false);
  const isSetLoading = useRef(false);

  useImperativeHandle(ref, () => ({
    loadData: loadData,
    scrollToIndex: scrollToIndex,
    scrollToBottom: scrollToBottom,
    scrollToTop: scrollToTop,
  }));

  const _renderHeader = () => {
    if (renderHeader) {
      return renderHeader();
    }
    return null;
  };

  const _renderFooter = () => {
    if (!loading) {
      return null;
    }

    if (renderFooter) {
      return renderFooter();
    }

    if (renderPlaceholder) {
      return !countLoadFirst.current ? (
        <View style={{ flex: 1, width: '100%' }}>
          {[1, 2, 3, 4, 5].map((item, idx) => {
            return renderPlaceholder(item, idx);
          })}
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            paddingVertical: scale(10),
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          {Platform.OS === 'ios' ? (
            <ActivityIndicator animating color={colors.inkBasic} />
          ) : (
            <ActivityIndicator
              animating
              color={colors.inkBasic}
              size={scale(30)}
            />
          )}
        </View>
      );
    } else if (!refreshing) {
      return (
        <View
          style={{
            width: '100%',
            paddingVertical: scale(10),
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          {Platform.OS === 'ios' ? (
            <ActivityIndicator animating color={colors.inkBasic} />
          ) : (
            <ActivityIndicator
              animating
              color={colors.inkBasic}
              size={scale(30)}
            />
          )}
        </View>
      );
    } else {
      return null;
    }
  };

  const _renderEmpty = () => {
    let length = data && data.length;
    if (length > 0 || loading || refreshing || !_loadFirst.current) {
      return null;
    }
    if (renderEmpty) {
      return renderEmpty();
    }
    return <Text style={styles.txtNoData}>{'No data'}</Text>;
  };

  const _renderSeparator = () => {
    if (renderSeparator) {
      return renderSeparator();
    }
    return null;
  };

  const _renderItem = ({ item, index }) => {
    if (renderItem) {
      return renderItem(item, index);
    }
    return null;
  };

  const _onScroll = e => {
    if (onScroll) {
      onScroll(e);
    }
  };

  const _onContentSizeChange = (contentWidth, contentHeight) => {
    if (onContentSizeChange) {
      onContentSizeChange(contentWidth, contentHeight);
    }
  };

  const refresh = () => {
    countLoadFirst.current = 0;
    _loadFirst.current = true;
    _loadMore.current = true;
    isSetRefresh.current = true;
    setRefreshing(true);
  };

  useEffect(() => {
    if (isSetRefresh.current) {
      isSetRefresh.current = false;
      if (onRefresh) {
        onRefresh(() => {
          setRefreshing(false);
          setLoading(false);
        });
      } else {
        setRefreshing(false);
        setLoading(false);
      }
    }
  }, [refreshing]);

  const loadMore = () => {
    if (!_loadMore.current) {
      return;
    }
    _loadMore.current = false;
    _loadFirst.current = true;
    isSetLoading.current = true;
    setLoading(true);
  };

  useEffect(() => {
    if (isSetLoading.current) {
      isSetLoading.current = false;
      if (onLoadMore) {
        onLoadMore(stop => {
          _loadMore.current = !!stop;
          countLoadFirst.current++;
          setLoading(false);
          setRefreshing(false);
        });
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [loading]);

  const scrollToTop = () => {
    listView.current && listView.current.scrollToPosition(0, 0);
  };

  const scrollToBottom = params => {
    listView.current && listView.current.scrollToEnd(params);
  };

  const scrollToIndex = index => {
    listView.current && listView.current.scrollToIndex({ index: index });
  };

  const loadData = () => {
    _loadMore.current = true;
    _loadFirst.current = false;
    loadMore();
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      <KeyboardAwareFlatList
        stickyHeaderIndices={stickyHeaderIndices}
        extraScrollHeight={scale(90)}
        ref={listView}
        contentContainerStyle={[
          {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
          contentContainerStyle,
        ]}
        style={{ flex: 1 }}
        data={data}
        inverted={inverted}
        numColumns={numColumns}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        // refreshing={this.state.refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refresh()}
            colors={[colors.inkBasic]}
            tintColor={colors.inkBasic}
          />
        }
        // onRefresh={this.refresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        onScroll={_onScroll}
        pagingEnabled={pagingEnabled}
        horizontal={horizontal}
        extraData={extraData}
        onContentSizeChange={_onContentSizeChange}
        keyExtractor={keyExtractor}
        removeClippedSubviews={false}
        ItemSeparatorComponent={_renderSeparator}
        ListHeaderComponent={_renderHeader}
        ListFooterComponent={_renderFooter}
        ListEmptyComponent={_renderEmpty}
        renderItem={_renderItem}
        nestedScrollEnabled={nestedScrollEnabled}
      />
    </View>
  );
});

export default CListView;

const styles = StyleSheet.create({
  button_top: {
    position: 'absolute',
    right: '10%',
    bottom: '10%',
  },

  sticky_header: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  txtNoData: {
    fontWeight: '400',
    fontSize: scale(16),
    lineHeight: scale(36),
    fontFamily: fonts.Poppins.regular,
    color: colors.inkBasic,
    width: '100%',
    textAlign: 'center',
    marginTop: scale(20),
  },
});
