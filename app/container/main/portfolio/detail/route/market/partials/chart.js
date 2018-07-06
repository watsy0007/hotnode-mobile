import React, { PureComponent } from 'react';
import R from 'ramda';
import moment from 'moment';
import { View, Text } from 'react-native';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryArea,
} from 'victory-native';
import Touchable from 'component/uikit/touchable';

class Chart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      period: '24_hours',
    };
  }

  render() {
    const style = this.props.style;
    const trend = R.path(['stat', 'trend'])(this.props);

    if (R.isNil(trend)) {
      return null;
    }

    const data = R.pipe(R.path([this.state.period]))(trend);

    const formatMate = {
      '24_hours': 'HH:mm',
      '7_days': 'MM/DD',
      '30_days': 'MM/DD',
      '365_days': 'YYYY/MM',
    };

    const { period } = this.state;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.top.container}>
          <Text style={styles.top.title}>价格走势</Text>
          <View style={styles.periods}>
            <View style={styles.periodWrapper}>
              <Touchable
                borderless
                onPress={() => this.setState({ period: '24_hours' })}
              >
                <Text
                  style={[
                    styles.periodItem,
                    period === '24_hours' && styles.periodActive,
                  ]}
                >
                  24h
                </Text>
              </Touchable>
              {period === '24_hours' && <View style={styles.periodline} />}
            </View>
            <View style={styles.periodWrapper}>
              <Touchable
                borderless
                onPress={() => this.setState({ period: '7_days' })}
              >
                <Text
                  style={[
                    styles.periodItem,
                    period === '7_days' && styles.periodActive,
                  ]}
                >
                  周
                </Text>
              </Touchable>
              {period === '7_days' && <View style={styles.periodline} />}
            </View>
            <View style={styles.periodWrapper}>
              <Touchable
                borderless
                onPress={() => this.setState({ period: '30_days' })}
              >
                <Text
                  style={[
                    styles.periodItem,
                    period === '30_days' ? styles.periodActive : null,
                  ]}
                >
                  月
                </Text>
              </Touchable>
              {period === '30_days' && <View style={styles.periodline} />}
            </View>
            <View style={styles.periodWrapper}>
              <Touchable
                borderless
                onPress={() => this.setState({ period: '365_days' })}
              >
                <Text
                  style={[
                    styles.periodItem,
                    period === '365_days' ? styles.periodActive : null,
                  ]}
                >
                  年
                </Text>
              </Touchable>
              {period === '365_days' && <View style={styles.periodline} />}
            </View>
          </View>
        </View>
        <View pointerEvents="none">
          <VictoryChart height={215} padding={styles.chart} allowZoom={false}>
            <VictoryAxis
              crossAxis
              style={styles.axis.cross}
              tickFormat={x => moment(x).format(formatMate[this.state.period])}
            />
            <VictoryAxis dependentAxis style={styles.axis.dependent} />
            <VictoryLine
              style={styles.line}
              interpolation="natural"
              data={data}
              x="datetime"
              y="price"
            />
            <VictoryArea
              style={styles.bar}
              interpolation="natural"
              data={data}
              x="datetime"
              y="price"
            />
          </VictoryChart>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    marginTop: 24,
  },
  chart: {
    left: 72,
    right: 24,
    bottom: 36,
    top: 24,
  },
  axis: {
    cross: {
      tickLabels: {
        fontSize: 11,
        fill: '#a9a9a9',
      },
      axis: { stroke: '#DDDDDD', strokeWidth: 0.5 },
    },
    dependent: {
      tickLabels: {
        fontSize: 11,
        fill: '#666666',
      },
      grid: { stroke: 'rgba(221, 221, 221, 0.8)', strokeWidth: 0.5 },
      axis: { stroke: 'transparent', strokeWidth: 0.5 },
    },
  },
  bar: {
    data: { fill: 'rgba(9, 172, 50, .2)' },
  },
  line: {
    data: { stroke: '#14B93D', strokeWidth: 0.5 },
  },
  top: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 22,
      paddingRight: 12,
    },
    title: {
      color: '#999999',
      fontSize: 14,
    },
  },
  periods: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  periodWrapper: {
    height: 24,
    marginLeft: 16,
    justifyContent: 'center',
  },
  periodline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1890FF',
    borderRadius: 1,
  },
  periodItem: {
    color: '#666666',
    fontSize: 13,
  },
  periodActive: {
    color: '#1890FF',
  },
};

export default Chart;
