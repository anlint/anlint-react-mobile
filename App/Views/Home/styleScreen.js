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
// var request_url = 'http://leosblackboard.sinaapp.com/anlintapi'
var api_url = 'https://www.anlint.com/api/v1/lint/getall'

var style = React.createClass({
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
    fetch(api_url)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData.Lints);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.Lints),
          loaded: true
        });
      })
      .done();
  },


  _reload() {
    // fetch Data
    fetch(request_url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.Lints),
          loaded: true
        });
      })
      .done();
  },


  _itemPressed(articleTitle, articleId) {
    var url = "https://www.anlint.com/lifestyle/lints/" + articleId;
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
    return (
      <TouchableHighlight onPress={() => this._itemPressed(rowData.id, rowData.id)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainner}>
            <Image style={styles.thumbnail} source={{ uri: rowData.pic }} />
            <View  style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>{rowData.id}</Text>
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
    flexDirection: 'column',
    padding: 0,
    backgroundColor: 'white',
    marginTop: 0
  },
  textContinner: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333444',
    padding: 5,
    width: 190 * PixelRatio.get()
  },
  summary: {
    fontSize: 13.5,
    color: '#656565',
    width: 185 * PixelRatio.get(),
    padding: 5,
  },
  thumbnail: {
    width: 190 * PixelRatio.get(),
    height: 80 * PixelRatio.get(),
    // marginRight: 10
  },
  separator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#dddddd'
  },
});

module.exports = style;
