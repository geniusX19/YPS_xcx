// pages/mycoupons/mycoupons.js

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
    navHs: null, // 页面内容可用高度
    currentArry: [{
      text: "可使用优惠券"
    }, {
      text: "已使用优惠券"
    }, {
      text: "已过期优惠券"
    }], // 标签内容
    currentTab: 0, // 标签对应块标识
    CouponList:[],
    totalPage: null,// 页面数据总页数
    id: '',
    couponId: '',
    limt: '', //详情页进入的优惠卷
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight + 60,
    });
    if(options.limt != undefined){
      _this.setData({
        limt: options.limt
      })
    }
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
    _this.showList();
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
    var that = this
   
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
    var _this = this;
    if(page >= 1 && page <= _this.data.totalPage){
      page++;

      wx.showLoading({
        title: '加载中...',
      })
      
      setTimeout(function () {
        _this.showList();
        wx.hideLoading()
      }, 1500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 点击切换标签
   */
  navtap: function(e) {
    var _this = this;
    // 切换模块刷新页码
    page = 1;
    _this.setData({
      currentTab: e.currentTarget.dataset.num,
      CouponList: []
    })
    console.log(e.currentTarget.dataset.num);

    wx.showLoading({
      title: '加载中...',
    })
    
    setTimeout(function () {
      _this.showList();
      wx.hideLoading()
    }, 1500)


    console.log("======点击tab后加载的数据（page-data）=======")
    console.log(this.data.CouponList)
    console.log("======点击tab后加载的数据（page-data）END=======")
  },


  /*
   * 展示优惠券列表
   */
  showList: function() {
    var _this = this;
    var _data = {
      "id": "",
      "name": "",
      "couponType": "",
      "status": "",
      "sort": "desc"
    }

    // 区分当前展示 优惠券分类 0可用 1已使用 2已过期
    if (this.data.currentTab == 0) {
      console.log("========0可用")
      _data.status = "CANUSE";
    } else if (this.data.currentTab == 1) {
      console.log("========1已使用")
      _data.status = "USED";
    } else if (this.data.currentTab == 2) {
      console.log("========2已过期")
      _data.status = "ISEXPIRE";
    }

    Api.myCouponList(page, size, _data).then(res => {
      console.log("======后台返的数据=======")
      console.log(res.data)
      // console.log(res.data.dataList[0])
      // console.log(res.data.dataList)
      console.log("======后台返的数据END=======")

      
      //转换时间戳
      for(let ii =0;ii<res.data.dataList.length;ii++){
        res.data.dataList[ii].drawDate = util.formatDate(res.data.dataList[ii].drawDate)
        res.data.dataList[ii].startDate = util.formatDate(res.data.dataList[ii].startDate)
        res.data.dataList[ii].endTime = util.formatDate(res.data.dataList[ii].endTime)
        // res.data.dataList[ii].duration = util.formatDuring(res.data.dataList[ii].duration)
        // console.log(res.data.dataList[ii]);
      }

      this.setData({
        CouponList: _this.data.CouponList.concat(res.data.dataList),
        totalPage: res.data.totalPages,
      })
    })
  },

  /**
   * 使用优惠券
   */
  useCoupons:function(e){
    console.log("====================")
    console.log("使用优惠券")
    console.log(e);
    let _this = this;
    var _thisGoodLimit = e.currentTarget.dataset.goodsLimit;
    //var _thisgoodsId = e.currentTarget.dataset.goodsId;
    var id = e.currentTarget.dataset.id;

   _this.setData({
     id: id,
   })
   
    if (_this.data.limt == 'ordering') {
      console.log(_this.data.limt)
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面

      prevPage.setData({
        couponId: id
      });
      wx.navigateBack({});
      return;
    }

    if(_thisGoodLimit == "ALL"){
      console.log("走的：ALL")
      wx.switchTab({
        url: '/pages/sort/sort',
      });
    }else if(_thisGoodLimit == "SINGLETON"){
      console.log("走的：SINGLETON")
      console.log(id);
      wx.navigateTo({
        url: '/pages/product/product?id=' + id,
      });
    }
  }
})