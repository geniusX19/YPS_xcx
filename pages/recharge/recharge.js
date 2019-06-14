// pages/recharge/recharge.js

var app = getApp();
import Api from '../../utils/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    tab: 0, // 充值金额列表选择标识
    amounts: [], // 充值金额列表
    AccountInfo:{},//賬戶信息
    money:200,//充值金額
    chooseList:true, //选中金额表示
    frozen:false,//账户冻结标识
    discountAmount:0,//优惠金额
    rechargeAmount:200,//充值金额
    finalAmount:200,//支付金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight, // 获取顶部导航栏高度
    })
    _this.getAmountsList();
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
    _this.queryAccountInfo();
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
   * 选择充值列表
   */
  chooseList: function (e) {
    var _this = this;
    _this.setData({
      tab: e.currentTarget.dataset.index
    })
    console.log(_this.data.tab)
    console.log(_this.data.amounts[_this.data.tab])
    _this.setData({
      money:_this.data.amounts[_this.data.tab],
      chooseList:true
    })
    _this.previewRecharge();
  },

  /*
   * 查詢賬戶信息
   */
  queryAccountInfo: function () {
    var _this = this;
    Api.queryAccountInfo().then(res => {
      console.log("========查詢用戶信息==========")
      console.log(res)
      console.log("========查詢用戶信息END==========")
      _this.setData({
        AccountInfo: res.data
      })
    })
  },
    /*
   * 充值
   */
  recharge:function(){
    var _this = this;
    console.log("chongzhilo")
    if(_this.data.money == null || _this.data.money == "" || _this.data.money == 0){
      wx.showToast({
        title: '请输入或选择正确金额',
        icon: 'none',
      });
    }else{
      console.log("===充值咯===")
      console.log(_this.data.money)
      console.log("===充值END===")
      _this.getRechargeMsg();
    }
  },

  /**
   * 輸入框獲取焦點時清空按鈕樣式
   */
  clear:function(){
    var _this = this;
    _this.setData({
      tab: null,
      money:null,
      chooseList:false
    })
  },

  /*
  * 输入时获取金额
  */
 getInput:function(e){
   var _this = this;
   console.log(e.detail.value)
   _this.setData({
    money:e.detail.value
   })
   if(e.detail.value<200){
    _this.setData({
        discountAmount:0,//优惠金额
        rechargeAmount:0,//充值金额
        finalAmount:0,//支付金额
     })
   }else{
    _this.setData({
      money:e.detail.value
    })
  
    _this.previewRecharge();
   }
 },

 //查询账户充值模型
 getAmountsList:function(){
   var _this = this;
   Api.AmountsList().then(res=>{
    console.log("=====查询充值模型=====")
    console.log(res);
    _this.setData({
      amounts:res.data.rechargeModel
    })
    console.log("=====查询充值模型END=====")
    console.log(_this.data.amounts)
   })
 },

 //充值之前获取充值信息
 getRechargeMsg:function(){
   var _this = this;
   var _data = {
    "amount":_this.data.money,
    "payType":"WX"
   }
   console.log(_data)
   Api.RechargeMsg(_data).then(res=>{
     console.log("===获取充值信息===")
     console.log(res);
     console.log("===获取充值信息END===")
     console.log(res.data.bill.payString)
     var payCode = JSON.parse(res.data.bill.payString)
     console.log(payCode)
     
     wx.requestPayment({
       timeStamp: payCode.timeStamp,
       nonceStr: payCode.nonceStr,
       package: payCode.package,
       signType: payCode.signType,
       paySign: payCode.paySign,
     });
   })
 },

 //预览明细
 previewRecharge:function(){
   var _this=this;
   Api.previewRecharge(_this.data.money).then(res=>{
     console.log("======查看充值明细======")
     console.log(res);
     console.log("======查看充值明细END======")
     console.log(res.data.isFrozen)
     if(res.data.isFrozen == false){
       console.log("后台提交的金额："+_this.data.money)
      _this.setData({
        discountAmount:res.data.priceModel.discountAmount,//优惠金额
        rechargeAmount:res.data.priceModel.rechargeAmount,//充值金额
        finalAmount:res.data.priceModel.finalAmount,//支付金额
      })
     }else{
       wx.showToast({
         title: '您的账户已被冻结，不允许充值！！',
         icon: 'none',
       });
       _this.setData({
        frozen:true
       })
     }
   })
 },

 //失焦获取金额
 delInput:function(e){
   var _this = this;
   var _sjje = e.detail.value;
   console.log("====失焦获取的金额")
   console.log(_sjje)
   console.log("====失焦获取的金额END==========")

   if(_sjje<200){
     wx.showToast({
       title: '输入的金额不能低于200元',
       icon: 'none',
     });
     _this.setData({
      discountAmount:0,//优惠金额
      rechargeAmount:0,//充值金额
      finalAmount:0,//支付金额
     })
   }else{
    _this.setData({
      money:_sjje
    })
    console.log("========失焦后替换的data中的金额===")
    console.log(_this.data.money)
  
    _this.previewRecharge();
   }


  
  // Api.previewRecharge(_this.data.money).then(res=>{
  //   console.log("======查看充值明细======")
  //   console.log(res);
  //   console.log("======查看充值明细END======")
  //   console.log(res.data.isFrozen)
  //   if(res.data.isFrozen == false){
  //     console.log("后台提交的金额："+_this.data.money)
  //    _this.setData({
  //      discountAmount:res.data.priceModel.discountAmount,//优惠金额
  //      rechargeAmount:res.data.priceModel.rechargeAmount,//充值金额
  //      finalAmount:res.data.priceModel.finalAmount,//支付金额
  //    })
  //   }else{
  //     wx.showToast({
  //       title: '您的账户已被冻结，不允许充值！！',
  //       icon: 'none',
  //     });
  //     _this.setData({
  //      frozen:true
  //     })
  //   }
  // })
  
 }
})