import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import R from 'ramda';

import Touchable from 'component/uikit/touchable';

const header = ({ count, params, onSelect, selection, onFilterPress }) => {
  const has_filter =
    !R.isEmpty(params.progress) ||
    !R.isEmpty(params.industry_id) ||
    !R.isEmpty(params.tag_id);
  return (
    <View style={styles.container}>
      <View style={styles.content.container}>
        <Text style={styles.content.title}>
          当前：
          <Text style={{ fontWeight: 'bold', color: '#1890FF' }}>{count}</Text>
        </Text>
        <View style={styles.content.tag.container}>
          <Touchable
            style={[
              styles.content.tag.wrapper,
              R.contains('2')(selection) && styles.content.tag.highlight,
            ]}
            onPress={() => onSelect({ value: 2, name: '即将开始' })}
          >
            <Text
              style={[
                styles.content.tag.title,
                R.contains('2')(selection) && styles.content.tag.titleHighlight,
              ]}
            >
              即将开始
            </Text>
          </Touchable>
          <Touchable
            style={[
              styles.content.tag.wrapper,
              R.contains('3')(selection) && styles.content.tag.highlight,
            ]}
            onPress={() => onSelect({ value: 3, name: '进行中' })}
          >
            <Text
              style={[
                styles.content.tag.title,
                R.contains('3')(selection) && styles.content.tag.titleHighlight,
              ]}
            >
              进行中
            </Text>
          </Touchable>
          <Touchable
            style={[
              styles.content.tag.wrapper,
              R.contains('4')(selection) && styles.content.tag.highlight,
            ]}
            onPress={() => onSelect({ value: 4, name: '已结束' })}
          >
            <Text
              style={[
                styles.content.tag.title,
                R.contains('4')(selection) && styles.content.tag.titleHighlight,
              ]}
            >
              已结束
            </Text>
          </Touchable>
        </View>
      </View>
      <Touchable
        borderless
        style={styles.filter.container}
        onPress={onFilterPress}
      >
        <Text style={[styles.filter.title, has_filter && { color: '#1890FF' }]}>
          <Image
            source={
              has_filter
                ? require('asset/public_project/funnel_highlight.png')
                : require('asset/public_project/funnel.png')
            }
          />{' '}
          筛选
        </Text>
      </Touchable>
    </View>
  );
};

const styles = {
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E9E9E9',
  },
  content: {
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      width: 72,
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.65)',
    },
    tag: {
      container: {
        flexDirection: 'row',
        marginLeft: 12,
      },
      wrapper: {
        borderRadius: 2,
        height: 28.5,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginRight: 10,
      },
      highlight: {
        backgroundColor: '#E5F3FF',
      },
      title: {
        fontSize: 11,
        color: 'rgba(0, 0, 0, 0.65)',
      },
      titleHighlight: {
        color: '#1890FF',
        fontWeight: 'bold',
      },
    },
  },
  filter: {
    container: {
      marginLeft: 12,
    },
    title: {
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.65)',
    },
  },
};

export default header;