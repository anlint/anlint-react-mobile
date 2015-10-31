/**
 * Anlint Home React Native App
 * https://anlint.com
 */
'use strict';

var React = require('react-native');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
  WebView
} = React;



var aboutScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <WebView
          style={{flex: 1, height: 320}}
          url={'https://www.anlint.com/lifestyle/lints/5632d8fcd8e0ef610f89255a'} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('anlint', () => anlint);

module.exports = aboutScreen;