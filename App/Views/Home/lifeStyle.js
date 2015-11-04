'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  PixelRatio,
  NavigatorIOS,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  StatusBarIOS
} = React;


var ScrollableTabView = require('react-native-scrollable-tab-view');
var RefreshableListView = require('react-native-refreshable-listview');
var deviceWidth = Dimensions.get('window').width;

var LifeScreen = require('./lifeScreen');
var StyleScreen = require('./styleScreen');
var CustomTabBar = require('./CustomTabBar');

var RefreshInfiniteListView = require('../Components/RefreshInfiniteListView');


var lifeStyle = React.createClass({
  getInitialState: function() {
    StatusBarIOS.setStyle(1);   // 1是白色，0是默认的黑色
    return {
      selectedTab: 'lifeTab',
      notifCount: 0,
      presses: 0,
    };
  },
  render() {
    return(
      <ScrollableTabView 
        renderTabBar = {() => <CustomTabBar someProp={'here'} />}
        sceneContainerStyle = {styles.scence}
        edgeHitWidth = {99} 
        scrollsToTop={false}>

        <LifeScreen tabLabel="生活" navigator={this.props.navigator}/>
        <StyleScreen tabLabel="方式" navigator={this.props.navigator}/>
      </ScrollableTabView>
      );
  },

});


// <ScrollView
//   contentContainerStyle={styles.contentContainer}
//   style={styles.scrollView}
//   tabLabel="生活"
//   scrollsToTop='false'>
//   <LifeScreen navigator={this.props.navigator}/>
// </ScrollView>

// <ScrollView
//   contentContainerStyle={styles.contentContainer}
//   style={styles.scrollView}
//   tabLabel="方式"
//   scrollsToTop='true'>
//   <StyleScreen navigator={this.props.navigator}/>
// </ScrollView>

var styles = React.StyleSheet.create({
  container: {
    flex: 1
  },
  navigator: {
    backgroundColor: '#d52b2a'
  },
  scence: {
    padding: 10,
    paddingTop: 74,
    flex: 1
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  tabView: {
    width: deviceWidth,
    padding: 0,
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


module.exports = lifeStyle;
