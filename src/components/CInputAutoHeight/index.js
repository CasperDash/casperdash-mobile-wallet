import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { scale } from 'device';

export default class CInputAutoHeight extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollHeight = 0;
  }

  setText = text => {
    this.input.setNativeProps({ text: text });
  };

  render() {
    let {
      style,
      defaultValue,
      onChangeText,
      placeholder,
      ref,
      lineHeight,
      scrollView,
      editable,
    } = this.props;
    let numOfLinesInput = 1;
    lineHeight = Math.max(scale(24), lineHeight);
    return (
      <TextInput
        allowFontScaling={false}
        editable={editable}
        style={[style]}
        multiline={true}
        ref={ref => (this.input = ref)}
        numberOfLines={numOfLinesInput}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        onContentSizeChange={event => {
          const scrollHeight = event.nativeEvent.contentSize.height;
          numOfLinesInput = Math.max(lineHeight, scrollHeight) / lineHeight;
          if (
            (this.scrollHeight && scrollHeight > this.scrollHeight) ||
            scrollHeight < this.scrollHeight
          ) {
            scrollView &&
              scrollView.scrollToPosition(
                scrollView.position.x,
                scrollView.position.y + (scrollHeight - this.scrollHeight),
              );
          }
          this.scrollHeight = scrollHeight;
        }}
        placeholder={placeholder}
      />
    );
  }
}
