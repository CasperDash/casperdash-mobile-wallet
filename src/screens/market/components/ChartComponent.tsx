import React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { Col } from 'components';
import moment from 'moment';
import { colors, textStyles } from 'assets';
import { Text } from 'react-native';
import { scale } from 'device';

const ChartComponent = ({ data, onActivated, onDeactivated }: any) => {
  return (
    <Col.C mt={-20} ml={16}>
      <VictoryChart
        height={scale(250)}
        animate={{
          onLoad: {
            duration: 200,
          },
        }}
        containerComponent={
          <VictoryVoronoiContainer
            onTouchStart={onActivated}
            onTouchEnd={onDeactivated}
            labels={({ datum }) =>
              `${moment(datum.x).format('ddd DD MMM YY, HH:mm')} \n ${datum.y}`
            }
            labelComponent={
              <VictoryTooltip
                style={{
                  fill: colors.N2,
                }}
                pointerLength={40}
                constrainToVisibleArea
              />
            }
          />
        }
        theme={VictoryTheme.material}>
        <VictoryLine
          style={{
            data: { stroke: colors.R1 },
          }}
          data={data}
          scale={{ x: 'time' }}
        />
      </VictoryChart>
      <Text style={[textStyles.Sub1, { marginLeft: -scale(16) }]}>
        Source - Coingecko
      </Text>
    </Col.C>
  );
};

export default ChartComponent;
