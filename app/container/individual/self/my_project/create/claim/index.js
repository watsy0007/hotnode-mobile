import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { createForm, createFormField } from 'rc-form';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import R from 'ramda';

import EnhancedScroll from 'component/enhancedScroll';
import NavBar from 'component/navBar';
import InputItem from 'component/inputItem';
import Touchable from 'component/uikit/touchable';
import { launchImagePicker } from 'utils/imagepicker';

import styles from './style';

@global.bindTrack({
  page: '认领我的项目认证',
  name: 'App_MyProjectClaimOperation',
})
@connect(({ project_create }) => ({
  owner: R.pathOr({}, ['owner'])(project_create),
}))
@createForm({
  onValuesChange: ({ dispatch }, changed) => {
    dispatch({
      type: 'project_create/saveOwner',
      payload: changed,
    });
  },
  mapPropsToFields: ({ owner }) =>
    R.pipe(
      R.keys,
      R.reduce(
        (acc, key) => ({
          ...acc,
          [key]: createFormField({
            value: owner[key],
          }),
        }),
        {},
      ),
    )(owner),
})
class ClaimProject extends Component {
  componentDidMount() {
    this.props.track('进入');
  }

  handleBusinessCardPress = () => {
    launchImagePicker(response => {
      if (!response.didCancel && !response.error) {
        // this.handleAvatarUpdate(response);

        const { uri } = response;
        this.props.form.setFieldsValue({
          owner_card: uri,
        });
      }
    });
  };

  handleSavePress = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        this.props.dispatch(
          NavigationActions.navigate({
            routeName: 'CreateMyProjectDone',
          }),
        );
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form;
    return (
      <View style={styles.container}>
        <NavBar
          back
          gradient
          title="认领项目"
          renderRight={() => (
            <Touchable borderless onPress={this.handleSavePress}>
              <Text style={styles.navBar.right}>提交</Text>
            </Touchable>
          )}
        />
        <EnhancedScroll>
          {getFieldDecorator('owner_name', {
            rules: [{ required: true, message: '请输入姓名' }],
          })(
            <InputItem
              style={styles.inputItem.container}
              titleStyle={styles.inputItem.title}
              title="姓名"
              placeholder="请输入姓名"
              inputProps={{ style: styles.inputItem.input }}
              error={getFieldError('owner_name')}
            />,
          )}
          {getFieldDecorator('owner_title', {
            rules: [{ required: true, message: '请输入公司职位' }],
          })(
            <InputItem
              style={styles.inputItem.container}
              titleStyle={styles.inputItem.title}
              title="职位"
              placeholder="请输入公司职位"
              inputProps={{ style: styles.inputItem.input }}
              error={getFieldError('owner_title')}
            />,
          )}
          {getFieldDecorator('owner_mobile', {
            rules: [{ required: true, message: '请输入手机号码' }],
          })(
            <InputItem
              style={styles.inputItem.container}
              titleStyle={styles.inputItem.title}
              title="手机"
              placeholder="请输入手机号码"
              inputProps={{ style: styles.inputItem.input }}
              error={getFieldError('owner_mobile')}
            />,
          )}
          {getFieldDecorator('owner_wechat', {
            rules: [{ required: true, message: '请输入微信号' }],
          })(
            <InputItem
              style={styles.inputItem.container}
              titleStyle={styles.inputItem.title}
              title="微信"
              placeholder="请输入微信号"
              inputProps={{ style: styles.inputItem.input }}
              error={getFieldError('owner_wechat')}
            />,
          )}
          {getFieldDecorator('owner_card', {
            rules: [{ required: true, message: '请上传名片' }],
          })(
            <InputItem
              style={styles.inputItem.container}
              wrapperStyle={{ alignItems: 'flex-start' }}
              titleStyle={styles.inputItem.title}
              title="名片"
              placeholder="请上传名片"
              inputProps={{ style: styles.inputItem.input }}
              contentWrapperStyle={{ alignSelf: 'flex-end' }}
              renderContent={({ onChange, value }) => (
                <Image
                  source={require('asset/project_create/business_card.png')}
                />
              )}
              onPress={this.handleBusinessCardPress}
              error={getFieldError('owner_card')}
            />,
          )}
          <View style={styles.notice.container}>
            <Text style={styles.notice.text}>
              以上信息均用作审核使用，平台保证您的信息安全
            </Text>
          </View>
        </EnhancedScroll>
      </View>
    );
  }
}

export default ClaimProject;
