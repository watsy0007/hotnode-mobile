import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import StatusBar from './uikit/statusBar';
import Gradient from './uikit/gradient';

const navBar = ({
  style,
  wrapperStyle,
  barStyle,
  renderTitle,
  renderLeft,
  renderRight,
  renderBottom,
  hidden,
  gradient,
}) => {
  const WrapperComp = gradient ? Gradient : View;
  return (
    <WrapperComp style={style}>
      <StatusBar barStyle={barStyle} />
      <Animated.View style={[styles.container, wrapperStyle, hidden && styles.hidden.container]}>
        <View style={[styles.wrapper, hidden && styles.hidden.wrapper]}>
          <View>{renderLeft && renderLeft()}</View>
          <View style={[styles.title.container, hidden && { height: 0 }]}>
            {renderTitle && renderTitle()}
          </View>
          <View>{renderRight && renderRight()}</View>
        </View>
      </Animated.View>
      {renderBottom && renderBottom()}
    </WrapperComp>
  );
};

navBar.defaultProps = {
  barStyle: 'light-content',
  hidden: false,
  gradient: false,
};

navBar.propTypes = {
  // style: ViewPropTypes.style,
  // wrapperStyle: ViewPropTypes.style,
  barStyle: PropTypes.string,
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,
  renderTitle: PropTypes.func,
  renderBottom: PropTypes.func,
  hidden: PropTypes.bool,
  gradient: PropTypes.bool,
};

const styles = {
  container: {
    height: 44 + getStatusBarHeight(true),
    justifyContent: 'flex-end',
  },
  wrapper: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  hidden: {
    container: {
      height: getStatusBarHeight(true),
    },
    wrapper: {
      height: 0,
      opacity: 0,
    },
  },
};

export const navBarHeight = styles.container.height;
export default navBar;
