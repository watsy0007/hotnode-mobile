import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Clipboard,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';
import { Flex, Toast } from 'antd-mobile';
import { NavigationActions } from 'react-navigation';
import { compose, withState, withProps } from 'recompose';
import request from 'utils/request';
import runtimeConfig from 'runtime/index';
import Base64 from 'utils/base64';
import DeviceInfo from 'react-native-device-info';
import * as WeChat from 'react-native-wechat';
import ReadMore from 'react-native-read-more-text';

import NavBar from 'component/navBar';
import FavorItem from 'component/favored/item';
import Touchable from 'component/uikit/touchable';
import ActionAlert from 'component/action_alert';
import shareModal from 'component/shareModal';
import Member from 'component/institution/member_item';
import ReadMoreFooter from 'component/readmore';
import BottomFloatingButton from 'component/bottom_floating_button';

import { viewInstitution } from '../../../../services/api';
import Group from './partials/group';
import RatingItems from './partials/ratingItems';
import ReportsItems from './partials/reports';
import RatedItem from './partials/ratedItem';
import Header from './header';
import Bottom from './bottom';
import styles, { buttonPadding } from './style';
import Icon from '../../../../component/uikit/icon';
import ShareModal from './share';

@global.bindTrack({
  page: '机构详情',
  name: 'App_InstitutionDetailOperation',
})
@connect(({ user, institution, login, loading, global }, props) => {
  const id = props.navigation.getParam('id');
  return {
    id,
    data: R.pathOr({}, ['current', id])(institution),
    user: R.pathOr({}, ['currentUser'])(user),
    logged_in: !!login.token,
    in_individual: login.in_individual,
    loading: loading.effects['institution/get'],
    industryType: R.compose(
      R.path(['name']),
      R.find(i => i.value === R.path(['current', id, 'type'])(institution)),
      R.values,
      R.pathOr([], ['constants', 'industry_type']),
    )(global),
    ratingTypes: R.compose(
      R.pathOr([], ['rating_types']),
      R.find(i => i.id === id),
      R.pathOr([], ['constants', 'rating_orgs']),
    )(global),
  };
})
@compose(
  withState('showInviteModal', 'toggleInviteModal', false),
  withState('showModal', 'setShowModal', false),
  withState('currentMember', 'setCurrentMember', ({ data }) =>
    R.pathOr({}, ['members', 0])(data),
  ),
  withProps(({ data }) => ({
    chat_member: R.pipe(
      R.pathOr([], ['members']),
      R.find(m => !R.isNil(m.user_id)),
    )(data),
  })),
)
@shareModal
export default class InstitutionDetail extends Component {
  componentWillMount() {
    this.loadDetail();
  }

