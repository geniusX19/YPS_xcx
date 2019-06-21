// pages/order/order.js

//引入代码
var Http = require("../../utils/request.js");

var app = getApp();
import Api from '../../utils/api';
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    currentArry: [
      {
        text: "全部订单"
      }, {
        text: "待付款"
      }, {
        text: "拼团中"
      }, {
        text: "待接单"
      }, {
        text: "待收货"
      }, {
        text: "已取消"
      }
    ], // 标签内容
    currentTab: 0, // 标签对应块标识
    payType: "", //支付类型
   /* UNPAYED,//待支付
    GROUPING,//拼团中
    WAITSEND,//待发货
    WAITRECEIVE,//待收货
    EVALUATE,//待评价
    REFUNNING,//退款中
    REFUND,//已退款
    CANCEL;//已取消 */
    orderStatus: '',//订单状态
    page: 1, //分页
    size: 10, //
    sort: "desc", //降序
    orderList: [],
    isShow: false, //弹出申请退款理由
    orderId: "",  //订单id
    popupText: "", //申请退款原因
    orderIndex: "", //删除申请退款的数据索引
  },

  //付款按钮
  paymentClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let arr = _this.data.orderList;
    let id = _this.data.orderList[index].order.id;
    Api.paymentOrder(id).then(res => {
      
      if (res.code == 2000) {
        // if (_this.data.currentTab == 1) {  //待付款
        //   arr.splice(index, 1)
        // } else if (_this.data.currentTab == 0) {    //全部订单操作 不能直接删除数据
        //   arr[index].order.orderStatus = "WAITSEND"
        // }
        // _this.setData({
        //   orderList: arr,
        // })
        let data = res.data;
        console.log(res)
        if (data.priceModel.totalMoney == 0){
          data.bill.payType = "REMAIN"
        }
        if (data.bill.payType == "REMAIN"){ //余额支付 
          if (data.orderType == "GOODS_PAY"){  //普通订单
            wx.showModal({
              title: "余额支付",
              content: "当前支付：¥" + data.priceModel.totalMoney,
              success(res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                  // let data1 = {
                  //   billId: data.bill.id
                  // }
                  Api.balancePayment(data.bill.id).then(res => {
                    //console.log(res)
                    if (res.code = 2000) {
                      if (_this.data.currentTab == 1) {  //待付款
                        arr.splice(index, 1)
                      } else if (_this.data.currentTab == 0) {    //全部订单操作 不能直接删除数据
                        arr[index].order.orderStatus = "WAITSEND"
                      }
                      _this.setData({
                        orderList: arr,
                      })
                    }
                  })
                } else if (res.cancel) {
                  //console.log('用户点击取消')
                  
                }
               
              }
            })
            
          }else{ //拼团订单
            wx.showModal({
              title: "余额支付",
              content: "当前支付：¥" + data.priceModel.totalMoney,
              success(res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                  // let data1 = {
                  //   billId: data.bill.id
                  // }
                  Api.paymentAssemble(data.bill.id).then(res => {
                    //console.log(res)
                    if (res.code = 2000) {
                      if (_this.data.currentTab == 1) {  //待付款
                        arr.splice(index, 1)
                      } else if (_this.data.currentTab == 0) {    //全部订单操作 不能直接删除数据
                        arr[index].order.orderStatus = "WAITSEND"
                      }
                      _this.setData({
                        orderList: arr,
                      })
                    }
                  })
                } else if (res.cancel) {
                  //console.log('用户点击取消')
                }
              }
            })

          }
        }else{  //微信支付
          let payString = JSON.parse(data.bill.payString);
          //console.log(typeof payString)
          wx.requestPayment({
            timeStamp: payString.timeStamp,
            nonceStr: payString.nonceStr,
            package: payString.package,
            signType: payString.signType,
            paySign: payString.paySign,
            success(res) {
              if (_this.data.currentTab == 1) {  //待付款
                arr.splice(index, 1)
              } else if (_this.data.currentTab == 0) {    //全部订单操作 不能直接删除数据
                arr[index].order.orderStatus = "WAITSEND"
              }
              _this.setData({
                orderList: arr,
              })
            },
            fail(res) {
             
            }
          })
        }

      }
    })
  }, 

  //待收货
  receivingGoodsClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let arr = _this.data.orderList;
    let id = _this.data.orderList[index].order.id;
    console.log(id)
    Api.receivingGoods(id).then(res => {
      console.log(res)
      if (res.code = 2000) {
        wx.showToast({
          title: '已收货',
          duration: 2000,
        })
        if (_this.data.currentTab == 4) {  //待收货
          arr.splice(index, 1)
        } else if (_this.data.currentTab == 0) {    //全部订单操作 不能直接删除数据
          arr[index].order.orderStatus = "EVALUATE"
        }
        _this.setData({
          orderList: arr,
        })
      }
    })
  },
  //取消订单
  cancelOrderClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let arr = _this.data.orderList;
    let id = _this.data.orderList[index].order.id;
    Api.cancelOrder(id).then(res => {
      if(res.code = 2000){
        wx.showToast({
          title: '已取消订单',
          duration: 2000,
        })
        if (_this.data.currentTab == 1){
          arr.splice(index, 1)
        } else if (_this.data.currentTab == 0){    //全部订单操作 不能直接删除数据
          arr[index].order.orderStatus = "CANCEL"
        }
        _this.setData({
          orderList: arr,
        })
      }
    })
    
  },
  //申请退款按钮
  refundClick(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      orderId: _this.data.orderList[index].order.id,
      orderIndex: index,
      isShow: true,
    })
  },
  //取消申请弹出框
  colsePopupClick(){
    console.log(111)
    let _this = this;
    _this.setData({
      isShow: false,
    })
  },
  //申请退款内容
  popupTextClick(e){
    let _this = this;
    _this.setData({
      popupText: e.detail.value
    })
  },

  //确定申请按钮
  confirmPopupClick(){
    let _this = this;
    if (_this.data.popupText == ''){
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    let data = {
      orderId: _this.data.orderId,
      refundReason: _this.data.popupText
    }
    let arr = _this.data.orderList
    Api.applyRefund(data).then( res => {
      //console.log(res)
      if(res.code == 2000){
        arr.splice(_this.data.orderIndex, 1)
        _this.setData({
          isShow: false,
          orderList: arr
        })
      }
    })
  },


  getData(){
    let _this = this;
    let data = {
      orderStatus: this.data.orderStatus,
      sort: this.data.sort
    }
    //console.log(this.data.page)
    Api.queryOrder(this.data.page, this.data.size,data).then(res => {
      //console.log(res) 
      if(res.code = 2000){
        let list = res.data.dataList;
       // console.log(list)
        _this.setData({
          orderList: _this.data.orderList.concat(list)
        })
      }
    })
  },

  /**
    * 点击切换标签
    */
  navtap: function (e) {
    var _this = this;
    let index = e.currentTarget.dataset.num;
    
    _this.setData({
      currentTab: index,
      page: 1,
      orderList: [],
    })
    if(index === 0 ){
      _this.setData({
        orderStatus: "",
      })
    } else if (index === 1 ){
      _this.setData({
        orderStatus: "UNPAYED",
      })
    } else if (index === 2) {
      _this.setData({
        orderStatus: "GROUPING",
      })
    } else if (index === 3) {
      _this.setData({
        orderStatus: "WAITSEND",
      })
    } else if (index === 4) {
      _this.setData({
        orderStatus: "WAITRECEIVE",
      })
    } else if (index === 5) {
      _this.setData({
        orderStatus: "CANCEL",
      })
    }
    _this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      page: 1,
      orderList: [],
    });
    if (options != undefined || options != null) {
      let index = options.current
      console.log(index)
      if (index == 0) {
        _this.setData({
          orderStatus: "",
          currentTab: index,
        })
      } else if (index == 1) {
        _this.setData({
          orderStatus: "UNPAYED",
          currentTab: index,
        })
      } else if (index == 2) {
        _this.setData({
          orderStatus: "GROUPING",
          currentTab: index,
        })
      } else if (index == 3) {
        _this.setData({
          orderStatus: "WAITSEND",
          currentTab: index,
        })
      } else if (index == 4) {
        _this.setData({
          orderStatus: "WAITRECEIVE",
          currentTab: index,
        })
      } else if (index == 5) {
        _this.setData({
          orderStatus: "CANCEL",
          currentTab: index,
        })
      }else{
        _this.setData({
          orderStatus: "",
          currentTab: 0,
        })
      }

      _this.getData()
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
    this.setData({
      page: this.data.page+1
    })
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

 
  
 
})