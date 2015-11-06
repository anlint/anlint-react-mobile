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
  ScrollView,
  ActivityIndicatorIOS,
  PixelRatio,
  NavigatorIOS,
  TouchableHighlight,
  Dimensions
} = React;

var deviceWidth = Dimensions.get('window').width;

var StyleDetail = React.createClass({
  render() {
    var data = this.props.rowData;
    var dayDiff = (Date.now() - new Date(data.create_at)) / (24*3600*1000);

    var cate = ["健身", "料理", "萌宠"];
    var style = ["光明", "黑暗", "温暖", "疯狂"];

    var descriptionTab = "发布了一条" + style[data.styleid - 1] + "的" + cate[data.cateid - 1] + "方式";

    return(
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}>
        
        <View style={styles.container}>
          <View style={styles.titleContainner}>
            <Image style={styles.headimg} source={{ uri: data.headimg }} />
            <Text style={styles.title} numberOfLines={2}>{data.pubname}</Text>
            <Text style={styles.date} numberOfLines={1}>{Math.round(dayDiff)}天前发布</Text>
          </View>
          <Text> {descriptionTab} </Text>
          <Image style={styles.detailPic} source={{uri: data.pic}} />
          <Text style={styles.summary}> {data.text} </Text>
          <View style={{height: 65}} />
        </View>
      </ScrollView>       
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  titleContainner: {
    flex:1,
    flexDirection:'row',
    paddingBottom: 5
  },
  headimg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
    //width: deviceWidth * 0.62,
    marginTop: 10,
    marginLeft: 5
  },
  date: {
    fontWeight: '200',
    fontSize: 10,
    color: '#333444',
    marginTop: 12,
    marginLeft: 5
  },
  detailPic: {
    width: deviceWidth - 20,
    height: deviceWidth,
    marginTop: 5
  },
  summary: {
    fontSize: 14,
    color: '#656565',
    width: deviceWidth - 20,
    paddingRight: 10,
    marginTop: 10
  },
});

module.exports = StyleDetail;