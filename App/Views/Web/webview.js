'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  WebView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6EF',
    flexDirection: 'column',
  },
});

var Web = React.createClass({
  render: function() {
    var url = this.props.url;

    return (
      <View style={styles.container}>
        <WebView url={this.props.url} />
      </View>
    );
  }
});

module.exports = Web;