// pages/pointsfor/pointsfor.js

let app = getApp();

var util = require("../../utils/util.js");

//引入页面api
import Api from '../../utils/api';

var page = 1;
var size = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,// 用户手机导航高度
    currentArry: [{
      text: "兑换商品"
    }, {
      text: "兑换现金券"
    }, {
      text: "兑换记录"
    }], // 标签内容
    currentTab: 0, // 标签对应块标识
    showDialog: false,// 弹框展示标识
    totalPage: null,// 当前页数据总页数
    productList: [],// 商品列表
    cashCoupons: [],// 现金券列表
    exchangeRecord: [],// 兑换记录
    product: {},// 单条商品信息
    productCarousel: [],// 单条商品图片轮播信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,// 获取顶部导航栏高度
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    _this.loadswapList();
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
    var _this = this;
    switch(_this.data.currentTab){
      case 0:
      case 1:
        if (page >= 1 && page <= _this.data.totalPage) {
          page++;
          _this.loadswapList();
        }
        break;
      case 2:
        if (page >= 1 && page <= _this.data.totalPage) {
          page++;
          _this.loadRecord();
        }
    }
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
      currentTab: e.currentTarget.dataset.num,
      totalPage: null,
    })
    // 切换标签页时刷新页码
    page = 1; 
    switch (_this.data.currentTab){
      case 0:
      case 1:
        console.log("执行0，1")
        _this.loadswapList();
        break;
      case 2:
        console.log("执行2")
        _this.loadRecord();
        break;
      default:
        wx.showToast({
          title: '为匹配到对应数据',
          icon: 'none'
        })
    }
  },

  /**
   * 加载可换购列表
   */
  loadswapList:function(){
    var _this = this;
    var data = {
      "swapType": _this.data.currentTab == 0 ? 'GOODS' :'COUPON',
      "sort": "desc",
      "delFlag": false
    }
    Api.loadSwapList(page,size,data).then(res => {
      switch(_this.data.currentTab){
        case 0:
          _this.setData({
            productList: res.data.dataList,
            totalPage:res.data.totalPages
          })
          console.log(_this.data.productList);
          break;
        case 1:
          _this.setData({
            cashCoupons: res.data.dataList,
            totalPage: res.data.totalPages
          })
          console.log(res.data.dataList);
          break;
        default:
          wx.showToast({
            title: '为匹配到对应数据',
            icon: 'none'
          })
      }
    })
  },

  /**
   * 加载兑换记录
   */
  loadRecord:function(){
    var _this = this;
    Api.loadRecord(page,size).then(res => {
      for (let i = 0; i < res.data.dataList.length; i ++){
        res.data.dataList[i].createDate = util.formatDate(res.data.dataList[i].createDate,'');
      }
      console.log(res.data.dataList);
      _this.setData({
        exchangeRecord: res.data.dataList,
        totalPage: res.data.totalPages
      })
      console.log(_this.data.exchangeRecord);
    })
  },

  /**
   * 执行兑换
   */
  performExchange:function(e){
    var _this =this;
    Api.performExchange(e.currentTarget.dataset.id).then(res => {
      console.log(res);
      wx.showToast({
        title: '兑换成功！',
        icon: 'none',
      })
    })
  },

  /**
  * 控制 pop 的打开关闭
  * 该方法作用有2:
  * 1：点击弹窗以外的位置可消失弹窗
  * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
  */
  toggleDialog:function(e) {
    var _this = this;
    if (this.data.showDialog){
      console.log(_this.data.productCarousel)
      this.setData({
        showDialog: !this.data.showDialog
      });
    }else{
      Api.loadProductInt(e.currentTarget.dataset.id).then(res => {
        console.log(res);
        _this.setData({
          product: res.data,
          productCarousel: JSON.parse(res.data.image)
        })
      })
      console.log(_this.data.productCarousel)
      this.setData({
        showDialog: !this.data.showDialog
      });
    }
  },
})