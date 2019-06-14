// pages/collection/collection.js

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
    productList: [], //列表
    totalPages: null, //页面总页数
    isHide: false,// 判断页面有无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
    var _this = this;

    // 切换模块刷新页码
    page = 1;

    _this.setData({
      productList:[]
    })

    _this.queryCollectionList();
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
    console.log('======触底加载')
    if (page >= 1 && page <= _this.data.totalPage) {
      console.log('======开始加载')
      page++;

      wx.showLoading({
        title: '加载中...',
      })

      setTimeout(function () {
        _this.queryCollectionList();
        wx.hideLoading()
        console.log('======加载结束。')
      }, 1500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 加入购物车
   */
  // addCart: function () {
  //   wx.showLoading({
  //     title: '加载中！',
  //   })
  //   var _this = this;
  //   let navbar = this.navbar;
  //   app.addCart(1).then((res) => {
  //     // navbar.cartNumUp();
  //     console.log(res);
  //     console.log(app.globalData.shoppingData)
  //     wx.hideLoading();
  //   })
  // },
  /**
   * 增加购物车
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
    app.addCart(data).then((res) => {
      //_this.priceCount();
      console.log(res);
      _this.setData({
        cartList: res
      })
      wx.hideLoading();
    })
  },


  //显示收藏列表
  queryCollectionList: function () {
    var _this = this;
    var _data = {
      "goodsName": "",
      "sort": "desc"
    }

    Api.showCollectionList(page, size, _data).then(res => {
      console.log("======后台返的值=======")
      console.log(res);
      console.log("=======END======")

      if(res.data.dataList.length > 0){
        _this.setData({
          productList: _this.data.productList.concat(res.data.dataList),
          totalPage: res.data.totalPages,
          isHide: true
        })
      }else{
        _this.setData({
          isHide: false
        })
      }
    })
  },

  //取消收藏，删除收藏
  delCollection: function (e) {
    var _this = this;
    console.log('=======取消收藏')

    wx.showModal({
      content: '您确定取消收藏么？',
      success(res) {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.id)
          console.log('用户点击确定')

          Api.delCollention(e.currentTarget.dataset.id).then(res => {
            console.log(res);

            wx.showLoading({
              title: '正在移除收藏..',
            })

            setTimeout(function () {
              _this.setData({
                productList: [],
                totalPages: null
              })
              _this.queryCollectionList();
              wx.hideLoading()
            }, 1500)
          })

        }
      }
    })
  },

  //商品详情
  toDetails:function(e){
    var _this=this;
    var _spid = e.currentTarget.dataset.id;
    console.log(_spid)
    wx.navigateTo({
      url: '/pages/product/product?id='+_spid+'&flag='+0,
    });
  },

})