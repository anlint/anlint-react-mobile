/**
 * Anlint Home React Native App
 * https://anlint.com
 */
'use strict';

var React = require('react-native');

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

var deviceWidth = Dimensions.get('window').width;
var ArticleView = require('../Web/webview');
var RefreshableListView = require('react-native-refreshable-listview');

// var AppRegistry = React.AppRegistry;
var request_url = 'http://leosblackboard.sinaapp.com/anlintapi';
var api_url = 'https://www.anlint.com/api/v1/serv/getall';


var lifeScreen = React.createClass({
  getInitialState: function() {
    console.log(deviceWidth);
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
          dataSource: this.state.dataSource.cloneWithRows(responseData.Servs),
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
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true
        });
      })
      .done();
  },


  _onPress(articleTitle, articleLink) {
    var url = articleLink;
    // var articleTitle = "文章";

    this.props.navigator.push({
      title: articleTitle,
      component: ArticleView,
      passProps: {url: url}
    });
  },

  renderList: function() {
    return(
      <UIExplorerPage
        title={this.props.navigator ? null : '<ListView> - Simple'}
        noSpacer={true}
        noScroll={true}>
        <ListView
          style = {styles.topicListView}
          dataSource = {this.state.dataSource}
          renderRow = {this.renderRow} 
          canLoadMore={this.state.canLoadMoreContent}
          isLoadingMore={this.state.isLoadingContent} />
      </UIExplorerPage>
    );
  },

  renderRow: function(rowData) {
    //var movie = {title:'美食 | 别辜负冰淇淋的一片盛情', date:'2015-09-18', posters: {thumbnail: 'https://dn-anlint0.qbox.me/FseCOstTejRXgca9NYcwW2KE4ueA'}}
    return (
      <TouchableHighlight onPress={() => this._onPress(rowData.title, rowData.link)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.card}>
            <Image style={styles.thumbnail} source={{ uri: rowData.pic }} />
            <View  style={styles.textContainer}>
              <Text style={styles.topicTitle} numberOfLines={2}>{rowData.title}</Text>
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
          renderRow={this.renderRow}
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
    flexDirection: 'column',
    padding: 6,
    backgroundColor: 'white',
  },
  textContinner: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333444',
    padding: 5,
    width: deviceWidth - 40
  },
  summary: {
    fontSize: 13.5,
    //color: '#656565',
    color: 'white',
    width: deviceWidth - 40,
    padding: 5,
    backgroundColor: ''
  },
  thumbnail: {
    //width: 170 * PixelRatio.get(),
    //height: 100 * PixelRatio.get(),
    width: deviceWidth - 40,
    height: 150,
  },
  separator: {
    height: 0 / PixelRatio.get(),
    backgroundColor: '#dddddd',
  },

  topicListView: {
    flex: 1,
    backgroundColor: '#ebeced',   //#f0f0f0
    padding: 8,
    overflow: 'hidden',
  },
  topicCard: {
    flex: 1,
    flexDirection: 'column',
    padding: 6,
    backgroundColor: '#ffffff',
    marginBottom: 5,
    borderColor: '#f0f0f0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 0
  },
  topicTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    // width: deviceWidth - 20,
    color: '#333333'
  },
  card: {
    flexDirection: 'column',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

module.exports = lifeScreen;
