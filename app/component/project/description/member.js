import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import { Flex } from 'antd-mobile';
import R from 'ramda';

import Touchable from 'component/uikit/touchable';
import Avatar from 'component/uikit/avatar';

const memberItem = ({
  editMode = false,
  data,
  style,
  onPress,
  onPrivacyItemPress,
  onClaimPress,
  onEditPress,
  onDeletePress,
}) => {
  const profile_pic = R.pathOr('', ['profile_pic'])(data);
  const name = R.pathOr('--', ['name'])(data);
  const title = R.pathOr('--', ['title'])(data);
  const intro = R.pathOr('--', ['introduction'])(data);
  const linkedIn_url = R.path(['linkedIn_url'])(data);
  const mobile = R.path(['mobile'])(data);
  const wechat = R.path(['wechat'])(data);
  const is_vip = R.pathOr(false, ['is_vip'])(data);

  return (
    <Touchable foreground onPress={onPress}>
      <Flex style={[styles.container, style]} align="flex-start">
        <View>
          <Avatar
            size={52}
            source={{ uri: profile_pic }}
            style={styles.avatar.container}
            imageStyle={styles.avatar.image}
            raised={false}
            innerRatio={1}
            resizeMode="cover"
          />
          {!is_vip && !editMode && (
            <Touchable style={styles.claim.container} onPress={onClaimPress}>
              <Text style={styles.claim.text}>认领</Text>
            </Touchable>
          )}
        </View>
        <View style={styles.content.container}>
          <Flex justify="space-between">
            <Flex>
              <Text style={styles.content.name}>{name}</Text>
              {is_vip && (
                <Image
                  style={{ marginLeft: 8 }}
                  source={require('asset/project/detail/vip_icon.png')}
                />
              )}
            </Flex>
            {editMode && (
              <Flex>
                <Touchable onPress={onEditPress}>
                  <Text style={[styles.action.text, { color: '#1890FF' }]}>
                    编辑
                  </Text>
                </Touchable>
                <Touchable onPress={onDeletePress}>
                  <Text
                    style={[
                      styles.action.text,
                      { marginLeft: 16, color: '#F55454' },
                    ]}
                  >
                    删除
                  </Text>
                </Touchable>
              </Flex>
            )}
          </Flex>
          <Text style={styles.content.title}>{title}</Text>
          <Flex style={{ marginTop: 6 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.content.intro} numberOfLines={2}>
                {intro}
              </Text>
            </View>
            <Flex>
              {!!mobile && (
                <Touchable onPress={onPrivacyItemPress}>
                  <Image source={require('asset/project/detail/mobile.png')} />
                </Touchable>
              )}
              {!!wechat && (
                <Touchable onPress={onPrivacyItemPress}>
                  <Image
                    style={{ marginLeft: 12 }}
                    source={require('asset/project/detail/wechat.png')}
                  />
                </Touchable>
              )}
              {!!linkedIn_url && (
                <Touchable
                  onPress={() => {
                    Linking.openURL(linkedIn_url).catch(err =>
                      console.error('An error occurred', err),
                    );
                  }}
                >
                  <Image
                    style={{ marginLeft: 12 }}
                    source={require('asset/project/detail/linkedin.png')}
                  />
                </Touchable>
              )}
            </Flex>
          </Flex>
        </View>
      </Flex>
    </Touchable>
  );
};

const styles = {
  container: {
    paddingVertical: 12,
  },
  avatar: {
    container: {
      borderRadius: 0,
    },
    image: {
      borderRadius: 2,
    },
  },
  claim: {
    container: {
      width: 52,
      backgroundColor: '#1890FF',
      marginTop: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 10,
      color: 'white',
    },
  },
  action: {
    text: {
      fontSize: 13,
      fontWeight: 'bold',
    },
  },
  content: {
    container: {
      flex: 1,
      marginLeft: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'rgba(0, 0, 0, 0.85)',
    },
    title: {
      marginTop: 6,
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.65)',
      fontWeight: 'bold',
    },
    intro: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.45)',
      lineHeight: 18,
    },
  },
};

memberItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memberItem;
