/**
 * Anlint Home React Native App
 * https://anlint.com
 */
'use strict';

var React = require('react-native');
var ArticleView = require('../Web/webview');
var RefreshableListView = require('react-native-refreshable-listview');

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
  Dimensions
} = React;

// var AppRegistry = React.AppRegistry;
// var request_url = 'http://leosblackboard.sinaapp.com/anlintapi'
var api_url = 'https://www.anlint.com/api/v1/lint/getall';
var deviceWidth = Dimensions.get('window').width;

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

    // this.props.navigator.push({
    //   title: articleTitle,
    //   component: ArticleView,
    //   passProps: {url: url}
    // });
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
            <View  style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>{rowData.pubname}</Text>
              <Text style={styles.summary} numberOfLines={4}>{rowData.text}</Text>
            </View>
            <Image style={styles.thumbnail} source={{ uri: rowData.pic }} />
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.loadingContainner}>
        <Text style={styles.loadingText}>正在加载...</Text>
        <ActivityIndicatorIOS />
      </View>
      );
  },


  render: function() {
    if (this.state.loaded) {
      return(
        <RefreshableListView
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          loadData={this.renderLoadingView}
          style={styles.topicListView}
          refreshDescription="正在刷新..."
          minDisplayTime={500}
          minPulldownDistance={80}
          minBetweenTime={2000} />);
    } else {
      return this.renderLoadingView();
    }
  },

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
    flex: 3,
    width: deviceWidth * 0.65,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
    //width: 125 * PixelRatio.get(),
    width: deviceWidth * 0.65,
  },
  summary: {
    fontSize: 13.5,
    color: '#656565',
    //width: 120 * PixelRatio.get(),
    width: deviceWidth * 0.65,
    marginTop: 5
  },
  thumbnail: {
    // width: 49 * PixelRatio.get(),
    height: deviceWidth * 0.3,
    width: deviceWidth * 0.3,
    marginRight: 10
  },
  separator: {
    height: 10 / PixelRatio.get(),
    backgroundColor: '#dddddd'
  },
});

module.exports = style;
