// pages/ordering/ordering.js

var app = getApp();

import Api from '../../utils/api';

const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    select: 1,// 顶部订单类型切换
    array: ['余额', '微信支付'],
    index: 0, //支付方式 0 余额支付 1微信支付
    arrays: ['到店自提', '快递', '壹配送'],
    indexs: 0,  //获取可选配送方式的索引
    isCartPay: true,
    infoOrder: {},
    num: 1, //详情页进来的数量为1
    totalNum: 1,
    productId: '',// 页面商品信息
    canUseCouponCounBOl: true,
    couponId: '',
    deliveryType: ["ZT",'POST','YPS'], //YPS壹配送到家  ZT自提 POST邮寄
    payType: ["REMAIN","WX"], //REMAIN 余额支付  WX 微信
    remarks: '',//备准信息
    storeList: [
      {
        selected: false,
        store: '总店：创客云谷（马鞍山路店)'
      }, {
        selected: true,
        store: '总店：创客云谷（马鞍山路店)'
      }, {
        selected: false,
        store: '总店：创客云谷（马鞍山路店)'
      },
    ],// 门店信息
    productInfoList:[],
    
  },

  getData(data){
    let _this = this;
    Api.generateOrder(data).then(res => {
      if(res.code == 2000 ){
        let arr = res.data
        console.log(arr)
        let totalNum = 0;
        for(let i  = 0; i < arr.length; i++){
          totalNum += arr[i].num
        }
        _this.setData({
          productInfoList: arr,
          totalNum: totalNum,
        })
        
      }
    })
  },
  getData1(data) {
    let _this = this;
    Api.previewOrder(data).then(res => {

     // console.log(res)
      if (res.code == 2000) {
        _this.setData({
         // productInfoList: arr
          infoOrder: res.data,
          canUseCouponCounBOl: res.data.canUseCouponCount == 0 ? true : false
        })
      }
    })
  },

  //减法
  reduceClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let arr = _this.data.productInfoList;
    if (arr[index].num <= 1){
      arr[index].num = 1
      return;
    }
    arr[index].num --;
    if (_this.data.isCartPay){
      //购物车进来的
      
    }else{
      //详情页进来的
      _this.setData({
        num: arr[index].num,
        productInfoList: arr
      })
      let data = {
        "isCartPay": _this.data.isCartPay,
        "cartItemDtoList": _this.data.productInfoList,
        "goodsId": _this.data.productId,
        "num": _this.data.num
      }
      _this.getData(data);
      let data1 = {
        "shopAddressId": "1126073292642324480",//门店地址
        "couponId": _this.data.couponId,//优惠券ID
        "addressId": "",//收货地址
        "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
        "isCartPay": _this.data.isCartPay,//购物车进入标记
        "cartItemDtoList": _this.data.productInfoList,
        "goodsId": _this.data.productId,
        "num": _this.data.num
      }
      _this.getData1(data1)
    }
  },
  //加法
  addClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let arr = _this.data.productInfoList;
    let arrCart = _this.data.productInfoList;
    arr[index].num++;
    if (_this.data.isCartPay) {
      //购物车进来的
      _this.setData({
        productInfoList: arr,
      })
    } else {
      //详情页进来的
      _this.setData({
        num: arr[index].num,
        productInfoList: arr
      })
    }
    let data = {
      "isCartPay": _this.data.isCartPay,
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    //console.log(data)
    _this.getData(data);
    
    let data1 = {
      "shopAddressId": "1126073292642324480",//门店地址
      "couponId": _this.data.couponId,//优惠券ID
      "addressId": "",//收货地址
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    _this.getData1(data1)
  },

  //支付订单提交
  paymentClick(){
    let _this = this;
    let data1 = {
      "shopAddressId": "1126073292642324480",//门店地址
      "couponId": _this.data.couponId,//优惠券ID
      "addressId": "",//收货地址
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    _this.getData1(data1)


    let data = {
      "shopAddressId": "1126073292642324480",
      "couponId": _this.data.couponId,
      "addressId": "1126679400134217728",
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num,
      "payType": _this.data.payType[_this.data.index],
      "needInvoice": true,
      remarks: _this.data.remarks
    }
    //console.log(_this.data.infoOrder.priceModel.canUseRemainPay)
   // console.log(_this.data.infoOrder.priceModel.financeRemain)
    if(_this.data.index === 0 ){  //余额支付
      if (!(_this.data.infoOrder.priceModel.canUseRemainPay)) { //判断是否可以余额支付 
        wx.showToast({
          title: '您的余额不足',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
        return false;
      }else {  //可以余额支付
        Api.payment(data).then(res => {
          //console.log(res)
          if (res.code == 2000) {
            let data = res.data;
            wx.showModal({
              content: '账户余额：¥' + _this.data.infoOrder.priceModel.financeRemain + "\r\n当前支付：¥" + data.bill.amount,
              success(res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                  let data1 = {
                    billId: data.bill.id
                  }
                  Api.balancePayment(data1).then(res => {
                    //console.log(res)
                    if(res.code = 2000){
                      wx.redirectTo({
                        url: '/pages/order/order?current=3',
                      })
                    }
                  })
                } else if (res.cancel) {
                  //console.log('用户点击取消')
                  wx.redirectTo({
                    url: '/pages/order/order?current=1',
                  })
                }
                app.globalData.shoppingData = 0;
                app.loadCartNum();
              }
            })
          }
         
        })
      }
      

    }else {
      Api.payment(data).then(res => {
        //console.log(res)
        if (res.code == 2000) {
          let payString = JSON.parse(res.data.bill.payString);
          //console.log(typeof payString)
          wx.requestPayment({
            timeStamp: payString.timeStamp,
            nonceStr: payString.nonceStr,
            package: payString.package,
            signType: payString.signType,
            paySign: payString.paySign,
            success(res) {
              //console.log(111)
              wx.redirectTo({
                url: '/pages/order/order?current=3',
              })
            },
            fail(res) {
              wx.redirectTo({
                url: '/pages/order/order?current=2',
              })
            }
          })
        }
      })
    }
    
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
   
    if(options.id != undefined){
      _this.setData({
        productId: options.id,
        isCartPay: false
      })
    };
    
    try {
      var value = wx.getStorageSync('cartItemDtoList')
      if (value) {
        // Do something with return value
        _this.setData({
          productInfoList: value
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    _this.setData({
      navH: app.globalData.navHeight
    });
    let  data = {
      "isCartPay": _this.data.isCartPay,
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    //console.log(data)
    _this.getData(data);
    let data1 = {
      "shopAddressId": "1126073292642324480",//门店地址
      "couponId": _this.data.couponId,//优惠券ID
      "addressId": "",//收货地址
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    _this.getData1(data1)

    
  },
   //获取门店



  //获取备注信息
  remarksClick: function (e) {
    let _this = this;
    _this.setData({
      remarks: e.detail.value,
    })
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
    //console.log(this.data.couponId)
    try {
      var value = wx.getStorageSync('cartItemDtoList')
      if (value) {
        // Do something with return value
        _this.setData({
          productInfoList: value
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    
    let data1 = {
      "shopAddressId": "1126073292642324480",//门店地址
      "couponId": _this.data.couponId,//优惠券ID
      "addressId": "",//收货地址
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    _this.getData1(data1)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    try {
      wx.clearStorageSync('cartItemDtoList')
    } catch (e) {
      // Do something when catch error
    }
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
   * 订单类型切换
   */
  orderTypeSwitch:function(e){
    //YPS壹配送到家  ZT自提 POST邮寄
    let index  = e.currentTarget.dataset.index;
    let _this = this;
    _this.setData({
      select: index
    })
  },

  /**
   * 门店选择
   */
  catchSelect:function(e) {
    var _this = this;
    for (let i = 0; i < _this.data.storeList.length; i ++){
      _this.data.storeList[i].selected = false;
    }
    _this.data.storeList[e.currentTarget.dataset.index].selected = true;
    _this.setData({
      storeList: _this.data.storeList
    })
  },

  /**
   * 选择支付方式
   */
  bindPickerChange:function(e){
    var _this = this;
    //console.log(e.detail.value);
    _this.setData({
      index: e.detail.value
    })
  },

  /**
   * 选择配送方式
   */
  bindPickerChanges: function (e) {
    var _this = this;
    _this.setData({
      indexs: e.detail.value
    })
  },
})