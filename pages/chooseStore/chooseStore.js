// pages/chooseStore/chooseStore.js

var app = getApp();
import Api from '../../utils/api';

var page = 1; //当前页码
var size = 10; //一页多少条

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    latitude: null,// 经纬度
    longitude: null,// 经纬度
    tab: 0,// 列表标识
    storeList: [],// 门店列表哦
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/imgs/logo.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      latitude: wx.getStorageSync('store')[0].latitude,
      longitude: wx.getStorageSync('store')[0].longitude
    });
    var data = [
      {
        iconPath: '/imgs/logo.png',
        id: 0,
        latitude: wx.getStorageSync('store')[0].latitude,
        longitude: wx.getStorageSync('store')[0].longitude,
        width: 30,
        height: 30,
        callout: {
          content: `【${wx.getStorageSync('store')[0].city + wx.getStorageSync('store')[0].town}】\n${wx.getStorageSync('store')[0].addressDetail}\n咨询热线：${wx.getStorageSync('store')[0].contact}`,
          color: "#2c8df6",
          fontSize: 10,
          borderRadius: 5,
          bgColor: "#fff",
          display: "ALWAYS",
          boxShadow: "2px 2px 10px #aaa",
          padding: 5
        },
        label: {
          color: "#000",
          fontSize: 12,
          content: `距您${wx.getStorageSync('store')[0].distance}km`,
          color: "#2c8df6",
          borderRadius: 5,
          bgColor: "#fff",
          boxShadow: "2px 2px 10px #aaa",
          padding: 5
        }
      }
    ]
    _this.setData({
      markers: data,
      storeList: wx.getStorageSync('store')
    })
    console.log(_this.data.markers)
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
   * 地图视图改变触发时间
   */
  regionchange(e) {
    console.log(e.type)
  },
  
  /**
   * 地图坐标点点击事件
   */
  markertap(e) {
    console.log(e.markerId)
  },

  /**
   * 控件点击触发时间
   */
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 选择门店
   */
  selectStore:function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var data = [
      {
        iconPath: '/imgs/logo.png',
        id: 0,
        latitude: wx.getStorageSync('store')[index].latitude,
        longitude: wx.getStorageSync('store')[index].longitude,
        width: 30,
        height: 30,
        callout: {
          content: `【${wx.getStorageSync('store')[index].city + wx.getStorageSync('store')[index].town}】\n${wx.getStorageSync('store')[index].addressDetail}\n咨询热线：${wx.getStorageSync('store')[index].contact}`,
          color: "#2c8df6",
          fontSize: 10,
          borderRadius: 5,
          bgColor: "#fff",
          display: "ALWAYS",
          boxShadow: "2px 2px 10px #aaa",
          padding: 5
        },
        label: {
          color: "#000",
          fontSize: 12,
          content: `距您${wx.getStorageSync('store')[index].distance}km`,
          color: "#2c8df6",
          borderRadius: 5,
          bgColor: "#fff",
          boxShadow: "2px 2px 10px #aaa",
          padding: 5
        }
      }
    ]
    _this.setData({
      markers: data,
      latitude: wx.getStorageSync('store')[index].latitude,
      longitude: wx.getStorageSync('store')[index].longitude,
      tab: index
    })
    wx.setStorageSync('storeIndex', wx.getStorageSync('store')[index]);
    wx.navigateBack({
      delta: 1,
    })
  }
})