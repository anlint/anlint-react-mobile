/**
 * Anlint Home React Native App
 * https://anlint.com
 */
'use strict';

var React = require('react-native');
var ArticleView = require('../Web/webview');

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  ActivityIndicatorIOS,
  PixelRatio,
  NavigatorIOS,
  TouchableHighlight,
} = React;

// var AppRegistry = React.AppRegistry;
//var request_url = "https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json";
var request_url = 'http://leosblackboard.sinaapp.com/anlint'

var mainScreen = React.createClass({
  getInitialState: function() {
    return {
      //articles: []
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false
    }
  },

  // After render() will call this function
  componentDidMount: function() {
    // fetch Data
    fetch(request_url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true
        });
      })
      .done();
  },

  _itemPressed(articleTitle, articleLink) {
    var url = articleLink;
    var articleTitle = "文章";

    this.props.navigator.push({
      title: articleTitle,
      component: ArticleView,
      passProps: {url: url}
    });
  },

  render: function() {
    if (this.state.loaded) {
      return this.renderList();
    } else {
      return this.renderLoadingView();
    }
  },

  renderList: function() {
    return(
        <ListView
          dataSource = {this.state.dataSource}
          renderRow = {this.renderItem} />
      );
  },

  renderItem: function(rowData) {
    //var movie = {title:'美食 | 别辜负冰淇淋的一片盛情', date:'2015-09-18', posters: {thumbnail: 'https://dn-anlint0.qbox.me/FseCOstTejRXgca9NYcwW2KE4ueA'}}
    return (
      <TouchableHighlight onPress={() => this._itemPressed(rowData.title, rowData.link)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainner}>
            <Image style={styles.thumbnail} source={{ uri: rowData.thumbnail }} />
            <View  style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>{rowData.title}</Text>
              <Text style={styles.summary} numberOfLines={3}>{rowData.summary}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.loadingContainner}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicatorIOS />
      </View>
      );
  }

});



var styles = StyleSheet.create({
  loadingContainner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  loadingText: {
    fontSize: 14,
    marginBottom: 20
  },
  rowContainner: {
    flexDirection: 'row',
    padding: 10,
  },
  textContinner: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
    width: 125 * PixelRatio.get()
  },
  summary: {
    fontSize: 13.5,
    color: '#656565',
    width: 120 * PixelRatio.get(),
    marginTop: 5
  },
  thumbnail: {
    width: 49 * PixelRatio.get(),
    height: 49 * PixelRatio.get(),
    marginRight: 10
  },
  separator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#dddddd'
  },
});

module.exports = mainScreen;
