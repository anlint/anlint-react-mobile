# anlint react-native 0.1.0
> [安邻网][1]ios客户端


## 运行
`npm install`

`npm start`



## 调试
###iOS 真机调试

####方法一：（从设备访问开发服务器）

首先，你的笔记本电脑和你的手机必须处于相同的 wifi 网络中。

打开 iOS 项目的 AppDelegate.m 文件

更改 jsCodeLocation 中的 localhost 改成你电脑的局域网IP地址

在 Xcode 中，选择你的手机作为目标设备，Run 即可

可以通过晃动设备来打开开发菜单(重载、调试等)

####方法二：（使用离线包）

你也可以将应用程序本身的所有 JavaScript 代码打包。这样你可以在开发服务器没有运行时测试它，并把应用程序提交到到 AppStore。


打开 `iOS / AppDelegate.m`

遵循“选项 2”的说明：

取消 `jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`

在你应用程序的根目录的终端运行给定 `curl` 命令 （`$ curl 'http://localhost:8081/Game2048.bundle?platform=ios' -o main.jsbundle` ）//此时应该先在本地启动服务

//打包项目的根目录下的 js 文件到 `main.jsbundle` (可以直接使用上述 curl 方法打包 javascript 即可)  `$ react-native bundle [--minify]`

Packager 支持几个选项：

dev(默认的 true)——设置了 __DEV__ 变量的值。当是 true 时，它会打开一堆有用的警告。对于产品，它建议使用 `dev = false`。

minify(默认的 false)——只要不通过 UglifyJS 传输 JS 代码。

Example: `react-native bundle --minify --dev=false`


关闭开发选项： `curl "http://localhost:8081/index.ios.bundle?platform=ios&dev=false" -o main.jsbundle`


####Xcode7上运行报错解决方法

在 Xcode7 指定真机运行，结果报出如下错误：`Undefined symbols for architecture arm64:   "_RCTSetLogFunction`

>Undefined symbols for architecture arm64:   "_RCTSetLogFunction", referenced from:       -[PropertyFinderTests testRendersWelcomeScreen] in PropertyFinderTests.o ld: symbol(s) not found for architecture arm64 clang: error: linker command failed with exit code 1 (use -v to see invocation)

在 `Build Setting -> Linking (All) ->  Dead Code Stripping` 中设置为 No 就可以了。



## 版本更新说明：
### 0.0.1
1. 实现了基本文章访问及查看功能和底部菜单栏
2. api接口采用的是挂在SAE上临时手写的python爬虫

### 0.0.2
1. UI进行调整，改为大图配标题，图在上标题在下
2. 菜单栏配色改为和安邻网相似的红色
3. 新增App图标

### 0.1.0
1. 使用anlint的api接口来访问数据
2. 优化了navigator和tabview的显示效果
3. 还是存在一些bug

### 0.2.2
1. 去掉了底部的TabBar
2. 改进了方式页的显示方式
3. 新增了下拉刷新

### 0.3.0
1. 底部显示不完全的bug修复，下拉刷新bug修复
2. 新增上拉load more
3. bundle identifier 修改为 `com.anlint.style`
4. 新增方式页面的时间显示
5. 新增用户头像显示
6. 新增方式详情页显示（点击后跳转到详情页面显示全部内容）





## 0.x.x to do list
- 代码重构，进一步模块化
- ~~加入顶部二级导航栏~~
- ~~首页UI调整（改为卡片模式）~~
- 实现加载缓存判断
- ~~适配更多尺寸的屏幕~~
- **添加上拉加载更多**

## 0.x.x bug list
- ~~滚到底部有一部分内容显示不了~~
- ListView的卡片式布局，右边的padding没有显示出来
- **ScrollTabView里嵌套的页面点击StatusBar没有办法滚动到顶部，WebView页面则没有问题**
- ~~下拉刷新还有一些bug~~
- 在`RefreshInfiniteListView`中为`ListView`下方添加了一定高度但是内容为空的`View`后，方式页面下方多出一定的空白




[1]:	https://anlint.com