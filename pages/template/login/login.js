// pages/template/login/login.js

const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 切换密码是否可见
   */
  switchEye() {
    var that = this;
    util.switchEye(that, that.data.eye, that.data.showpass)
  },

  /**
   * 获取密码
   */
  getPassWord: function (e) {
    var that = this;
    var password = e.detail.value;
    util.getPassWord(that, password)
  },

  /**
   * 获取邮箱
   */
  getEmail(e) {
    var that = this;
    var email = e.detail.value;
    util.getEmail(that, email)
  },

  /**
   * 关闭模态框
   */
  close() {
    var that = this;
    util.close(that)
  },

  /**
   * 判断是否登陆
   */
  islogin() {
    if (true) {
      this.setData({
        logShow: true
      })
    } else {
      wx.navigateTo({
        url: '跳转的页面',
      })
    }
  },
})
