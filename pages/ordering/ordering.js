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
    select: 0,// 顶部订单类型切换
    array: ['微信支付', '余额'],
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
    payType: ["WX", "REMAIN"], //REMAIN 余额支付  WX 微信
    remarks: '',//备准信息
    addressId: "", //收货地址
    userInfo: {}, //用户信息
    addressDetailList: [], //获取全部的门店地址
    shopAddressId: '', //门店的id
    isGetAddress: false,
    goodsIdArr: '', //传给优惠券的商品id数据
    productInfoList:[],
    
  },
  //获取用户默认地址
  getAddressData() {
    let _this = this;
    Api.loadDefaultAddress().then(res => {
      console.log(res)
      if(res.code == 2000){
        if (res.data == undefined){
          _this.setData({
            isGetAddress: false,
          })
            // wx.showModal({
            //   title: '',
            //   content: '没有填写默认地址，请去填写默认地址',
            //   success(res) {
            //     if (res.confirm) {
            //       //console.log('用户点击确定')
            //       wx.navigateTo({
            //         url: '/pages/addresses/addresses',
            //       })
            //     } else if (res.cancel) {
            //       //console.log('用户点击取消')
            //       wx.navigateBack({
                    
            //       })
            //     }
            //   } 
            // })
        }else{
          _this.setData({
            userInfo: res.data,
            isGetAddress: true,
          })
        }
      }
    })
  },

  getData(){
    let _this = this;
    let data = {
      "isCartPay": _this.data.isCartPay,
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    Api.generateOrder(data).then(res => {
      if(res.code == 2000 ){
        let arr = res.data;
        let goodsArr = []
        console.log("商品预览====",arr)
        let totalNum = 0;
        for(let i  = 0; i < arr.length; i++){
          totalNum += arr[i].num;
          goodsArr.push(arr[i].goodsId)
        }
        console.log(goodsArr)
        _this.setData({
          productInfoList: arr,
          totalNum: totalNum,
          goodsIdArr: goodsArr.join('-'),
        })
        
      }
    })
  },
  getData1() {
    let _this = this;
    let data = {
      "shopAddressId": _this.data.shopAddressId,//门店地址
      "couponId": _this.data.couponId,//优惠券ID
      "addressId": _this.data.userInfo.id,//收货地址
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num
    }
    //console.log(_this.data.couponId)
    Api.previewOrder(data).then(res => {
     console.log(res)
      if (res.code == 2000) {
        _this.setData({
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
      //购物车进来的
      _this.setData({
        productInfoList: arr,
      })
      
    }else{
      //详情页进来的
      _this.setData({
        num: arr[index].num,
        productInfoList: arr
      })
    }
    _this.getData();
    _this.getData1();
  },

 

  //加法
  addClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let arr = _this.data.productInfoList;
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
    _this.getData();
    
    _this.getData1()
  },

  //支付订单提交
  paymentClick(){
    let _this = this;

    if(_this.data.select == 0){
      if (!_this.data.isGetAddress){
        wx.showToast({
          title: '请填写默认地址',
          icon: "none",
        })
        return;
      }
    }

    if (_this.data.infoOrder.priceModel.finalMoney == 0){
      _this.setData({
        index: 0,
      })
    }

    _this.getData1()


    let data = {
      "shopAddressId": _this.data.shopAddressId,
      "couponId": _this.data.couponId,
      "addressId": _this.data.userInfo.id,
      "deliveryType": _this.data.deliveryType[_this.data.indexs],//配送方式
      "isCartPay": _this.data.isCartPay,//购物车进入标记
      "cartItemDtoList": _this.data.productInfoList,
      "goodsId": _this.data.productId,
      "num": _this.data.num,
      "payType": _this.data.payType[_this.data.index],
      "needInvoice": false, //是否需要发票
      "remarks": _this.data.remarks
    }
    console.log(data)
    //console.log(_this.data.infoOrder.priceModel.canUseRemainPay)
   // console.log(_this.data.infoOrder.priceModel.financeRemain)
    if(_this.data.index == 1){  //余额支付
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
            console.log(data)
            wx.showModal({
              content: '账户余额：¥' + _this.data.infoOrder.priceModel.financeRemain + "\r\n当前支付：¥" + data.priceModel.finalMoney,
              success(res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                  // let data1 = {
                  //   billId: data.bill.id
                  // }
                  Api.balancePayment(data.bill.id).then(res => {
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
                url: '/pages/order/order?current=1',
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
    _this.getAddressData()
    try {
      var value = wx.getStorageSync('store')
      if (value) {
        // Do something with return value
        //console.log(value)
        _this.setData({
          addressDetailList: value
        });
      }
    } catch (e) {
      // Do something when catch error
    }

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
    //默认选择门店的第一个
    _this.data.addressDetailList[0].selected = true;
    _this.setData({
      addressDetailList: _this.data.addressDetailList,
      shopAddressId: _this.data.addressDetailList[0].id
    })
    

    _this.getData();

    _this.getData1();
    if (_this.data.select == 1) {
      //默认是到点自取
      _this.setData({
        deliveryType: ["ZT"],
        arrays: ['到店自提'],
      })
    } else {
      //默认是到点自取
      //console.log(1111)
      if (_this.data.addressDetailList[0].city == _this.data.userInfo.city) {
        _this.setData({
          deliveryType: ['POST', 'YPS'],
          arrays: ['快递', '壹配送'],
        })
      } else {
        _this.setData({
          deliveryType: ['POST'],
          arrays: ['快递'],
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // try {
    //   wx.clearStorageSync('cartItemDtoList')
    // } catch (e) {
    //   // Do something when catch error
    // }
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
    //deliveryType: ["ZT", 'POST', 'YPS'], //YPS壹配送到家  ZT自提 POST邮寄
    if(index == 0){
      //获取默认地址
      _this.getAddressData()
      if (_this.data.addressDetailList[0].city == _this.data.userInfo.city){
        _this.setData({
          deliveryType: ['POST', 'YPS'],
          arrays: ['快递', '壹配送'],
        })
      }else{
        _this.setData({
          deliveryType: ['POST'],
          arrays: ['快递'],
        })
      }
     
    }else if(index == 1){
      _this.setData({
        deliveryType: ["ZT"],
        arrays: ['到店自提'],
      })
    }
    _this.setData({
      select: index
    })
  },

  /**
   * 门店选择
   */
  catchSelect:function(e) {
    var _this = this;
    for (let i = 0; i < _this.data.addressDetailList.length; i ++){
      _this.data.addressDetailList[i].selected = false;
    }
    _this.data.addressDetailList[e.currentTarget.dataset.index].selected = true;
    _this.setData({
      addressDetailList: _this.data.addressDetailList,
      shopAddressId: _this.data.addressDetailList[e.currentTarget.dataset.index].id
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
    
    _this.getData1()
  },
})