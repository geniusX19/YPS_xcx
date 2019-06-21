//logs.js

const app = getApp();

const util = require('../../utils/util.js');

var coordinate = require('../../utils/coordinate.js');

//引入页面api
import Api from '../../utils/api';
Page({
  data: {
    loginShow: false, // 登录标识
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断小程序的API，回调，参数，组件等是否在当前版本可用
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var that = this;
    console.log(e.detail);
    that.setData({
      userInfo: e.detail.userInfo,
      loginShow: true
    })
    app.globalData.userInfo = e.detail.userInfo;
    wx.showTabBar({
      aniamtion: true,
    })
    console.log(app.globalData.userInfo);
    var data = {
      "nickName": app.globalData.userInfo.nickName,
      "avatarUrl": app.globalData.userInfo.avatarUrl,
      "gender": app.globalData.userInfo.gender,
      "province": app.globalData.userInfo.province,
      "city": app.globalData.userInfo.city,
      "country": app.globalData.userInfo.country
    }
    that.userLogin(data);
  },
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
              app.loadCartNum()
              wx.navigateBack({
                delta: 1
              })
            })
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
