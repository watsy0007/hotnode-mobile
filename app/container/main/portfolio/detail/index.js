import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  TouchableHighlight,
} from 'react-native';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import R from 'ramda';

import NavBar from 'component/navBar';
import Touchable from 'component/uikit/touchable';
import StatusDisplay from 'component/project/statusDisplay';

import { hasPermission } from 'component/auth/permission/lock';

import Description from './page/description';
import Pairs from './page/pairs';
import Return from './page/return';
import Trend from './page/trend';
import Header, { headerHeight } from './header';
import styles, { deviceWidth, switchHeight } from './style';

@global.bindTrack({
  page: '项目详情',
  name: 'App_ProjectDetailOperation',
})
@compose(
  withState('scrollY', 'setScrollY', new Animated.Value(0)),
  withProps(({ scrollY }) => ({
    headerHeightRange: scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [headerHeight, 0],
      extrapolate: 'clamp',
    }),
    headerOpacityRange: scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      easing: Easing.out(Easing.quad),
    }),
    titleOpacityRange: scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [0, 1],
      extrapolate: 'clamp',
      easing: Easing.in(Easing.quad),
    }),
    statusSwitchTranslateRange: scrollY.interpolate({
      inputRange: [0, switchHeight],
      outputRange: [0, -deviceWidth / 2],
      extrapolate: 'clamp',
    }),
    matchSwitchTranslateRange: scrollY.interpolate({
      inputRange: [0, switchHeight],
      outputRange: [0, deviceWidth / 2],
      extrapolate: 'clamp',
    }),
  })),
)
@connect(({ portfolio, loading }) => ({
  portfolio: R.pathOr({}, ['current'])(portfolio),
  loading: loading.effects['portfolio/get'],
}))
export default class PortfolioDetail extends Component {
  componentWillMount() {
    this.loadDetail();
  }

  componentDidMount() {
    this.props.track('进入');
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'portfolio/clearDetail',
    });
  }

  loadDetail = () => {
    const item = this.props.navigation.getParam('item');
    if (item && item.id) {
      this.props.dispatch({
        type: 'portfolio/get',
        payload: item.id,
      });
    }
  };

  handleStatusPress = () => {};

  handleCoinMatchPress = () => {};

  renderNavBar = () => {
    const {
      portfolio,
      loading,
      headerHeightRange,
      headerOpacityRange,
      titleOpacityRange,
    } = this.props;
    return (
      <NavBar
        back
        gradient
        title={portfolio.name}
        titleContainerStyle={{ opacity: titleOpacityRange }}
        renderBottom={() => (
          <Header
            style={{ height: headerHeightRange, opacity: headerOpacityRange }}
            loading={loading}
            data={portfolio}
          />
        )}
      />
    );
  };

  renderSwitchButton = () => {
    const {
      portfolio,
      statusSwitchTranslateRange,
      matchSwitchTranslateRange,
    } = this.props;
    const can_calculate = R.pathOr(false, ['can_calculate'])(portfolio);
    return (
      <View style={styles.switch.container}>
        <Animated.View
          style={[
            styles.switch.content.wrapper,
            {
              transform: [
                {
                  translateX: statusSwitchTranslateRange,
                },
              ],
            },
          ]}
        >
          <TouchableHighlight
            underlayColor="white"
            onPress={this.handleStatusPress}
          >
            <View style={styles.switch.content.container}>
              <StatusDisplay
                status={portfolio.status}
                titleStyle={styles.switch.status.text}
              />
              <Text style={styles.switch.content.text}>切换</Text>
            </View>
          </TouchableHighlight>
        </Animated.View>
        <Animated.View
          style={[
            styles.switch.content.wrapper,
            {
              transform: [
                {
                  translateX: matchSwitchTranslateRange,
                },
              ],
            },
          ]}
        >
          <TouchableHighlight
            underlayColor="white"
            onPress={this.handleCoinMatchPress}
          >
            <View style={styles.switch.content.container}>
              <Text
                style={[
                  styles.switch.status.text,
                  can_calculate && styles.switch.matched.highlight,
                ]}
              >
                {can_calculate ? '项目已匹配' : '项目未匹配'}
              </Text>
              <Text style={styles.switch.content.text}>切换</Text>
            </View>
          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  };

  renderTabBar = () => (
    // <DefaultTabBar
    //   style={styles.tabBar.container}
    //   tabStyle={styles.tabBar.tab}
    //   textStyle={styles.tabBar.text}
    //   activeTextColor="#1890FF"
    //   inactiveTextColor="rgba(0, 0, 0, 0.65)"
    //   underlineStyle={styles.tabBar.underline}
    // />
    <DefaultTabBar />
  );

  render() {
    const item = this.props.navigation.getParam('item');
    const displayTab =
      item && item.can_calculate && hasPermission('project-statistic');
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        <ScrollView
          contentContainerStyle={styles.scroll.contentContainer}
          // stickyHeaderIndices={[0]}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.props.scrollY,
                },
              },
            },
          ])}
        >
          <ScrollableTabView
            locked
            scrollWithoutAnimation
            renderTabBar={this.renderTabBar}
          >
            <Trend {...this.props} tabLabel="动态" />
            <Pairs {...this.props} tabLabel="交易所" />
            <Description {...this.props} tabLabel="详情" />
            <Return {...this.props} tabLabel="回报" />
          </ScrollableTabView>
        </ScrollView>
        <View style={styles.switch.wrapper}>{this.renderSwitchButton()}</View>
      </View>
    );
  }
}
