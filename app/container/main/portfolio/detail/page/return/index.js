import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';

import Empty from '../empty';
import Group from './group';
import Holdings from './holdings';
import Investment from './investment';
import ROI from './roi';
import styles from './style';

@connect(({ loading }) => ({
  loadingStat: loading.effects['portfolio/projectStat'],
}))
export default class Return extends Component {
  render() {
    const { portfolio, loadingStat, can_calculate } = this.props;
    const investment = R.pathOr({}, ['stats', 'investment'])(portfolio);

    if (loadingStat) {
      return <ActivityIndicator style={styles.indicator} />;
    }
    return (
      <View style={styles.container}>
        {R.not(can_calculate) ? (
          <Empty title="项目暂无投资记录" />
        ) : (
          <View>
            <Group title="投资回报率" subtitle="以不同本位币做基准">
              <ROI data={investment.roi} />
            </Group>
            <Group title="项目浮动盈亏" subtitle="以不同本位币做基准">
              <Investment data={investment} />
            </Group>
            <Group title="总市值" subtitle="以不同本位币做基准">
              <Holdings data={investment.cap} />
            </Group>
          </View>
        )}
      </View>
    );
  }
}
