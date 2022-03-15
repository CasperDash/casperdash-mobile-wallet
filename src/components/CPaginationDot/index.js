import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { scale } from 'device';

class CPaginationDot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: props.active ? props.active : 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.active !== nextProps.active) {
      this.setState({
        activeIndex: nextProps.active ? nextProps.active : 0,
      });
    }
  }

  renderActiveDot = index => {
    const {
      activeDotSize,
      activeDotColor,
      dotSpace,
      borderWidth,
      borderColor,
    } = this.props;

    return (
      <View
        key={`${index}`}
        style={{
          width: activeDotSize ?? scale(15),
          height: activeDotSize ?? scale(15),
          borderRadius: activeDotSize
            ? scale(activeDotSize / 2)
            : scale(15 / 2),
          borderWidth: borderWidth ?? 0,
          borderColor: borderColor ?? 'white',
          backgroundColor: activeDotColor ?? 'gray',
          marginHorizontal: dotSpace ?? scale(2),
          marginVertical: dotSpace ?? scale(2),
        }}
      />
    );
  };

  renderPassiveDot = index => {
    const {
      passiveDotSize,
      passiveDotColor,
      dotSpace,
      borderWidth,
      borderColor,
    } = this.props;
    return (
      <View
        key={`${index}`}
        style={{
          width: passiveDotSize ?? scale(10),
          height: passiveDotSize ?? scale(10),
          borderRadius: passiveDotSize
            ? scale(passiveDotSize / 2)
            : scale(10 / 2),
          backgroundColor: passiveDotColor ?? '#dedede',
          borderWidth: borderWidth ?? 0,
          borderColor: borderColor ?? 'white',
          marginHorizontal: dotSpace ?? scale(2),
        }}
      />
    );
  };

  renderActiveLine = index => {
    const {
      activeLineWidth,
      activeLineHeight,
      activeLineColor,
      borderRadius,
      lineSpace,
      borderWidth,
      borderColor,
    } = this.props;

    return (
      <View
        key={`${index}`}
        style={{
          width: activeLineWidth ?? scale(15),
          height: activeLineHeight ?? scale(15),
          borderRadius: borderRadius ?? 0,
          borderWidth: borderWidth ?? 0,
          borderColor: borderColor ?? 'white',
          backgroundColor: activeLineColor ?? 'gray',
          marginHorizontal: lineSpace ?? scale(2),
          marginVertical: lineSpace ?? scale(2),
        }}
      />
    );
  };

  renderPassiveLine = index => {
    const {
      passiveLineWidth,
      passiveLineHeight,
      passiveLineColor,
      borderRadius,
      lineSpace,
      borderWidth,
      borderColor,
    } = this.props;

    return (
      <View
        key={`${index}`}
        style={{
          width: passiveLineWidth ?? scale(15),
          height: passiveLineHeight ?? scale(15),
          borderRadius: borderRadius ?? 0,
          borderWidth: borderWidth ?? 0,
          borderColor: borderColor ?? 'white',
          backgroundColor: passiveLineColor ?? 'gray',
          marginHorizontal: lineSpace ?? scale(2),
          marginVertical: lineSpace ?? scale(2),
        }}
      />
    );
  };

  render() {
    const { length, style, lineStyle } = this.props;
    const { activeIndex } = this.state;
    return (
      <View
        style={[
          styles.container,
          { height: length > 1 ? scale(30) : scale(0) },
          style,
        ]}>
        {length > 1 &&
          Array.apply(null, { length: length ? length : 0 })
            .map((_, i) => i)
            .map((item, index) => {
              if (activeIndex === index) {
                return lineStyle
                  ? this.renderActiveLine(index)
                  : this.renderActiveDot(index);
              }
              return lineStyle
                ? this.renderPassiveLine(index)
                : this.renderPassiveDot(index);
            })}
      </View>
    );
  }
}

export default CPaginationDot;

const styles = StyleSheet.create({
  container: {
    width: scale(330),
    alignSelf: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: '#6b6e6f',
    shadowOffset: {
      width: 0,
      height: scale(3),
    },
    shadowRadius: scale(4),
    shadowOpacity: 0.4,

    elevation: 3,
  },
});
