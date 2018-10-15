import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import R from 'ramda';

import NavBar from 'component/navBar';
import Touchable from 'component/uikit/touchable';
import List from 'component/uikit/list';
import Item from 'component/self/item';

import Button from '../../component/button';
import styles from './style';

@global.bindTrack({
  page: '选择性认领我的项目',
  name: 'App_MyProjectOptionalClaimOperation',
})
@connect(({ user, login, loading }) => ({
  data: [],
  //   loading: loading.effects['login/switch'],
}))
class OptionalClaimProject extends Component {
  componentDidMount() {
    this.props.track('进入');
  }

  handleNextPress = () => {};

  render() {
    const { data, loading } = this.props;
    return (
      <View style={styles.container}>
        <NavBar back gradient title="认领项目" />
        <List data={data} />
        <Button
          title="继续创建"
          onPress={this.handleNextPress}
          renderTop={() => (
            <View style={styles.notice.container}>
              <Text style={styles.notice.text}>
                都不是您的项目？继续创建项目
              </Text>
            </View>
          )}
        />
      </View>
    );
  }
}

export default OptionalClaimProject;
