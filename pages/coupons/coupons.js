// pages/coupons/coupons.js

var app = getApp();
const util = require('../../utils/util.js');
import Api from '../../utils/api';

var page = 1; //当前页码
var size = 10; //一页多少条

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    // navHs: null, // 页面内容可用高度
    // currentArry: [{
    //   text: "会员专区"
    // }, {
    //   text: "所有用户"
    // }, {
    //   text: "指定商品"
    // }], 

    // currentTab: 0, // 标签对应块标识
    sortList: [{
      title: '会员专区'
    }, {
      title: '所有用户'
    }],
    currentArry: [{
      title: '全场通用'
    }, {
      title: '指定商品'
    }],
    couponsList: [],
    currentTab: 0, //左侧分类
    currentTabR: 0, //右侧顶部tab
    totalPage: null // 页面数据的总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight + 60
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    _this.showList();
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
    if (page >= 1 && page <= _this.data.totalPage) {
      page++;
      _this.showList();

      wx.showLoading({
        title: '加载中...',
      })

      setTimeout(function () {
        wx.hideLoading()
      }, 1500)
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
  // navtap: function (e) {
  //   var _this = this;
  //   page = 1;
  //   _this.setData({
  //     currentTab: e.currentTarget.dataset.num,
  //     couponsList: []
  //   })
  //   console.log("当前所在tabC：" + e.currentTarget.dataset.num)

  //   _this.showList();
  //   console.log("======点击tab后加载的数据（page-data）=======")
  //   console.log(this.data.couponsList)
  //   console.log("=============")
  // },

  /**
   * 领取优惠券
   */
  editor: function (e) {
    var _this = this;
    // if (_this.data.couponsSpecific[e.currentTarget.dataset.index].editor) {
    //   _this.data.couponsSpecific[e.currentTarget.dataset.index].editor = false;
    //   _this.setData({
    //     couponsSpecific: _this.data.couponsSpecific
    //   })
    // } else {
    //   _this.data.couponsSpecific[e.currentTarget.dataset.index].editor = true;
    //   _this.setData({
    //     couponsSpecific: _this.data.couponsSpecific
    //   })
    // }
    console.log("==领取优惠券")
    console.log("优惠券id："+e.currentTarget.dataset.id);
    Api.getCoupon(e.currentTarget.dataset.id).then(res=>{
      console.log(res);
      wx.showToast({
        title: '已成功领取优惠券',
        icon: 'none',
      });
      setTimeout(() => {
        wx.hideLoading()
      }, 1500);
    })
  },

  /**
   * 展示列表
   */
  showList: function () {
    var _this = this;
    var _data = {
      "goodsLimit": "",
      "userTypeLimit": "",
      "couponType": ""
    };
    if (_this.data.currentTab == 0 && _this.data.currentTabR == 0) {
      console.log("===========会员+通用")
      _data.goodsLimit = "ALL"
      _data.userTypeLimit = "MEMBER"
    } else if (_this.data.currentTab == 0 && _this.data.currentTabR == 1) {
      console.log("===========会员+指定")
      _data.goodsLimit = "SINGLETON"
      _data.userTypeLimit = "MEMBER"
    } else if (_this.data.currentTab == 1 && _this.data.currentTabR == 0) {
      console.log("===========所有用户+通用")
      _data.goodsLimit = "ALL"
      _data.userTypeLimit = "ALL"
    } else if (_this.data.currentTab == 1 && _this.data.currentTabR == 1) {
      console.log("===========所有用户+指定")
      _data.goodsLimit = "SINGLETON"
      _data.userTypeLimit = "ALL"
    }

    // 调取数据
    Api.couponList(page, size, _data).then(res => {
      console.log("======后台返的数据=======")
      console.log(res.data)
      console.log("=============")


      //转换时间戳
      for (let ii = 0; ii < res.data.dataList.length; ii++) {
        res.data.dataList[ii].startDate = util.formatDate(res.data.dataList[ii].startDate)
        res.data.dataList[ii].endDate = util.formatDate(res.data.dataList[ii].endDate)
        res.data.dataList[ii].duration = util.formatDuring(res.data.dataList[ii].duration)
        // console.log(res.data.dataList[ii]);
      }

      _this.setData({
        couponsList: _this.data.couponsList.concat(res.data.dataList),
        totalPage: res.data.totalPages,
      })
      console.log(_this.data.couponsList);
    })
  },

  // 左侧列表分类
  sortListTap: function (e) {
    var _this = this;
    console.log("===点击了左侧分类")
    var num = e.currentTarget.dataset.num;
    console.log(num)
    _this.setData({
      currentTab: num,
      currentTabR: 0,
      couponsList : []
    })
    // 页面参数初始化
    page = 1
    _this.showList();
    console.log(this.data.currentTab)
  },

  navTap: function (e) {
    var _this = this;
    console.log("点击了右侧tab")
    var num = e.currentTarget.dataset.num;
    console.log(num)
    _this.setData({
      currentTabR: num,
      couponsList : []
    })
    // 页面参数初始化
    page = 1;
    _this.showList();
  },
})