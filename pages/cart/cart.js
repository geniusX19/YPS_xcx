
var app = getApp();

import Api from '../../utils/api';// 引入页面请求api

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    isHide: false,// 控制购物车为空时内容显示隐藏
    totalMoney: 0,// 购物车商品总价
    allSelect: false,// 全选标识
    select: false,// 选中标识
    cartList:[],// 购物车数据列表
  },

  settlementClick(){
    let _this = this;
   // console.log(_this.data.cartList[0].select)
    let cartItemDtoList = []; //选中的购物车列表
    let cartList = _this.data.cartList;
    for (let i = 0; i < cartList.length; i++) {
      if (cartList[i].select){
        cartItemDtoList.push(cartList[i]);
      }
    }
    //console.log(cartItemDtoList)
    if (cartItemDtoList.length < 1){ //没有选择商品
      return false
    }
    wx.setStorageSync('cartItemDtoList', cartItemDtoList)
    wx.navigateTo({
      url: '/pages/ordering/ordering',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight
    });
    for(let i = 0; i <_this.data.cartList.length; i ++){
      _this.data.cartList[i].select = false;
    }
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
    _this.setData({
      cartList: [],
      allSelect: false,
      totalMoney: 0,
    })
    _this.loadCart();
    // 购物车商品数量展示
    // wx.setTabBarBadge({
    //   index: 2,
    //   text: "" + app.globalData.shoppingData + "", //可改 
    // });
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
   * 加载购物车数据
   */
  loadCart:function(){
    var _this = this;
    Api.searchCart().then(res => {
      console.log(res);
      if(res.data.length == 0){
        _this.setData({
          isHide: true,
          cartList: [],
        })
      }else{
        _this.setData({
          cartList: res.data,
          isHide: false
        })
      }
      app.globalData.shoppingData = res.data.length;
      wx.setTabBarBadge({
        index: 2,
        text: "" + app.globalData.shoppingData + "", //可改 
      });
    })
  },

  /**
   * 选中事件
   */
  choose:function(e){
    var _this = this;
    _this.setData({
      select: true
    });
    if (_this.data.cartList[e.currentTarget.dataset.index].select) {
      _this.data.cartList[e.currentTarget.dataset.index].select = false;
      _this.data.totalMoney = 0;
      _this.setData({
        cartList: _this.data.cartList
      })
    } else {
      _this.data.cartList[e.currentTarget.dataset.index].select = true;
      _this.setData({
        cartList: _this.data.cartList
      })
    }
    _this.isSelectAll();
    _this.priceCount();
  },

  /**
   * 全选时间
   */
  allSelect:function(){
    var _this = this;
    if(_this.data.allSelect){
      console.log("没有走");
      _this.setData({
        allSelect: false,
        select: true,
        totalMoney: 0.00
      })
      for (let i = 0; i < _this.data.cartList.length; i++) {
        _this.data.cartList[i].select = false;
        _this.setData({
          cartList: _this.data.cartList
        })
      }
    }else{
      console.log("我在走");
      _this.setData({
        allSelect: true,
        select: true
      })
      for (let i = 0; i < _this.data.cartList.length; i++) {
        if (_this.data.cartList[i].select){
          break;
        }else{
          _this.data.cartList[i].select = true;
          _this.data.totalMoney = _this.data.totalMoney + (_this.data.cartList[i].num * _this.data.cartList[i].price);
          _this.setData({
            totalMoney: _this.data.totalMoney,
            cartList: _this.data.cartList
          })
        }
       // console.log(_this.data.cartList)
      }
    }
  },

  /**
   * 是否全选
   * 
   */

  isSelectAll(){
    let _this = this;
    let isSelect = _this.data.cartList.find(function (item, index) {
      return item.select == undefined || item.select == false;
    })
    console.log(isSelect)
    if (isSelect == undefined) {
      _this.setData({
        allSelect: true,
      })
    } else {
      _this.setData({
        allSelect: false,
      })
    }
  },

  /**
   * 增加购物车
   */
  addCartNum: function (e) {
    
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let cartList = _this.data.cartList;
    var data = {
      goodsId: e.currentTarget.dataset.id,
      num: 1
    };
    Api.addCart(data).then((res) => {
      cartList[index].num = cartList[index].num + 1;
      cartList[index].totalPrice = cartList[index].num * cartList[index].price;
      _this.setData({
        cartList: cartList,
      })
      //计算总价
      _this.priceCount();
    })
  },
  /**
   * 减少购物车
   */
  deleteCartNum: function (e) {
    // wx.showLoading({
    //   title: '加载中！',
    // })
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let cartList = _this.data.cartList;
    console.log(cartList[index].num)
    if (cartList[index].num <= 1){
      cartList[index].num = 1;
      _this.setData({
        cartList: cartList,
      })
    }else{
      var data = {
        goodsId: e.currentTarget.dataset.id,
        num: -1,
      };
      //修改数据
      Api.addCart(data).then((res) => {
        console.log(res)
        cartList[index].num = cartList[index].num - 1;
        cartList[index].totalPrice = cartList[index].num * cartList[index].price;
        _this.setData({
          cartList: cartList,
        })
        //计算总价
        _this.priceCount();
      })
    }
  },

  /**
   * 计算总价
   */
  priceCount:function(){
    let totalMoney = 0;
    console.log(this.data.cartList)
    for (var i = 0; i < this.data.cartList.length; i++) {
      if (this.data.cartList[i].select) {
        totalMoney += this.data.cartList[i].totalPrice;
        this.setData({
          totalMoney: totalMoney,
        })
      }
    }
    console.log(this.data.totalMoney)
  },

  /**
   * 删除购物车
   */
  deleteCart:function(e){
    var _this = this;
    var ids = [e.currentTarget.dataset.id];
    var index = e.currentTarget.dataset.index;
    Api.delectCart({ids:ids.join(',')}).then(res => {
      console.log(res);
      if (res.code == 2000){
        let cartList = _this.data.cartList;
        cartList.splice(index,1)
        _this.setData({
          cartList: cartList,
        })
        app.globalData.shoppingData = cartList.length;
        wx.setTabBarBadge({
          index: 2,
          text: "" + app.globalData.shoppingData + "", //可改 
        });
      }
    })
  },

  /**
   * 去首页逛逛
   */
  toindex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})