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
  Dimensions,
  AlertIOS
} = React;


var RefreshableListView = require('react-native-refreshable-listview');
//var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var TimerMixin = require('react-timer-mixin');

var deviceWidth = Dimensions.get('window').width;

var ArticleView = require('../Components/webview');
var StyleDetailView = require('./StyleDetail');
var RefreshInfiniteListView = require('../Components/RefreshInfiniteListView');

var api_url = 'https://www.anlint.com/api/v1/lint/getall';
var base_api_url = 'https://www.anlint.com/api/v1/lint/getall?lastdate=';

// assumes immutable objects
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}) 
var CACHE = [];

var StyleScreen = React.createClass({
  mixins: [TimerMixin],
    data: {index: 0, list:[]},
    lastdate: String,

    getData(init) {
      var total = 10;
      if (init) {
        this.data.index = 0;

        // fetch Data
        fetch(api_url)
          .then((response) => response.json())
          .then((responseData) => {
            this.cache(responseData.Lints);
            this.setState({
              loaded: true,
            });
          })
          .catch((error) => {
            console.log("数据加载出错");
            AlertIOS.alert(
              '提示',
              '请检查您的网络连接是否正常',
              [
                {text: '好的', onPress: () => console.log('Report Success!')},
              ]
            );
          })
          .done();  
      }
      else {
        console.log(base_api_url + this.lastdate);
        fetch(base_api_url + this.lastdate)
          .then((response) => response.json())
          .then((responseData) => {
            this.cache(responseData.Lints);
            this.setState({
              loaded: true,
            });
          })
          .catch((error) => {
            console.log("数据加载出错");
            AlertIOS.alert(
              '提示',
              '请检查您的网络连接是否正常',
              [
                {text: '好的', onPress: () => console.log('Report Success!')},
              ]
            );
          })
          .done();
      }
    },

    // 自定义函数处理网络获取数据，将数据放入全局变量CACHE
    cache: function(items) {
      for (var i in items) {
        CACHE.push(items[i]);
      }

      // 获取最后一篇文章的时间并转化为标准格式
      this.lastdate = new Date(items[items.length - 1].create_at).toISOString();
      //console.log(this.lastdate);

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


  _reload() {
    // fetch Data
    fetch(request_url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(CACHE),
          loaded: true
        });
      })
      .done();
  },


  _itemPressed(rowData) {
    var articleTitle = "方式";
    this.props.navigator.push({
      title: articleTitle,
      component: StyleDetailView,
      passProps: {rowData: rowData}
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
          style={{backgroundColor:'transparent'/*,top:100, left:10, width:200, height:300, position:'absolute'*/}}
          onRefresh = {this.onRefresh}
          onInfinite = {this.onInfinite} >
        </RefreshInfiniteListView>
        <View style={{height : 80}} />
        </View>
      );
  },

  renderRow: function(rowData) {
    var dayDiff = (Date.now() - new Date(rowData.create_at)) / (24*3600*1000);
    
    //无图模式
    if(!rowData.pic)
    {
      for(var item in rowData) {
        console.log(item + "==" + rowData[item]);
      }

      return(
        <TouchableHighlight onPress={() => this._itemPressed(rowData.id, rowData.id)}
            underlayColor='#dddddd'>
          <View>
            <View style={styles.card}>
              <View style={styles.textContainer}>
                <View style={styles.titleContainner}>
                  <Text style={styles.title} numberOfLines={2}>{rowData.pubname}</Text>
                  <Text style={styles.date} numberOfLines={1}>{Math.round(dayDiff)}天前发布</Text>
                </View>
                <Text style={styles.summaryWithoutWidth} numberOfLines={6}>{rowData.text}</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <TouchableHighlight onPress={() => this._itemPressed(rowData)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <View style={styles.titleContainner}>
                <Image style={styles.headimg} source={{ uri:rowData.headimg }} />
                <Text style={styles.title} numberOfLines={2}>{rowData.pubname}</Text>
                <Text style={styles.date} numberOfLines={1}>{Math.round(dayDiff)}天前发布</Text>
              </View>
              <Text style={styles.summary} numberOfLines={6}>{rowData.text}</Text>
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
      return this.renderList();
    } else {
      return this.renderLoadingView();
    }
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
  titleContainner: {
    flex:1,
    flexDirection:'row'
  },
  headimg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
    //width: deviceWidth * 0.62,
    paddingRight: 10,
    marginLeft: 3
  },
  date: {
    fontWeight: '200',
    fontSize: 10,
    color: '#333444',
    paddingTop: 5
  },
  summary: {
    fontSize: 13.5,
    color: '#656565',
    //width: 120 * PixelRatio.get(),
    width: deviceWidth * 0.62,
    paddingRight: 10,
    marginTop: 5
  },
  summaryWithoutWidth: {
    fontSize: 13.5,
    color: '#656565',
    width: deviceWidth * 0.92,
    marginTop: 5
  },
  thumbnail: {
    // width: 49 * PixelRatio.get(),
    height: deviceWidth * 0.3,
    width: deviceWidth * 0.3,
  },
  separator: {
    height: 0 / PixelRatio.get(),
    backgroundColor: '#dddddd'
  },
  card: {
    flexDirection: 'row',
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

module.exports = StyleScreen;
