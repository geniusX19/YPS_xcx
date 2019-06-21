
const app = getApp();
import Api from '../../utils/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,// 用户手机导航高度
    userInfo: {},// 用户信息
    AccountInfo:{},//賬戶信息
    couponNum:0,//优惠券数量
    isVip: false, //是否是会员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      userInfo: app.globalData.userInfo
    })
    console.log(_this.data.userInfo)
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
    var _this = this;
    // 购物车商品数量展示
    wx.setTabBarBadge({
      index: 2,
      text: "" + app.globalData.shoppingData + "", //可改 
    });

    _this.queryAccountInfo();
    _this.queryCouponNum();
    _this.isGetVip();
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

  },

  /**
   * 前往订单页
   */
  toOrder:function(e){
    var _this =this;
    console.log(typeof (e.currentTarget.dataset.index))
    switch (e.currentTarget.dataset.index){
      case "0":
        wx.navigateTo({
          url: '/pages/order/order?current=0',
        })
        break;
      case "1": //拼团中
        wx.navigateTo({
          url: '/pages/order/order?current=2',
        })
        break;
      case "2": //待付款
        wx.navigateTo({
          url: '/pages/order/order?current=1',
        })
        break;
      case "3": //已付款
        wx.navigateTo({
          url: '/pages/order/order?current=3',
        })
        break;
      case "4": //待收货
        wx.navigateTo({
          url: '/pages/order/order?current=4',
        })
        break;
      default:
        wx.showToast({
          title: '未匹配到对应的标识！',
          icon: 'none',
        }) 
    }
  },

  /**
   * 领取优惠券
   */
  toCoupons:function(){
    var _this = this;
    wx.navigateTo({
      url: '/pages/coupons/coupons',
    })
  },

  /**
   * 前往我的优惠券
   */
  toMycoupons:function(){
    var _this = this;
    wx.navigateTo({
      url: '/pages/mycoupons/mycoupons',
    })
  },

  /**
   * 前往地址管理
   */
  toAddresses:function(){
    var _this = this;
    wx.navigateTo({
      url: '/pages/addresses/addresses',
    })
  },

  /**
   * 前往追溯查询
   */
  toSearchQuery: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/searchQuery/searchQuery',
    })
  },

  /**
   * 前往我的收藏
   */
  toCollection: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/collection/collection',
    })
  },

  /**
   * 前往充值
   */
  torecharge: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },

  testPay: function() {
    console.log('sss');
    wx.request({
      url: 'https://peter.xiaomiqiu.com/api/member/finance/create/recharge',
      data: {
        "amount": 0.1,
        "payType": "WX"
      },
      header: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMTI4ODg3NzQyOTEwOTU5NjE2Iiwic3ViIjoi6LaF57qn566h55CG5ZGYIiwiaWF0IjoxNTU3OTg1MzI0LCJyb2xlcyI6IltcIm1lbWJlclwiXSIsImhlYWRQaWMiOiJodHRwczovL3Rlc3RfcGljLnBuZyIsImlzV3hVc2VyIjp0cnVlfQ.JIq8KCvIOcNetQ_WZySLxPUM9-Yt0bu0SCeVrMgU228'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        if(res.data.flag){
          var payString = res.data.data.bill.payString;
          var payParams = JSON.parse(payString);
          console.log(payParams);
          wx.requestPayment({
            timeStamp: payParams.timeStamp,
            nonceStr: payParams.nonceStr,
            package: payParams.package,
            signType: payParams.signType,
            paySign: payParams.paySign,
            success: function(res) {
              console.log('正确',res);
            },
            fail: function(res) {
              console.log('出错了', res);
            },
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
      },
    })
  },

  /*
  * 查詢賬戶信息
  */
  queryAccountInfo:function(){
    var _this = this;
    Api.queryAccountInfo().then(res=>{
      console.log("========查詢用戶信息==========")
      console.log(res)
      console.log("========查詢用戶信息END==========")
      _this.setData({
        AccountInfo:res.data
      })
    })
  },

  //查询优惠券数量
  queryCouponNum:function(){
    var _this = this;
    Api.couponNum().then(res=>{
      console.log("========查詢优惠券数量=========")
      console.log(res)
      console.log("========查詢优惠券数量END=========")
      _this.setData({
        couponNum:res.data
      })
    })
  },

  isGetVip: function(){
    let _this = this;
    Api.isVip().then(res => {
      console.log(res)
      if(res.code == 2000){
        _this.setData({
          isVip: res.data,
        })
      }
    })
  }
  
})