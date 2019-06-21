// pages/order/orderRefund.js
const app = getApp();
import Api from '../../utils/api';
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    orderList: [],
    size: 10,
    page: 1,
    text: "", //内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      page: 1,
      orderList: [],
      isShow: false, 
    });
    _this.getData()
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
    _this.setData({
      page: 1,
    })
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
    let _this = this;
    if (_this.data.page < _this.data.orderList.totalPages){
      _this.setData({
        page: _this.data.page+1,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取退款数据
  getData(){
    let _this = this;
    Api.seeRefund(_this.data.page,_this.data.size).then( res => {
      console.log(res)
      if(res.code == 2000){
        for (let i = 0; i < res.data.dataList.length; i++) {
          res.data.dataList[i].createDate = util.formatDate(res.data.dataList[i].createDate)
        }
        _this.setData({
          orderList: _this.data.orderList.concat(res.data.dataList),
        })
      }
    })
  },
  //退款原因
  refundClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      text: _this.data.orderList[index].refundReason,
      isShow: true,
    })
  },
  //退款失败的原因
  failClick(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      text: _this.data.orderList[index].rejectReason,
      isShow: true,
    })
  },
  //确认按钮
  confirmPopupClick(e){
    let _this = this;
    _this.setData({
      isShow: false,
    })
  }


})