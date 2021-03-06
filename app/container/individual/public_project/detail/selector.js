import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import R from 'ramda';

import { navBarHeight } from 'component/navBar';
import Touchable from 'component/uikit/touchable';

const selector = ({ list, page, onPress, onLayout }) => {
  if (R.isNil(list) || R.isEmpty(list) || R.length(list) === 1) {
    return null;
  }
  return (
    <View style={styles.container} onLayout={onLayout}>
      {R.map(i => {
        const selected = page.name === i.name;
        return (
          <Touchable
            key={i.name}
            style={styles.groupWrapper}
            onPress={onPress(i)}
          >
            <View style={styles.group}>
              <View style={styles.group}>
                <Text style={[styles.text, selected && styles.textHighlight]}>
                  {i.name}
                </Text>
                {selected && <View style={styles.underline} />}
              </View>
            </View>
          </Touchable>
        );
      })(list)}
    </View>
  );
};

const styles = {
  container: {
    // marginTop: 25,
    height: navBarHeight,
    // paddingHorizontal: 12,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  groupWrapper: {
    flex: 1,
  },
  group: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#A1B6C9',
  },
  textHighlight: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)',
  },
  underline: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    height: 3,
    // borderRadius: 1.5,
    backgroundColor: '#1890FF',
  },
};

selector.propTypes = {
  list: PropTypes.array.isRequired,
  page: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};

selector.defaultProps = {
  onPress: () => null,
};

export default selector;
