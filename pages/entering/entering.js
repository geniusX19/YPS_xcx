// import Http from '../utils/http.js'; //小程序支持ES6语法

//引入代码
var Http = require("../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let url = 'Login/login',
      params = {
        adminAccount: 15956960191,
        adminPassword: 123456
      };
    Http.Get(url, params).then(res => {
        if (res.code === 200) {
          console.log(res) //请求到的数据处理操作
        } else {
          wx.showToast({
            icon: 'none',
            title: '网络错误'
          })
        }
      })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '网络错误'
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})