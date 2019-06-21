//index.js
//获取应用实例
const app = getApp();

const util = require('../../utils/util.js');

var coordinate = require('../../utils/coordinate.js');

//引入页面api
import Api from '../../utils/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 当前手机导航栏高度
    chooseShop: false, // 选择门店
    store: null, // 默认门店
    storeList: [], // 门店列表
    carousels: [], // 首页轮播
    categoryList: [], // 分类列表
    page: 1, //分页
    size: 10, //展示数量  
    totalPages: 0, //总分页
    productList: [], //商品列表
    queryContent: {},
    getQuery: null, //首页搜索值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    //_this.checkLogin();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    // 购物车商品数量展示(用于更新购物车数量展示图标)
    wx.setTabBarBadge({
      index: 2,
      text: "" + app.globalData.shoppingData + "", //可改 
    });
    _this.setData({
      page: 1,
      productList: [],
    })
    console.log(typeof (wx.getStorageSync('storeIndex')))
    if (wx.getStorageSync('storeIndex') != '') {
      console.log('FUCK!')
      _this.setData({
        store: wx.getStorageSync('storeIndex').addressDetail
      })
    }
    wx.checkSession({
      success: function (res) {
        // console.log("未过期");
        _this.loadCarousel(); // 加载首页轮播数据
        _this.loadData(); // 加载首页商品数据
        _this.loadCategory(); // 加载分类
        _this.loadShopaddress(); // 加载商户门店
      },
      fail: function (res) {
        console.log("index.js-onLoad-需要登录");
        wx.navigateTo({
          url: '/pages/logs/logs',
        });
        return;
      }
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
    if(_this.data.page < _this.data.totalPages){
        _this.setData({
          page: _this.data.page + 1,
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 检验登陆状态
   */
  checkLogin: function () {
    var _this = this;
    // 检验登录状态
    wx.checkSession({
      success: function (res) {
        console.log("未过期");
        app.globalData.loginStatus = true;
        _this.setData({
          loginShow: app.globalData.loginStatus
        })
        console.log(res);
      },
      fail: function (res) {
        wx.navigateTo({
          url: '/pages/logs/logs',
        })
        app.globalData.loginStatus = false;
        //console.log("需要登录！！！！！！！！！！！！！！");
        _this.setData({
          loginShow: app.globalData.loginStatus
        })
        wx.hideTabBar({
          aniamtion: true,
        });
        console.log(_this.data.loginShow);
      }
    })
  },

  /**
   * 加载首页轮播数据
   */
  loadCarousel: function () {
    var _this = this;
    Api.loadIndexCarousel().then(res => {
      if (res.code === 2000){
        _this.setData({
          carousels: res.data
        })
      }
    })
  },

  /**
   * 加载首页分类数据
   */
  loadCategory: function () {
    var _this = this;
    Api.loadIndexCategory().then(res => {
      _this.setData({
        categoryList: res.data
      })
    })
  },

  /**
   * 加载首页商品数据
   */
  loadData: function () {
    var _this = this;
    Api.loadIndexData(_this.data.page, _this.data.size).then(res => {
      console.log(res);
      _this.setData({
        productList: _this.data.productList.concat(res.data.dataList),
        totalPages: res.data.totalPages
      })
    })
  },

  /**
   * 轮播地址跳转
   */
  togoods: function (e) {
    var _this = this;
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  /**
   * 跳转
   */
  nav: function (e) {
    var _this = this;
    wx.navigateTo({
      url: '/pages/product/product?flag=' + '0' + '&id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 跳转分类页
   */
  toMore: function () {
    var _this = this;
    wx.switchTab({
      url: '/pages/sort/sort',
    })
  },

  /**
   * 前往分类
   */
  toSort: function (e) {
    var _this = this;
    console.log(e.currentTarget.dataset.index);
    app.globalData.sortCurrent = e.currentTarget.dataset.index;
    wx.switchTab({
      url: '/pages/sort/sort',
    })
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
   * 前往拼团
   */
  tospell: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/goods/goods?flag=' + 1,
    })
  },

  /**
   * 前往秒杀
   */
  tolimit: function () {
    var _this = this;
    // wx.navigateTo({
    //   url: '/pages/product/product?flag=' + 'limit',
    // })
    wx.navigateTo({
      url: '/pages/goods/goods?flag=' + 2,
    })
  },

  /**
   * 前往热销
   */
  tosell: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/pointsfor/pointsfor',
    })
  },

  /**
   * 会员热卖
   */
  tomembers: function () {
    var _this = this;
    wx.navigateTo({
      url: '/pages/goods/goods?flag=' + 3,
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

  //查询跳转(点击放大镜/input失焦)
  toSortByQuery: function () {
    var _this = this;

    if (_this.data.getQuery != null && _this.data.getQuery != "") {
      let _queryData = {
        formIndex: true,
        queryContent: ""
      }
      _queryData.queryContent = _this.data.getQuery
      console.log(_queryData);
      app.globalData.queryData = _queryData
      wx.switchTab({
        url: '/pages/sort/sort',
      });
    } else {
      wx.showToast({
        title: '请输入正确的名称',
        icon: 'none',
      });
    }
  },

  // 搜索框输入的值
  getQuery: function (e) {
    var _this = this;
    _this.setData({
      getQuery: e.detail.value
    })
    // console.log(_this.data.getQuery)
  },

  /**
   * 加载门店
   */
  loadShopaddress: function () {
    var _this = this;
    Api.loadShopaddress().then(res => {
      console.log(res);
      _this.setData({
        storeList: res.data
      })
      _this.getLocations();
    })
  },

  /**
   * 打开/关闭门店选择
   */
  openOrClose: function () {
    var _this = this;
    // _this.setData({
    //   chooseShop: !_this.data.chooseShop
    // })
    wx.navigateTo({
      url: '/pages/chooseStore/chooseStore',
    })
  },

  /**
   * 选择门店
   */
  selectStore: function (e) {
    var _this = this;

  },

  /**
   * 获取距离
   */
  getLocations: function () {
    var _this = this;
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          console.log('未授权');
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              console.log('我点击了确定'.res);
              _this.sortStore();
            },
            fail(res) {
              console.log('我点击取消了',res);
              wx.showModal({
                title: '授权提醒',
                content: '您当前已关闭位置授权，请点击确认后在设置中打开！',
                showCancel: false,
                success: function (res) {
                  wx.openSetting({
                    success: function (res) {
                      console.log(res.authSetting, res)
                    },
                    fail: function (res) {},
                    complete: function (res) {},
                  })
                },
                fail: function (res) {

                }
              })
            }
          })
        } else {
          _this.sortStore();
        }
      },
      fail: function (res) {
        
      }
    })
  },
  
  /**
   * 处理门店列表展示
   */
  sortStore:function(){
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var cood = coordinate.bd09togcj02(parseFloat(res.latitude), parseFloat(res.longitude));
        wx.setStorageSync('userLocation', res);
        var store = null;
        for (let i = 0; i < _this.data.storeList.length; i++) {
          var distance = util.distance(cood[0], cood[1], _this.data.storeList[i].latitude, _this.data.storeList[i].longitude);
          _this.data.storeList[i].distance = distance;
          for (let j = 0; j < _this.data.storeList.length - 1; j++) {
            for (let n = 0; n < _this.data.storeList.length - 1 - j; n++) {
              if (_this.data.storeList[n].distance > _this.data.storeList[n + 1].distance) {
                store = _this.data.storeList[n];
                _this.data.storeList[n] = _this.data.storeList[n + 1];
                _this.data.storeList[n + 1] = store;
              }
            }
          }
        }
        wx.setStorageSync("store", _this.data.storeList);
        _this.setData({
          storeList: _this.data.storeList,
          store: _this.data.storeList[0].addressDetail
        })
      },
      fail: function (res) {

      }
    })
  },
})