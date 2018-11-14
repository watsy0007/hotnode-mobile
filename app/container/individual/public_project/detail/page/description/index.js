import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { Flex, Modal, Grid } from 'antd-mobile';
import { NavigationActions } from 'react-navigation';
import R from 'ramda';

import Financing from '../financing';
import MemberItem from 'component/project/description/member';
import InstitutionItem from './institutionItem';
import WeeklyReports from './weeklyReports';
import SocialNetworkItem, { iconMap } from './socialNetworkItem';
import Roadmap from './roadmap';
import Rating from './rating';
import styles from './style';

@connect()
export default class Description extends PureComponent {
  handleDocPress = item => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'WhitePaper',
        params: {
          pdf_url: item.path_url,
          title: R.path(['portfolio', 'name'])(this.props),
          id: R.path(['portfolio', 'id'])(this.props),
        },
      }),
    );
  };

  handleUrlPress = uri => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'WebPage',
        params: {
          title: R.pathOr('', ['portfolio', 'name'])(this.props),
          uri,
        },
      }),
    );
  };

  errorCorrection = (name, coinName) => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'Feedback',
        params: {
          name: `项目名：${coinName}\n字段名：${name}\n\n出现问题:\n`,
        },
      }),
    );
  };

  render() {
    const coinName = R.pathOr('', ['portfolio', 'name'])(this.props);
    const description = R.pathOr('', ['portfolio', 'description'])(this.props);
    const siteUrl = R.pathOr('', ['portfolio', 'homepage'])(this.props);
    const white_papers = R.pathOr([], ['portfolio', 'white_papers'])(
      this.props,
    );
    const social_network = R.compose(
      R.filter(i => !!iconMap[String(i.name).toLowerCase()]),
      R.pathOr([], ['portfolio', 'social_networks']),
    )(this.props);
    const members = R.pathOr([], ['portfolio', 'members'])(this.props);
    const roadmap = R.pathOr([], ['portfolio', 'basic', 'roadmap'])(this.props);
    const industry_investments = R.pathOr('', [
      'portfolio',
      'industry_investments',
    ])(this.props);
    const regions = R.pathOr([], ['portfolio', 'regions'])(this.props);
    const title = name => (
      <Flex justify="between" align="center" style={styles.titleWrap}>
        <Text style={styles.title}>{name}</Text>
        <TouchableWithoutFeedback
          onPress={() => this.errorCorrection(name, coinName)}
        >
          <View>
            <Text style={styles.correction}>纠错</Text>
          </View>
        </TouchableWithoutFeedback>
      </Flex>
    );
    return (
      <View style={styles.container}>
        {R.not(R.isEmpty(description)) && (
          <View style={styles.fieldGroup}>
            {title('项目简介')}
            <Text style={styles.desc}>{description}</Text>
          </View>
        )}
        {R.not(R.isEmpty(white_papers)) && (
          <View style={styles.fieldGroup}>
            {title('白皮书')}
            <View>
              {R.map(w => (
                <Text
                  key={w.id}
                  style={styles.link}
                  onPress={() => this.handleDocPress(w)}
                >
                  查看 {w.filename}
                </Text>
              ))(white_papers)}
            </View>
          </View>
        )}
        {R.not(R.isEmpty(siteUrl)) && (
          <View style={styles.fieldGroup}>
            {title('官网')}
            <Text
              style={styles.link}
              onPress={() => this.handleUrlPress(siteUrl)}
            >
              {siteUrl}
            </Text>
          </View>
        )}
        {R.not(R.isEmpty(regions)) && (
          <View style={styles.fieldGroup}>
            {title('国别')}
            <Text style={styles.desc}>
              {R.pipe(
                R.map(r => r.name),
                R.join('，'),
              )(regions)}
            </Text>
          </View>
        )}
        <Rating {...this.props} />
        <WeeklyReports {...this.props} />
        {R.not(R.isEmpty(social_network)) && (
          <View style={styles.fieldGroup}>
            {title('媒体信息')}
            <Grid
              data={social_network}
              columnNum={3}
              hasLine={false}
              itemStyle={{
                height: 74,
              }}
              renderItem={(m, i) => (
                <SocialNetworkItem
                  key={`${i}`}
                  name={m.name}
                  fans_count={m.fans_count}
                  data={m.link_url}
                  onPress={() => {
                    this.props.dispatch(
                      NavigationActions.navigate({
                        routeName: 'WebPage',
                        params: {
                          title: m.name,
                          uri: m.link_url,
                        },
                      }),
                    );
                  }}
                />
              )}
            />
          </View>
        )}
        <Financing {...this.props} />
        {R.not(R.isEmpty(members)) && (
          <View style={styles.fieldGroup}>
            {title('团队成员')}
            <View>
              {R.map(m => <MemberItem key={m.id} data={m} />)(members)}
            </View>
          </View>
        )}
        {R.not(R.isEmpty(industry_investments)) && (
          <View style={[styles.fieldGroup, { marginBottom: 14 }]}>
            {title('投资机构')}
            <Flex wrap="wrap">
              {R.map(m => (
                <InstitutionItem
                  key={m.id}
                  data={m}
                  onPress={() => this.props.onInstitutionItemPress(m)}
                />
              ))(industry_investments)}
            </Flex>
          </View>
        )}
        {R.not(R.isEmpty(roadmap)) && (
          <View style={styles.fieldGroup}>
            {title('路线图')}
            <Roadmap {...this.props} roadmap={roadmap} />
          </View>
        )}
      </View>
    );
  }
}