  componentDidMount() {
    this.props.track('进入');
    viewInstitution(this.props.id);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'institution/clearCurrent',
      id: this.props.id,
    });
  }

  onPressClaimCoin = member => {
    this.props.track('点击入驻按钮');
    if (!this.props.logged_in) {
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
      return;
    }
    if (member) {
      this.props.dispatch({
        type: 'institution_create/resetOwner',
        payload: {
          owner_name: R.path(['name'])(member),
          owner_mobile: R.path(['mobile'])(member),
          owner_title: R.path(['title'])(member),
          owner_wechat: R.path(['wechat'])(member),
        },
      });
    }
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'ClaimMyInstitution',
        params: {
          id: this.props.id,
          showTip: true,
        },
      }),
    );
  };

  setScroll = scrolling => {
    this.floatingButton.transitionTo({ opacity: scrolling ? 0.2 : 1 });
  };

  loadDetail = () => {
    this.props.dispatch({
      type: 'institution/get',
      payload: this.props.id,
    });
  };

  handleLinkPress = uri => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'WebPage',
        params: {
          title: R.pathOr('机构主页', ['data', 'name'])(this.props),
          uri,
        },
      }),
    );
  };

  goToMemberDetail = data => {
    this.props.track('点击进入成员主页');
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'UserProfile',
        params: {
          data,
        },
      }),
    );
  };

  handleSharePress = () => {
    const { data, navigation } = this.props;
    this.props.openShareModal({
      types: [
        {
          type: 'timeline',
          webpageUrl: `${runtimeConfig.MOBILE_SITE}/industry-investments?id=${
            data.id
          }`,
          title: `来 Hotnode联系「${R.path(['name'])(data)}」`,
          description: `来Hotnode联系全球优质${this.props.industryType}`,
          thumbImage: R.pathOr(
            'https://hotnode-production-file.oss-cn-beijing.aliyuncs.com/big_logo%403x.png',
            ['logo_url'],
          )(data),
        },
        {
          type: 'session',
          webpageUrl: `${runtimeConfig.MOBILE_SITE}/industry-investments?id=${
            data.id
          }`,
          title: `推荐给你一个靠谱${this.props.industryType}「${R.path([
            'name',
          ])(data)}」`,
          description: '来 Hotnode 找全球区块链服务机构！',
          thumbImage: R.pathOr(
            'https://hotnode-production-file.oss-cn-beijing.aliyuncs.com/big_logo%403x.png',
            ['logo_url'],
          )(data),
        },
        {
          type: 'picture',
        },
        {
          type: 'link',
          url: `${runtimeConfig.MOBILE_SITE}/industry-investments?id=${
            data.id
          }`,
        },
      ],
    });
  };

  handleInviteJoinPress = () => {
    const { id } = this.props;
    const cryptID = Base64.btoa(`${id}`);
    const UniqueID = DeviceInfo.getUniqueID().slice(0, 5);
    Clipboard.setString(
      `邀请您入驻「${R.path(['data', 'name'])(
        this.props,
      )}」，复制整段文字 ^*${UniqueID}$${cryptID}*^ 到 Hotnode 中打开`,
    );
    this.props.toggleInviteModal(true);
  };

  handleContactPress = () => {
    if (!this.props.logged_in) {
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
      return;
    }
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'IMPage',
        params: {
          id: R.path(['user_id'])(this.props.chat_member),
        },
      }),
    );
  };

  toReportDetail = item => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'InstitutionReportDetail',
        params: {
          id: item.id,
        },
      }),
    );
  };

  toReportList = () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'InstitutionReportsList',
        params: {
          id: this.props.id,
        },
      }),
    );
  };

  renderNavBar = () => (
    <NavBar
      back
      gradient
      renderBottom={() => (
        <Header {...this.props} onLinkPress={this.handleLinkPress} />
      )}
      renderRight={() => (
        <Touchable borderless onPress={this.handleSharePress}>
          <Image
            style={{ width: 18, height: 18 }}
            source={require('asset/icon_share.png')}
          />
        </Touchable>
      )}
    />
  );

  renderTruncatedFooter = handlePress => (
    <ReadMoreFooter collapsed onPress={handlePress} />
  );

  renderRevealedFooter = handlePress => (
    <ReadMoreFooter collapsed={false} onPress={handlePress} />
  );

  render() {
    const { data, in_individual, showInviteModal, ratingTypes } = this.props;
    const desc = R.pathOr('', ['description'])(data);
    const members = R.pathOr([], ['members'])(data);
    const coins = R.pathOr([], ['coins'])(data);
    const reports = R.take(5)(R.pathOr([], ['reports', 'data'])(data));
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        <ScrollView
          onMomentumScrollBegin={() => this.setScroll(true)}
          onMomentumScrollEnd={() => this.setScroll(false)}
        >
          {R.not(R.isEmpty(desc)) && (
            <Group title="机构简介">
              <View style={styles.desc.container}>
                <ReadMore
                  numberOfLines={10}
                  renderTruncatedFooter={this.renderTruncatedFooter}
                  renderRevealedFooter={this.renderRevealedFooter}
                >
                  <Text style={styles.desc.text}>{desc}</Text>
                </ReadMore>
              </View>
            </Group>
          )}
          {data.type === 6 && <RatingItems data={ratingTypes} />}
          {data.type === 6 && (
            <View>
              <ReportsItems data={reports} onPress={this.toReportDetail} />
              {!!reports.length && (
                <Touchable onPress={this.toReportList}>
                  <Flex
                    align="center"
                    justify="center"
                    style={styles.allReports}
                  >
                    <Text style={styles.allReportsText}>查看全部研报</Text>
                    <Icon
                      name="arrow-forward"
                      size={14}
                      color="#1890FF"
                      style={{ marginLeft: 5, marginTop: 1 }}
                    />
                  </Flex>
                </Touchable>
              )}
            </View>
          )}
          {R.not(R.isEmpty(members)) && (
            <Group title="机构成员">
              {R.map(m => (
                <Member
                  institutionOwned={R.pathOr(false, ['is_owned'])(data)}
                  key={m.id}
                  data={m}
                  onPrivacyItemPress={() => {
                    if (this.props.logged_in) {
                      this.props.setCurrentMember(m);
                      this.props.setShowModal(true);
                    } else {
                      this.props.dispatch(
                        NavigationActions.navigate({
                          routeName: 'Login',
                        }),
                      );
                    }
                  }}
                  onPress={() => this.goToMemberDetail(m)}
                  onClaimPress={() => this.onPressClaimCoin(m)}
                />
              ))(members)}
            </Group>
          )}
          {R.not(R.isEmpty(coins)) && (
            <Group title={data.type === 1 ? '所投项目' : '服务案例'}>
              {R.addIndex(R.map)((m, index) => {
                if (data.type === 6) {
                  return (
                    <RatedItem
                      style={{ paddingHorizontal: 0 }}
                      key={m.id}
                      data={m}
                      showTopBorder={index !== 0}
                    />
                  );
                }
                return (
                  <FavorItem
                    style={{ paddingHorizontal: 0 }}
                    institutionId={this.props.id}
                    key={m.id}
                    data={m}
                    showTopBorder={index !== 0}
                    disableFavorAction
                  />
                );
              })(coins)}
            </Group>
          )}
        </ScrollView>
        <Bottom
          {...this.props}
          openShareModal={this.handleSharePress}
          onInviteJoinPress={this.handleInviteJoinPress}
          onConnectPress={this.handleContactPress}
        />
        {in_individual && (
          <BottomFloatingButton
            viewRef={ref => {
              this.floatingButton = ref;
            }}
            style={{ bottom: buttonPadding }}
            onPress={this.onPressClaimCoin}
          />
        )}
        <ActionAlert
          visible={showInviteModal}
          title="邀请入驻"
          content="邀请口令已复制，快去粘贴吧"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 18 }}
          actionTitle="分享至微信"
          action={async () => {
            this.props.toggleInviteModal(false);
            try {
              // await Linking.canOpenURL('wechat://');
              // await Linking.openURL('wechat://');
              WeChat.openWXApp();
            } catch (e) {
              console.log(e);
            }
          }}
          onBackdropPress={() => this.props.toggleInviteModal(false)}
        />
        <ActionAlert
          visible={this.props.showModal}
          title="联系Ta"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 18 }}
          actionTitle="帮我联系"
          action={() => {
            this.props.setShowModal(false);
            const project_name = R.path(['name'])(this.props.data);
            const contact_name = R.path(['name'])(this.props.currentMember);
            const mobile = R.pathOr('未知', ['mobile'])(this.props.user);
            request
              .post(`${runtimeConfig.NODE_SERVICE_URL}/feedback`, {
                content: `想要联系「${project_name} - ${contact_name}」`,
                mobile,
              })
              .then(() => {
                Toast.success('您的反馈已提交');
              });
          }}
          onBackdropPress={() => this.props.setShowModal(false)}
        />
        <ShareModal
          onClose={() => this.props.toggleSharePictureModal(false)}
          data={data}
          visible={this.props.showSharePictureModal}
          industryType={this.props.industryType}
          ratingTypes={this.props.ratingTypes}
        />
      </View>
    );
  }
}
