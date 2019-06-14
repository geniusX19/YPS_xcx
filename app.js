//app.js

//引入代码
import Api from './utils/api'

App({
  onLaunch: function () {
    var _this = this;
    var app = getApp();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    _this.loadCartNum();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        } else {

        }
      }
    })

    // 获取用户手机导航栏高度
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        //导航高度
        _this.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  globalData: {
    userInfo: null,// 当前用户的用户信息
    navHeight: null,// 当前用户设备的导航栏高度
    shoppingData: 0,// 当前用户购物车内商品数量
    loginStatus: true,// 当前用户的登陆状态
    sortCurrent: 0,// 首页点击图标跳转对应分类页面识别对应分类模块标识
    switchTit: 0,// 
    third_Session: null,// 当前用户权限信息
    queryName:null,// 判断首页查询
    queryData:null,//首页搜索参数
    apiSrc: "https://peter.xiaomiqiu.com/",
  },
  /**
   * 加载用户购物车内商品数量
   */
  loadCartNum: function () {
    console.log("开始加载");
    var _this = this;
    Api.searchCart().then(res => {
      console.log(res);
      _this.globalData.shoppingData = _this.globalData.shoppingData + res.data.length;
      wx.setTabBarBadge({
        index: 2,
        text: "" + this.globalData.shoppingData + "", //可改 
      });
    })
  },
  /**
   * 加入购物车方法
   */
  addCart: function (e, flag) {
    return new Promise((resolve, reject) => {
      var _this = this;
      Api.addCart(e).then(res => {
        console.log("添加购物车返回数据", res);
        if (res.flag) {
          _this.globalData.shoppingData = res.data.length;
          wx.setTabBarBadge({
            index: 2,
            text: "" + this.globalData.shoppingData + "", //可改 
          });
        }
        resolve(
          res.data
        )
      })
    })
  },
  /**
   * 删除购物车方法
   */
  // deleteCart: function (e, flag) {
  //   return new Promise((resolve, reject) => {
  //     var _this = this;
  //     Api.addCart(e).then(res => {
  //       console.log("添加购物车返回数据", res)
  //       if (res.flag) {
  //         _this.globalData.shoppingData = res.data.length;
  //         wx.setTabBarBadge({
  //           index: 2,
  //           text: "" + this.globalData.shoppingData + "", //可改 
  //         });
  //       }
  //       resolve(
  //         res.data
  //       )
  //     })
  //   })
  // },
  /**
   * 小程序登录请求
   */
  userLogin: function (data) {
    var _this = this;
    // 登录
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          Api.login(res.code).then(resp => {
            console.log("获取Token：", resp);
            wx.setStorageSync("third_Session", resp.data);
            Api.saveUserInfo(data).then(res => {
              console.log('保存用户信息', res);
            })
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})