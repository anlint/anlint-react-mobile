'use strict';

var React = require('react-native');
var {
  Image,
  View,
  Text,
  StyleSheet,
  ListView,
  Dimensions,
  ActivityIndicatorIOS,
} = React;

/*list status change graph
*
*STATUS_NONE->[STATUS_REFRESH_IDLE, STATUS_INFINITE_IDLE]
*STATUS_REFRESH_IDLE->[STATUS_NONE, STATUS_WILL_REFRESH]
*STATUS_WILL_REFRESH->[STATUS_REFRESH_IDLE, STATUS_REFRESHING]
*STATUS_REFRESHING->[STATUS_NONE]
*STATUS_INFINITE_IDLE->[STATUS_NONE, STATUS_WILL_INFINITE]
*STATUS_WILL_INFINITE->[STATUS_INFINITE_IDLE, STATUS_INFINITING]
*STATUS_INFINITING->[STATUS_NONE]
*
*/
var
STATUS_NONE = 0,
STATUS_REFRESH_IDLE = 1,
STATUS_WILL_REFRESH = 2,
STATUS_REFRESHING = 3,
STATUS_INFINITE_IDLE = 4,
STATUS_WILL_INFINITE = 5,
STATUS_INFINITING = 6;

var DEFAULT_PULL_DISTANCE = 60;
var DEFAULT_HF_HEIGHT = 50;

