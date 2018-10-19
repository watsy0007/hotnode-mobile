import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import R from 'ramda';

import NavBar from 'component/navBar';
import Touchable from 'component/uikit/touchable';
import List from 'component/uikit/list';
import SimplifiedItem from 'component/public_project/simplified_item';

import Button from '../../component/button';
import styles from './style';

@global.bindTrack({
  page: '正常创建项目流程',
  name: 'App_MyProjectCreateNormalOperation',
})
@connect(({ project_create }) => ({
  data: R.pathOr(null, ['query', 'data'])(project_create),
}))
class OptionalClaimProject extends Component {
  componentDidMount() {
    this.props.track('进入');
  }

  handleNextPress = () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'CreateMyProjectNormalWrapper',
      }),
    );
  };

  handleItemPress = item => () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'PublicProjectDetail',
        params: {
          item,
        },
      }),
    );
  };

  handleClaimPress = item => () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'ClaimMyProject',
        params: {
          project_id: item,
        },
      }),
    );
  };

  renderItem = ({ item }) => (
    <View>
      <SimplifiedItem data={item} onPress={this.handleItemPress(item)} />
    </View>
  );

  renderSeparator = () => <View style={styles.separator} />;

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        <NavBar back gradient title="认领项目" />
        <List
          disableRefresh
          contentContainerStyle={{ paddingVertical: 0 }}
          data={data}
          renderItem={this.renderItem}
          renderSeparator={this.renderSeparator}
        />
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
