import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { NavigationActions } from 'react-navigation';
import { Toast } from 'antd-mobile';

import NavBar from 'component/navBar';
import Touchable from 'component/uikit/touchable';
import Input from 'component/uikit/textInput';
import styles from './style';

@connect()
@createForm()
class EditProfile extends Component {
  handleConfirmPress = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        const isCompany = this.props.navigation.getParam('isCompany', false);
        Toast.loading('更新中...', 0);
        this.props.dispatch({
          type: isCompany ? 'user/updateCompany' : 'user/updateUserProfile',
          payload: {
            ...value,
          },
          callback: () => {
            this.props.dispatch(NavigationActions.back());
            Toast.hide();
          },
        });
      }
    });
  };

  render() {
    const { navigation } = this.props;
    const { getFieldDecorator } = this.props.form;
    const editKey = navigation.getParam('key');
    const editTitle = navigation.getParam('title');
    const initialValue = navigation.getParam('default');
    const multiline = navigation.getParam('multiline', false);

    return (
      <View style={styles.container}>
        <NavBar
          gradient
          back
          title={`编辑${editTitle}`}
          renderRight={() => (
            <Touchable onPress={this.handleConfirmPress}>
              <Text style={styles.navBar.confirm}>保存</Text>
            </Touchable>
          )}
        />
        <View style={styles.item.container}>
          {getFieldDecorator(editKey, {
            initialValue,
          })(
            <Input autoFocus multiline={multiline} style={styles.item.input} />,
          )}
        </View>
      </View>
    );
  }
}

export default EditProfile;
