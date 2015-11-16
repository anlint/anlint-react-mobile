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
  Dimensions,
  TimerMixin,
  AlertIOS
} = React;

var deviceWidth = Dimensions.get('window').width;


var report_base_url = 'https://www.anlint.com/api/v1/lint/getone/';

var StyleDetail = React.createClass({
  mixins: [TimerMixin],
  data: {index: 0, list:[]},
  lastdate: String,

  sendReport(id) {
    // fetch Data
    fetch(report_base_url + id + '/devote')
      .then((response) => response.json())
      .then((responseData) => {
        this.cache(responseData);
        this.setState({
          loaded: true,
        });
      })
      .catch((error) => { 
        console.log('report error : ' + report_base_url + id + '/devote'); 
        console.log(error);
      })
      .done( () => {
        AlertIOS.alert(
          '通知',
          '举报成功，举报信息已提交审核',
          [
            {text: '好的', onPress: () => console.log('Report Success!')},
          ]
        );
      });
  },

  cache(item) {
    console.log(item.msg);
  },


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
          <View style={styles.footContainer}>
            <TouchableHighlight style={styles.wrapper}
              onPress={() => this.sendReport(data.id)}>
              <Text style={styles.report}>举报</Text>
            </TouchableHighlight>
          </View>
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
  footContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10

  },
  report: {
    color: '#3f3f3f',
    fontSize: 12,
    width: 30
  }
});

module.exports = StyleDetail;