var RefreshInfiniteListView = React.createClass({
  getDefaultProps () {
    return {
      footerHeight: DEFAULT_HF_HEIGHT,
      pullDistance: DEFAULT_PULL_DISTANCE,
      renderEmptyRow: () => {
        return (
          <View style={{height:Dimensions.get('window').height, justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:20, fontWeight:'300', color:'#333444'}}>
              没有数据
            </Text>
          </View>
        )
      },
      renderHeaderRefreshIdle: () => {return (
        <View style={{flex:1, height:DEFAULT_HF_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>
            下拉刷新...
          </Text>
          <Image
            source={require('image!pull_arrow')}
            resizeMode={Image.resizeMode.stretch}
            style={styles.image}
            />
        </View>
      )},
      renderHeaderWillRefresh: () => {return (
        <View style={{height:DEFAULT_HF_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>
            松开刷新...
          </Text>
          <Image
            source={require('image!pull_arrow')}
            resizeMode={Image.resizeMode.stretch}
            style={[styles.image, styles.imageRotate]}
            />
        </View>
      )},
      renderHeaderRefreshing: () => {return (
        <View style={{height:DEFAULT_HF_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>
            刷新...
          </Text>

          <ActivityIndicatorIOS
            size='small'
            animating={true}/>
        </View>
      )},
      renderFooterInifiteIdle: () => {return (
        <View style={{height:DEFAULT_HF_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <Image
            source={require('image!pull_arrow')}
            resizeMode={Image.resizeMode.stretch}
            style={[styles.image, styles.imageRotate]} />
          <Text style={styles.text}>
            上拉更多...
          </Text>
        </View>
      )},
      renderFooterWillInifite: () => {return (
        <View style={{height:DEFAULT_HF_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <Image
            source={require('image!pull_arrow')}
            resizeMode={Image.resizeMode.stretch}
            style={styles.image} />
          <Text style={styles.text}>
            松开加载更多...
          </Text>
        </View>
      )},
      renderFooterInifiting: () => {return (
        <View style={{height:DEFAULT_HF_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicatorIOS
            size='small'
            animating={true}/>
          <Text style={styles.text}>
            加载...
          </Text>
        </View>
      )},
      onRefresh: () => {
        console.log("onRefresh");
      },
      onInfinite: () => {
        console.log("onInfinite");
      },
    };
  },
  getInitialState() {
    return {
      status: STATUS_NONE,
      isLoadedAllData: false,
    }
  },
  renderRow(text) {
    if (this.dataSource) {
      return this.props.renderEmptyRow(text);
    } else {
      return this.props.renderRow(text);
    }
  },
  renderHeader() {
    var status = this.state.status;
    if (status===STATUS_REFRESH_IDLE) {
      return this.props.renderHeaderRefreshIdle();
    }
    if (status===STATUS_WILL_REFRESH) {
      return this.props.renderHeaderWillRefresh();
    }
    if (status===STATUS_REFRESHING) {
      return this.props.renderHeaderRefreshing();
    }
    return null;
  },
  renderFooter() {
    var status = this.state.status;
    if (status===STATUS_INFINITE_IDLE) {
      this.footerIsRender = true;
      return this.props.renderFooterInifiteIdle();
    }
    if (status===STATUS_WILL_INFINITE) {
      this.footerIsRender = true;
      return this.props.renderFooterWillInifite();
    }
    if (status===STATUS_INFINITING) {
      this.footerIsRender = true;
      return this.props.renderFooterInifiting();
    }
    this.footerIsRender = false;
    return null;
  },
  handleResponderGrant(event) {
    var nativeEvent = event.nativeEvent;
    if (!nativeEvent.contentInset || this.state.status!==STATUS_NONE) {
      return;
    }
    var y0 = nativeEvent.contentInset.top + nativeEvent.contentOffset.y;
    if (y0 < 0) {
      this.setState({status:STATUS_REFRESH_IDLE});
      return;
    }
    y0 = nativeEvent.contentInset.top + nativeEvent.contentOffset.y +
    nativeEvent.layoutMeasurement.height-nativeEvent.contentSize.height;
    if (y0 > 0) {
      this.initialInfiniteOffset = (y0>0?y0:0);
      this.setState({status:STATUS_INFINITE_IDLE});
    }
  },
  hideHeader() {
    this.setState({status:STATUS_NONE});
  },
  hideFooter() {
    this.setState({status:STATUS_NONE});
  },
  handleResponderRelease(event) {
    var status = this.state.status;
    if (status === STATUS_REFRESH_IDLE) {
      this.setState({status:STATUS_NONE});
    } else if (status === STATUS_WILL_REFRESH) {
      this.setState({status:STATUS_REFRESHING});
      this.props.onRefresh();
    } else if (status === STATUS_INFINITE_IDLE) {
      this.setState({status:STATUS_NONE});
    } else if (status === STATUS_WILL_INFINITE) {
      this.setState({status:STATUS_INFINITING});
      this.props.onInfinite();
    }
  },
  handleScroll(event) {
    var nativeEvent = event.nativeEvent;
    var status = this.state.status;
    if (status===STATUS_REFRESH_IDLE || status===STATUS_WILL_REFRESH) {
      var y = nativeEvent.contentInset.top + nativeEvent.contentOffset.y
      if (status!==STATUS_WILL_REFRESH && y<-this.props.pullDistance) {
        this.setState({status:STATUS_WILL_REFRESH});
      } else if (status===STATUS_WILL_REFRESH && y>=-this.props.pullDistance) {
        this.setState({status:STATUS_REFRESH_IDLE});
      }
      return;
    }

    if (status===STATUS_INFINITE_IDLE || status===STATUS_WILL_INFINITE) {
      var y = nativeEvent.contentInset.top + nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height
      -nativeEvent.contentSize.height-this.initialInfiniteOffset;
      if (this.footerIsRender) {
        y += this.props.footerHeight;
      }
      if (status!==STATUS_WILL_INFINITE && y>this.props.pullDistance) {
        this.setState({status:STATUS_WILL_INFINITE});
      } else if (status===STATUS_WILL_INFINITE && y<=this.props.pullDistance) {
        this.setState({status:STATUS_INFINITE_IDLE});
      }
    }
  },
  render() {
    this.dataSource = null;
    if (!this.props.dataSource.getRowCount()) {
      var DataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.dataSource = DataSource.cloneWithRows([""]);

    }
    return (
      
      <ListView
        {...this.props}
        dataSource={this.dataSource?this.dataSource:this.props.dataSource}
        renderRow={this.renderRow}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        onResponderGrant={this.handleResponderGrant}
        onResponderRelease={this.handleResponderRelease}
        onScroll={this.handleScroll}
        onLayout={this.handleLayout} />
    )
  }
});

var styles = StyleSheet.create({
  text: {
    fontSize:14,
  },
  image: {
    width:40,
    height:32,
  },
  imageRotate: {
    transform:[{rotateX: '180deg'},],
  }
});

module.exports = RefreshInfiniteListView;
