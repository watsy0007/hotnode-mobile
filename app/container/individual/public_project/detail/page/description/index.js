import React, { PureComponent } from 'react';
import { View, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Flex } from 'antd-mobile';
import { NavigationActions } from 'react-navigation';
import R from 'ramda';

import Financing from '../financing';
import MemberItem from 'component/project/description/member';
import InstitutionItem from 'component/institution/item';
import styles from './style';

@connect()
export default class Description extends PureComponent {
  handleDocPress = item => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'InstitutionReportDetail',
        params: {
          pdf_url: item.path_url,
          title: item.filename,
        },
      }),
    );
  };

  render() {
    const description = R.pathOr('', ['portfolio', 'description'])(this.props);
    const siteUrl = R.pathOr('', ['portfolio', 'homepage'])(this.props);
    const white_papers = R.pathOr([], ['portfolio', 'white_papers'])(
      this.props,
    );
    const rating = R.pathOr([], ['portfolio', 'rating'])(this.props);
    const members = R.pathOr([], ['portfolio', 'members'])(this.props);
    const invest_score = R.pathOr('', [0, 'invest_score'])(rating);
    const risk_score = R.pathOr('', [0, 'risk_score'])(rating);
    const industry_investments = R.pathOr('', [
      'portfolio',
      'industry_investments',
    ])(this.props);

    return (
      <View style={styles.container}>
        {R.not(R.isEmpty(description)) && (
          <View>
            <Text style={styles.title}>项目简介</Text>
            <Text style={styles.desc}>{description}</Text>
          </View>
        )}
        {R.not(R.isEmpty(white_papers)) && (
          <View>
            <Text style={[styles.title, styles.site]}>白皮书</Text>
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
          <View>
            <Text style={[styles.title, styles.site]}>官网</Text>
            <Text style={styles.link} onPress={() => Linking.openURL(siteUrl)}>
              {siteUrl}
            </Text>
          </View>
        )}
        {R.not(R.isEmpty(invest_score) && R.isEmpty(risk_score)) && (
          <View>
            <Text style={[styles.title, styles.site]}>评级信息</Text>
            <Flex style={styles.ratingItem}>
              {R.not(R.isEmpty(invest_score)) && (
                <View style={{ flex: 1 }}>
                  <Text style={styles.ratingTitleText}>
                    投资评分
                    {'   '}
                    <Text style={styles.ratingItemText}>{invest_score}</Text>
                  </Text>
                </View>
              )}
              {R.not(R.isEmpty(risk_score)) && (
                <View style={{ flex: 1 }}>
                  <Text style={styles.ratingTitleText}>
                    风险评估
                    {'   '}
                    <Text style={styles.ratingItemText}>{risk_score}</Text>
                  </Text>
                </View>
              )}
            </Flex>
          </View>
        )}
        <Financing {...this.props} />
        {R.not(R.isEmpty(members)) && (
          <View>
            <Text style={[styles.title, styles.site]}>团队成员</Text>
            <View>
              {R.map(m => <MemberItem key={m.id} data={m} />)(members)}
            </View>
          </View>
        )}
        {R.not(R.isEmpty(industry_investments)) && (
          <View>
            <Text style={[styles.title, styles.site]}>投资机构</Text>
            <View>
              {R.map(m => (
                <InstitutionItem
                  disableSubtitle
                  style={{ paddingHorizontal: 0 }}
                  key={m.id}
                  data={m}
                  onPress={() => this.props.onInstitutionItemPress(m)}
                />
              ))(industry_investments)}
            </View>
          </View>
        )}
      </View>
    );
  }
}
