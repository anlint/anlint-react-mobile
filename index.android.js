/**
 * Anlint Home React Native App
 * https://anlint.com
 */
'use strict';

var React = require('react-native');
var LifeStyle = require('./App/Views/Home/lifeStyle')



var {
  AppRegistry,
  Navigator,
  StyleSheet,
  // TabBar,
  View,
  Text,
  ScrollView,
  Dimensions
} = React;

var ScrollableTabView = require('react-native-scrollable-tab-view');
var RefreshableListView = require('react-native-refreshable-listview');
var deviceWidth = Dimensions.get('window').width;


var anlint = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'lifeTab',
      notifCount: 0,
      presses: 0,
    };
  },

  _renderContent: function(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text>{pageText}</Text>
        <Text>{num} re-renders of the {pageText}</Text>
      </View>
    );
  },

  render() {
    return (
      <Navigator style={styles.container}
        ref='INDEX_NAV'
        initialRoute={{
          title: '安邻',
          component: require('./App/Views/Home/lifeStyle')
        }}
        shadowHidden={true}
        translucent={false}
        barTintColor='#e74c3c'
        titleTextColor='#ffffff'
        tintColor='#ffffff'/>
    );
  }
});


var styles = React.StyleSheet.create({
  container: {
    flex: 1
  },
  navigator: {
    backgroundColor: '#E7EAEC'
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  tabView: {
    width: deviceWidth,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});


AppRegistry.registerComponent('anlint', () => anlint);

module.exports = anlint;
