import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';
import R from 'ramda';

import PairItem from './item';
import Empty from '../empty';
import styles from './style';

export default class Pairs extends PureComponent {
  render() {
    const { portfolio, loading } = this.props;

    if (loading) {
      return <ActivityIndicator style={styles.indicator} />;
    }

    const symbols = R.pathOr([], ['symbols'])(portfolio);
    const empty = R.isEmpty(symbols);

    if (empty) {
      return <Empty title="项目暂未上所" />;
    }

    return (
      <View style={styles.container}>
        {R.addIndex(R.map)((i, index) => <PairItem key={index} data={i} />)(
          symbols,
        )}
      </View>
    );
  }
}
