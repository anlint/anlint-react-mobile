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
  Text
} = React;



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
        barTintColor="darkslateblue">
        <TabBarIOS.Item
          title="生活"
          systemIcon="more"
          selected={this.state.selectedTab === 'lifeTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'lifeTab',
            });
          }}>
          <NavigatorIOS style={styles.container}
              tintColor={'#333344'}
              initialRoute={{
                title: '生活',
                component: require('./App/Views/Home/mainScreen')
              }}
              itemWrapperStyle={styles.navigator} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          systemIcon="history"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="more"
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
              presses: this.state.presses + 1
            });
          }}>
          {this._renderContent('#783E33', 'Setting Tab', this.state.notifCount)}
        </TabBarIOS.Item>
      </TabBarIOS>

    );
  }
});


AppRegistry.registerComponent('anlint', () => anlint);

module.exports = anlint;