// pages/goods/goods.js

var app = getApp();

// var util = require("../../utils/util.js");

//引入页面api
import Api from '../../utils/api';

var page = 1;
var size = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,// 手机导航栏高度
    navTitName: null,// 标题栏名称
    loadFlag: null,// 加载标识
    totalPage: null,// 当前页面数据总页数
    isHide: false,// 控制内容显示隐藏
    productList: [{
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '29.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '26.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '26.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '29.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '26.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '26.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '29.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '26.90'
    }, {
      img: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/sort/%E5%9B%BE%E5%B1%82%2026%402x.png',
      tit: '豆浆粉冲调饮品营养早餐',
      price: '26.90'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight
    });
    if (options.flag != undefined) {
      switch(options.flag){
        // 热销商品
        case '0':
          _this.setData({
            navTitName: '热销商品',
            loadFlag: 'product',
          })
          break;
        // 限时拼团
        case '1':
          _this.setData({
            navTitName: '拼团商品',
            loadFlag: 'spell',
          })
          _this.loadSpellOrLimitList('GROUP');
          break;
        // 限时秒杀
        case '2':
          _this.setData({
            navTitName: '秒杀商品',
            loadFlag: 'limit',
          })
          _this.loadSpellOrLimitList('LIMITED_TIME');
          break;
        // 会员热卖
        case '3':
          _this.setData({
            navTitName: '会员商品',
            loadFlag: 'members',
          })
          break;
        default:
          console.log(typeof (options.flag))
          wx.showToast({
            title: '未匹配到对应数据',
            icon: 'none',
          })
      }
    }
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
    var _this = this;
    switch (_this.data.loadFlag) {
      case 'members':
      case 'product':
        if (page >= 1 && page <= _this.data.totalPage) {
          page++;
          _this.loadswapList();
        }
        break;
      case 'spell':
        if (page >= 1 && page <= _this.data.totalPage) {
          page++;
          _this.loadRecord();
        }
        break;
      case 'limit':
        if (page >= 1 && page <= _this.data.totalPage) {
          page++;
          _this.loadRecord();
        }
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 查看详情
   */
  toviews:function(e){
    var _this = this;
    console.log('商品id', e.currentTarget.dataset.id)
    switch(_this.data.loadFlag){
      case 'spell':
        _this.tospell(e.currentTarget.dataset.id);
        break;
      case 'limit':
        _this.tolimit(e.currentTarget.dataset.id);
        break;
      case 'product':
        _this.nav(e.currentTarget.dataset.id);
        break;
      case 'members':
        _this.tomembers(e.currentTarget.dataset.id);
      default:
        wx.showToast({
          title: '未匹配到对应数据！',
          icon: 'none',
        })
    }
  },

  /**
   * 跳转商品
   */
  nav: function (id) {
    var _this = this;
    wx.navigateTo({
      url: '/pages/product/product?flag=' + '0' + '&id=' + id,
    })
  },

  /**
   * 前往秒杀
   */
  tolimit: function (id) {
    var _this = this;
    wx.navigateTo({
      url: '/pages/product/product?flag=' + '2' + '&id=' + id,
    })
  },

  /**
   * 前往拼团
   */
  tospell: function (id) {
    var _this = this;
    wx.navigateTo({
      url: '/pages/product/product?flag=' + '1' + '&id=' + id,
    })
  },

  /**
   * 前往会员热卖
   */
  tomembers:function(id){
    var _this = this;
    wx.navigateTo({
      url: '/pages/product/product?flag=' + '3' + '&id=' + id,
    })
  },

  /**
   * 
   */
  loadSpellOrLimitList: function(type){
    var _this = this;
    var data = {
      page: page,
      size: size,
      type: type
    }
    Api.loadSpellOrLimitList(data).then(res => {
      console.log(res);
      // for (let i = 0; i < res.data.dataList.length; i++) {
      //   res.data.dataList[i].createDate = util.formatDate(res.data.dataList[i].createDate);
      // }
      if(res.data.dataList.length > 0){
        _this.setData({
          productList: res.data.dataList,
          totalPage: res.data.totalPages,
          isHide: false
        })
      }else{
        _this.setData({
          isHide: true
        })
      }
    })
  },
})