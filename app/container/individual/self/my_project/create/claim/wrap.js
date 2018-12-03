import React, { Component } from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import Touchable from 'component/uikit/touchable';
import NavBar from 'component/navBar';
import { NavigationActions } from 'react-navigation';
import store from '../../../../../../../index';

class ClaimWrap extends Component {
  toClaim = () => {
    store.dispatch(
      NavigationActions.navigate({
        routeName: 'ClaimMyProject',
        params: {
          project_id: this.props.navigation.getParam('project_id'),
        },
      }),
    );
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavBar
          back
          title="入驻"
        />
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
          <Image style={{ marginTop: 20, width: 293, alignSelf: 'center' }} source={require('asset/project_create/coin_claim_tip.jpg')} />
          <Touchable style={styles.button.container} onPress={this.toClaim}>
            <Text style={styles.button.title}>立即入驻</Text>
          </Touchable>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  button: {
    container: {
      marginTop: 45,
      height: 43,
      width: 210,
      borderRadius: 2,
      backgroundColor: '#1890FF',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    title: {
      fontSize: 13,
      color: 'white',
      fontWeight: 'bold',
    },
  },
};
ClaimWrap.propTypes = {};
ClaimWrap.defaultProps = {};

export default ClaimWrap;