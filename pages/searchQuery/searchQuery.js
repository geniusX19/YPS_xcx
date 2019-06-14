// pages/searchQuery/searchQuery.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    currentArry: [{
      text: "追溯码查询"
    }, {
      text: "条形码+批次"
    }], // 标签内容
    currentTab: 0, // 标签对应块标识
    code: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight
    });
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
   * 点击切换标签
   */
  navtap: function (e) {
    var _this = this;
    _this.setData({
      currentTab: e.currentTarget.dataset.num
    })
  },

  /**
   * 扫一扫
   */
  scan: function () {
    var _this = this;
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: function (res) {
        console.log(res.result)
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  
  //获取追溯码
  getCode: function (e) {
    var _this = this;
    _this.setData({
      code: e.detail.value
    })
  },

  //查询
  query: function () {
    var _this = this;
    console.log(_this.data.code)
  }
})