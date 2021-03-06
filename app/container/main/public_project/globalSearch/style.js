import { StyleSheet } from 'react-native';

export default {
  input: {
    backgroundColor: '#0F7EE2',
    height: 31,
    paddingHorizontal: 10,
    color: '#fff',
    borderRadius: 2,
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
    width: 14,
    height: 14,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    content: {
      paddingVertical: 0,
    },
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E9E9E9',
    marginLeft: 12,
  },
  tabBar: {
    container: {
      height: 40,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E7E7E7',
      backgroundColor: 'white',
    },
    tab: {
      height: 40,
      paddingBottom: 0,
      alignItems: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
      position: 'relative',
    },
    hot: {
      height: 15,
      marginRight: 5,
      marginBottom: 2,
      resizeMode: 'contain',
    },
    text: {
      fontSize: 14,
    },
    underline: {
      height: 0,
    },
    under: {
      height: 3,
      position: 'absolute',
      bottom: 4,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    underInner: {
      width: 25,
      height: 3,
      borderRadius: 3,
      backgroundColor: '#1890FF',
    },
  },
};
