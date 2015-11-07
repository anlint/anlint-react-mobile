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

var RefreshableListView = require('react-native-refreshable-listview');
//var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var TimerMixin = require('react-timer-mixin');

var deviceWidth = Dimensions.get('window').width;

var ArticleView = require('../Components/webview');
var RefreshInfiniteListView = require('../Components/RefreshInfiniteListView');

var api_url = 'https://www.anlint.com/api/v1/serv/getall';
var base_api_url = 'https://www.anlint.com/api/v1/serv/getall?lastdate=';

// assumes immutable objects
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var CACHE = [];

var LifeScreen = React.createClass({
  mixins: [TimerMixin],
  data: {index: 0, list:[]},
  lastdate: String,

  getData(init) {
      fetch(init?api_url:(base_api_url + this.lastdate))
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.Servs){
            if(init) CACHE = [];
            this.cache(responseData.Servs);
          }else{
            //notify no data
          }
          this.setState({
            loaded: true,
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .done();

  },
  // 自定义函数处理网络获取数据，将数据放入全局变量CACHE
  cache: function(items) {
    for (var i in items) {
      CACHE.push(items[i]);
    }
    // 获取最后一篇文章的时间并转化为标准格式
    this.lastdate = new Date(items[items.length - 1].create_at).toISOString();

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(CACHE),
    });
  },

  getInitialState() {
      this.getData(true);
      return {
        isLoadedAllData: false,
        dataSource: ds.cloneWithRows(CACHE)
      }
  },
  onRefresh() {
    this.getData(true);
    this.setTimeout(()=>{
        this.list.hideHeader();
        this.setState({dataSource: ds.cloneWithRows(CACHE)});
    }, 1000);
  },
  onInfinite() {
    this.getData();
    this.setTimeout(()=>{
      this.list.hideFooter();
      this.setState({dataSource: ds.cloneWithRows(CACHE)});
    }, 1000);
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
      <View style={{flex:1, flexDirection: 'column', justifyContent: 'center'}}>
        <RefreshInfiniteListView
          ref = {(list) => {this.list= list}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          initialListSize={30}
          scrollEventThrottle={10}
          style={{backgroundColor:'transparent'}}
          onRefresh = {this.onRefresh}
          onInfinite = {this.onInfinite} >
        </RefreshInfiniteListView>
        <View style={{height : 60}} />
      </View>
    );
  },

  renderRow: function(rowData) {
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
      return this.renderList();
    } else {
      return this.renderLoadingView();
    }
  }

});



var styles = StyleSheet.create({
  Containner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
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
    width: deviceWidth - 32
  },
  summary: {
    fontSize: 13.5,
    //color: '#656565',
    color: 'white',
    width: deviceWidth - 32,
    padding: 5,
    backgroundColor: ''
  },
  thumbnail: {
    //width: 170 * PixelRatio.get(),
    //height: 100 * PixelRatio.get(),
    width: deviceWidth - 18,
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
    padding: 5,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    width: deviceWidth - 32,
    color: '#333333'
  },
  card: {
    flexDirection: 'column',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    padding: 0,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

module.exports = LifeScreen;
