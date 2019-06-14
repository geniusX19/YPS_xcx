// pages/addresses/addresses.js

var app = getApp();

import Api from '../../utils/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度**
    isHide: false, // 用于判断当前列表是否为空
    addressList: [], // 用户地址列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
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
    let _this = this;
    //获取收件地址
    _this.queryAddress();
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

  /*
   * 设置默认地址
   */
  toUser: function (e) {
    var _this = this;
    // console.log('设置了地址', e.currentTarget.dataset.id);
    Api.ToUser(e.currentTarget.dataset.id).then(res => {
      console.log(res);
      this.queryAddress();
      wx.showToast({
        title: '已成功设置默认地址',
        icon: 'none',
      });
      setTimeout(() => {
        wx.hideLoading()
      }, 1500);
    })
  },



  /**
   * 新增地址
   */
  addAddress: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/saveAddress/saveAddress',
    })
  },

  /**
   * 编辑地址
   */
  updateAddres: function (e) {
    var _this = this;
    // var id = '1128936982760656896';
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/saveAddress/saveAddress?id=' + id,
    })
  },

  /**
   * 删除地址
   */
  delAddress: function (e) {
    var _this = this;
    console.log('删除了地址')

    wx.showModal({
      content: '您确定删除这个地址么？',
      success(res) {
        if (res.confirm) {
          Api.Deladdress(e.currentTarget.dataset.id).then(res => {
            console.log(res);
            wx.showLoading({
              title: '正在删除地址...',
            })
            setTimeout(function () {
              _this.queryAddress();
              wx.hideLoading()
            }, 1500)
          })
        }
      }
    })
  },

  /**
   * 获取收件地址列表
   */
  queryAddress(res) {
    Api.addressList().then(res => {
      console.log(res);
      if (res.data.length == 0) {
        this.setData({
          isHide: true
        })
      } else {
        this.setData({
          isHide: false,
          addressList: res.data
        })
      }
    });
  }



})