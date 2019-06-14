const util = require('../../utils/util.js');

var app  = getApp();

//引入页面api1
import Api from '../../utils/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,// 用户导航栏高度
    logShow: false,
    isHide: false,// 控制数据为空时内容显示隐藏
    currentTab: 0,
    currentItem: '',// 当前分类
    inputSearch: false,// 输入款搜索查询
    inputValue: null,// input输入框值
    sortList: [], // 分类列表
    productList: [],// 分类商品列表
    productLists: [],// 输入框查询结果列表
    _formIndexByQuery:false,//首页查询标识
    _formIndexContent:'',//从首页过来的查询内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var _this = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    console.log(app.globalData.sortCurrent)
    _this.setData({
      navH: app.globalData.navHeight,
      currentTab: app.globalData.sortCurrent
    });
    // 购物车商品数量展示
    wx.setTabBarBadge({
      index: 2,
      text: "" + app.globalData.shoppingData + "", //可改 
    });
    _this.formIndexByQuery();
    if(_this.data._formIndexByQuery == false){
      _this.loadAllCategory();
    }
    
    
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
   * 加载所有分类类目信息
   */
  loadAllCategory:function(){
    var _this = this;
    Api.loadAllCategory().then(res => {
      console.log(res);
      _this.setData({
        sortList: res.data
      })
      var data = {
        "categoryId": _this.data.sortList[app.globalData.sortCurrent].id,
        "title": '',
        "isDel": false,
        "sort": "desc"
      }
      console.log(data)
      _this.loadCategory(data);
    })
  },

  /**
   * 加载对应分类的分类信息
   */
  loadCategory:function(data){
    var _this = this;
    console.log(data);
    Api.loadCategory(data,1,2).then(res => {
      console.log(res);
      if(_this.data.inputSearch){
        _this.setData({
          productLists: [],
          productLists: res.data.dataList
        })
      }else{
        if (res.data.dataList.length > 0){
          _this.setData({
            productList: [],
            productList: res.data.dataList,
            isHide: false
          })
        }else{
          _this.setData({
            isHide: true
          })
        }
      }
    })
  },

  /**
   * 输入框查询商品列表
   */
  inputSearch:function(){
    var _this = this;
    if(_this.data.inputValue == null){
      wx.showToast({
        title: '请输入您要查询的条件！',
        icon: 'none'
      })
      return;
    }else{
      _this.setData({
        inputSearch: true
      })
      var data = {
        "categoryId": '',
        "title": _this.data.inputValue,
        "isDel": false,
        "sort": "desc"
      }
      _this.loadCategory(data);
    }
  },

  /**
   * 清除输入框查询数据
   */
  clearproductLists:function(){
    var _this = this;
    _this.setData({
      productLists: [],
      inputSearch: false,
      inputValue: null,
      _formIndexByQuery:false
    })
    app.globalData.queryData = null
  },

  /**
   * 分类标签切换
   */
  swicthing:function(e){
    var _this = this;
    var num = e.currentTarget.dataset.num;
    app.globalData.sortCurrent = num;
    _this.setData({
      currentTab: num,
      currentItem: _this.data.sortList[num].title
    })
    var data = {
      "categoryId": _this.data.sortList[num].id,
      "title": '',
      "isDel": false,
      "sort": "desc"
    }
    console.log(_this.data.currentItem,data);
    _this.loadCategory(data);
  },
  /**
   * 加入购物车
   */
  addCart: function (e) {
    wx.showLoading({
      title: '加载中！',
    })
    var _this = this;
    var data = {
      goodsId: e.currentTarget.dataset.id,
      num: 1
    };
    console.log(e.currentTarget.dataset.id, data);
    app.addCart(data).then((res) => {
      // navbar.cartNumUp();
      console.log(res);
      console.log(app.globalData.shoppingData)
      wx.hideLoading();
    })
  },

  /**
   * 获取输入框值
   */
  getInputValue:function(e){
    console.log("实时打印",e.detail.value);
    var _this = this;
    _this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 查看商品详情
   */
  toProductInt:function(e){
    var _this = this;
    wx.navigateTo({
      url: '/pages/product/product?id=' + e.currentTarget.dataset.id + '&flag=' + 0,
    })
  },

  //咱是从首页查询过来的
  formIndexByQuery:function(){
    var _this = this;
    console.log(app.globalData.queryData)
    if(app.globalData.queryData != undefined){
      _this.setData({
        _formIndexContent:app.globalData.queryData.queryContent,
        _formIndexByQuery:true,
        inputSearch:true
      })
    }
    var _data ={
      "categoryId": '',
      "title": _this.data._formIndexContent,
      "isDel": false,
      "sort": "desc"
    }

    _this.loadCategory(_data);
  }
})