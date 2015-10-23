/**
 * Anlint Home React Native App
 * https://anlint.com
 */
'use strict';

var React = require('react-native');
var mainScreen = require('./App/Views/Home/mainScreen');



var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  TabBarIOS,
  View,
  Text,
  ScrollView,
  Dimensions
} = React;

var ScrollableTabView = require('react-native-scrollable-tab-view');
var RefreshableListView = require('react-native-refreshable-listview');
var deviceWidth = Dimensions.get('window').width;

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
      <TabBarIOS
        tintColor="white"
        barTintColor="#d52b2a">
        <TabBarIOS.Item
          title="生活方式"
          systemIcon="favorites"
          selected={this.state.selectedTab === 'lifeTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'lifeTab',
            });
          }}>
          <NavigatorIOS style={styles.container}
              tintColor={'#333444'}
              initialRoute={{
                title: '生活',
                component: require('./App/Views/Home/mainScreen')
              }}
              itemWrapperStyle={styles.navigator} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="关于"
          systemIcon="more"
          selected={this.state.selectedTab === 'aboutTab'}
          onPress={() => {
                    this.setState({
                      selectedTab: 'aboutTab'
                    });
                  }}>
          
          <ScrollableTabView>
            <ScrollView tabLabel="               热门               " style={styles.tabView}>
              <View style={styles.card}>
                <Text>热门</Text>
              </View>
            </ScrollView>
            <ScrollView tabLabel="          生活               " style={styles.tabView}>
              <View style={styles.card}>
                <Text>生活</Text>
              </View>
            </ScrollView>
            <ScrollView tabLabel="          方式               " style={styles.tabView}>
              <View style={styles.card}>
                <Text>方式</Text>
              </View>
            </ScrollView>
          </ScrollableTabView>

        </TabBarIOS.Item>
      </TabBarIOS>

    );
  }
});


AppRegistry.registerComponent('anlint', () => anlint);

module.exports = anlint;