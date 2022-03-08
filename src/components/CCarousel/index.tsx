import React, {
    Component,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    forwardRef
} from 'react';
import {Animated, StyleSheet, Dimensions, FlatList} from 'react-native';

//source: react-native-anchor-carousel

const {width: windowWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {},
    itemContainer: {justifyContent: 'center'}
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function useConstructor(callBack = () => {
}) {
    const [hasBeenCalled, setHasBeenCalled] = useState(false);
    if (hasBeenCalled) {
        return;
    }
    callBack();
    setHasBeenCalled(true);
}

function CCarousel(props: any, ref: any) {
    const {
        data = [],
        style = {},
        containerWidth = windowWidth,
        itemWidth = 0.9 * windowWidth,
        itemContainerStyle = {},
        separatorWidth = 10,
        minScrollDistance = 5,
        inActiveScale = 0.8,
        inActiveOpacity = 0.8,
        inverted = false,
        initialIndex = 0,
        bounces = true,
        showsHorizontalScrollIndicator = false,
        keyExtractor = (item: any, index: number) => index.toString(),
        renderItem = () => {
        },
        onScrollEnd = () => {
        },
        onScrollBeginDrag = () => {
        },
        onScrollEndDrag = () => {
        },
        ...otherProps
    } = props;
    const scrollViewRef = useRef(null);
    const currentIndexRef = useRef(initialIndex);
    const scrollXRef = useRef(0);
    const scrollXBeginRef = useRef(0);
    const xOffsetRef = useRef(new Animated.Value(0));
    const handleOnScrollRef = useRef(() => {});
    const halfContainerWidth = containerWidth / 2;
    const halfItemWidth = itemWidth / 2;
    const itemTotalMarginBothSide = getItemTotalMarginBothSide();
    const containerStyle = [styles.container, {width: containerWidth}, style];
    const dataLength = data ? data.length : 0;

    useConstructor(() => {
        setScrollHandler();
    });

    useImperativeHandle(ref, () => ({
        scrollToIndex: scrollToIndex,
        currentIndex: () => currentIndexRef.current
    }));

    function isLastItem(index: number) {
        return index === dataLength - 1;
    }

    function isFirstItem(index: number) {
        return index === 0;
    }

    function getItemLayout(data: any, index: number) {
        return {
            offset: getItemOffset(index),
            length: itemWidth,
            index
        };
    }

    function setScrollHandler() {
        handleOnScrollRef.current = Animated.event(
            [{nativeEvent: {contentOffset: {x: xOffsetRef.current}}}],
            {
                useNativeDriver: true,
                listener: (event: any) => {
                    scrollXRef.current = event.nativeEvent.contentOffset.x;
                }
            }
        );
    }

    function scrollToIndex(index: number) {
        if (index < 0 || index >= dataLength) {
            return;
        }
        onScrollEnd && onScrollEnd(data[index], index);
        currentIndexRef.current = index;
        setTimeout(() => {
            scrollViewRef.current &&
            scrollViewRef.current.scrollToOffset({
                offset: getItemOffset(index),
                animated: true
            });
        });
    }

    function handleOnScrollBeginDrag() {
        onScrollBeginDrag && onScrollBeginDrag();
        scrollXBeginRef.current = scrollXRef.current;
    }

    function handleOnScrollEndDrag() {
        onScrollEndDrag && onScrollEndDrag();
        if (scrollXRef.current < 0) {
            return;
        }
        const scrollDistance = scrollXRef.current - scrollXBeginRef.current;
        scrollXBeginRef.current = 0;
        if (Math.abs(scrollDistance) < minScrollDistance) {
            scrollToIndex(currentIndexRef.current);
            return;
        }
        if (scrollDistance < 0) {
            scrollToIndex(currentIndexRef.current - 1);
        } else {
            scrollToIndex(currentIndexRef.current + 1);
        }
    }

    function getItemTotalMarginBothSide() {
        const compensatorOfSeparatorByScaleEffect = (1 - inActiveScale) * itemWidth;
        return separatorWidth - compensatorOfSeparatorByScaleEffect / 2;
    }

    function getItemOffset(index: number) {
        return (
            index * (itemWidth + itemTotalMarginBothSide) -
            (halfContainerWidth - halfItemWidth)
        );
    }

    function getAnimatedOffset(index: number) {
        if (isFirstItem(index)) {
            return halfItemWidth;
        }
        if (isLastItem(index)) {
            return containerWidth - halfItemWidth;
        }
        return halfContainerWidth;
    }

    function getMidPontInterpolate(index: number, animatedOffset: number) {
        return (
            index * (itemWidth + itemTotalMarginBothSide) +
            halfItemWidth -
            animatedOffset
        );
    }

    function getStartPontInterpolate(index: number, midPoint: number) {
        if (index === 1) {
            return 0;
        }
        if (isLastItem(index)) {
            return (
                (dataLength - 2) * (itemWidth + itemTotalMarginBothSide) +
                halfItemWidth -
                halfContainerWidth
            );
        }
        return midPoint - itemWidth - itemTotalMarginBothSide;
    }

    function getEndPointInterpolate(index: number, midPoint: number) {
        if (isFirstItem(index)) {
            return (
                itemWidth + itemTotalMarginBothSide + halfItemWidth - halfContainerWidth
            );
        }
        if (index === dataLength - 2) {
            return (
                (dataLength - 1) * (itemWidth + itemTotalMarginBothSide) +
                itemWidth -
                containerWidth
            );
        }
        return midPoint + itemWidth + itemTotalMarginBothSide;
    }

    function getItemAnimatedStyle(index: number) {
        const animatedOffset = getAnimatedOffset(index);
        const midPoint = getMidPontInterpolate(index, animatedOffset);
        const startPoint = getStartPontInterpolate(index, midPoint);
        const endPoint = getEndPointInterpolate(index, midPoint);
        const animatedOpacity = {
            opacity: xOffsetRef.current.interpolate({
                inputRange: [startPoint, midPoint, endPoint],
                outputRange: [inActiveOpacity, 1, inActiveOpacity]
            })
        };
        const animatedScale = {
            transform: [
                {
                    scale: xOffsetRef.current.interpolate({
                        inputRange: [startPoint, midPoint, endPoint],
                        outputRange: [inActiveScale, 1, inActiveScale]
                    })
                }
            ]
        };
        return {...animatedOpacity, ...animatedScale};
    }

    function getItemMarginStyle(index: number) {
        const marginSingleItemSide = itemTotalMarginBothSide / 2;
        if (isFirstItem(index)) {
            return !!inverted
                ? {marginLeft: marginSingleItemSide}
                : {marginRight: marginSingleItemSide};
        }
        if (isLastItem(index)) {
            return !!inverted
                ? {marginRight: marginSingleItemSide}
                : {marginLeft: marginSingleItemSide};
        }
        return {marginHorizontal: marginSingleItemSide};
    }

    function renderItemContainer({item, index}: any) {
        return (
            <Animated.View
                pointerEvents={'box-none'}
                style={[
                    styles.itemContainer,
                    itemContainerStyle,
                    {width: itemWidth},
                    getItemMarginStyle(index),
                    getItemAnimatedStyle(index)
                ]}
            >
                {renderItem({item, index})}
            </Animated.View>
        );
    }

    return (
        <AnimatedFlatList
            {...otherProps}
            ref={scrollViewRef}
            data={data}
            style={containerStyle}
            horizontal={true}
            inverted={inverted}
            bounces={bounces}
            decelerationRate={0}
            initialScrollIndex={initialIndex}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            onScroll={handleOnScrollRef.current}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            renderItem={renderItemContainer}
            onScrollBeginDrag={handleOnScrollBeginDrag}
            onScrollEndDrag={handleOnScrollEndDrag}
        />
    );
}

export default forwardRef(CCarousel);
