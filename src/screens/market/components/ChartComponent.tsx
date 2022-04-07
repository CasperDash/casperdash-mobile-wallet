import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { scale } from 'device';
import { Row, Col } from 'components';
import moment from 'moment';
import { colors, fonts } from 'assets';

const ChartComponent = ({ data }: any) => {
  // const points = monotoneCubicInterpolation({ data, range: 80 });

  console.log('points', data);

  return (
    <Row style={{ width: '100%', height: scale(180) }}>
      <Col style={{ width: '90%' }}>
        <LineChart
          animate={true}
          animationDuration={1000}
          style={{ height: scale(180) }}
          data={data || []}
          xAccessor={({ item }: any) => item.x}
          yAccessor={({ item }: any) => item.y}
          svg={{ stroke: 'rgb(134, 65, 244)' }}
          contentInset={{ top: 20, bottom: 20 }}>
          <Grid />
        </LineChart>
        <XAxis
          data={data}
          numberOfTicks={4}
          xAccessor={({ item }: any) => item.x}
          formatLabel={value =>
            value ? moment(new Date(value)).format('DD MMMM') : ''
          }
          svg={styles.svg}
        />
      </Col>
      <YAxis
        style={{ marginLeft: scale(10) }}
        data={data}
        numberOfTicks={10}
        yAccessor={({ item }: any) => item.y}
        contentInset={{ top: scale(20), bottom: scale(20) }}
        svg={styles.svg}
        formatLabel={value => `${value}`}
      />
    </Row>
  );
};

export default ChartComponent;

const styles = StyleSheet.create({
  svg: {
    fill: colors.N2,
    fontSize: scale(10),
    fontFamily: fonts.Poppins.regular,
  },
});
