import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, Dimensions } from 'react-native';

import Touchable from 'component/uikit/touchable';
import { shadow } from '../../../../../utils/style';

const selector = ({ item, onPress }) => (
  <View style={styles.wrapper}>
    <Touchable borderless onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>
          当前排序：
          {item.name}
        </Text>
        <Image
          style={styles.image}
          source={require('asset/project/switch.png')}
        />
      </View>
    </Touchable>
  </View>
);

const deviceWidth = Dimensions.get('window').width;

const styles = {
  wrapper: {
    position: 'absolute',
    bottom: 15,
    left: (deviceWidth - 150) / 2,
    ...shadow,
    backgroundColor: 'white',
    borderRadius: 17.5,
  },
  container: {
    height: 35,
    width: 150,
    borderRadius: 17.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.65)',
  },
  image: {
    marginLeft: 8,
  },
};

selector.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};

selector.defaultProps = {
  onPress: () => null,
};

export default selector;
