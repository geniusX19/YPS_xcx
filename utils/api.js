//引入代码
import request from './request';

module.exports = {
  /**
   * 用户登陆
   */
  login: (code) => {
    return request({
      url: '/common/login/' + code,
      method: 'post'
    });
  },

  saveUserInfo: (data) => {
    return request({
      url: '/member/wx/account/saveOrUpdate/info',
      method: 'POST',
      data: data
    })
  },

  /**
   * 首页加载
   */

  // 加载商品数据
  loadIndexData: (page, size) => {
    return request({
      url: `/common/category/index/search/${page}/${size}`,
      method: 'GET'
    })
  },

  // 加载轮播图数据
  loadIndexCarousel: () => {
    return request({
      url: '/common/banner/search',
      method: 'POST',
      data: {
        title: ''
      }
    })
  },

  // 加载首页分类数据
  loadIndexCategory: () => {
    return request({
      url: '/common/category/search',
      method: 'POST',
      data: {
        title: ''
      }
    })
  },

  // 加载拼团或秒杀商品列表
  loadSpellOrLimitList: (data) => {
    return request({
      url: `/common/group/temp/customer/search/${data.page}/${data.size}/${data.type}`,
      method: 'GET'
    })
  },

  // 门店管理
  loadShopaddress: () => {
    return request({
      url: '/common/shopaddress/search',
      method: 'GET'
    })
  },

  /**
   * 分类管理
   */

  // 加载所有分类类目信息
  loadAllCategory: () => {
    return request({
      url: '/common/category/search',
      method: 'POST',
      data: {
        title: ''
      }
    })
  },

  // 加载对应分类分类信息
  loadCategory: (data, page, size) => {
    return request({
      url: `/common/goods/search/${page}/${size}`,
      method: 'POST',
      data: data
    })
  },

  /**
   * 购物车管理
   */

  // 查询购物车
  searchCart: () => {
    return request({
      url: '/member/cart/search',
      method: 'GET'
    })
  },

  // 加入购物车
  addCart: (data) => {
    return request({
      url: `/member/cart/add/${data.goodsId}/${data.num}`,
      method: 'POST'
    })
  },

  // 删除购物车
  delectCart: (params) => {
    console.log(params);
    return request({
      url: '/member/cart/delete',
      method: 'POST',
      params: params
    })
  },

  /**
   * 地址管理
   */

  //查询收货地址
  addressList: () => {
    return request({
      url: '/member/receiveAddress/search',
      method: 'GET'
    });
  },

  //删除地址
  Deladdress: (id) => {
    return request({
      url: `/member/receiveAddress/delete/${id}`,
      method: 'POST',
    })
  },

  //根据ID查询单条地址信息
  SearchAddressById: (id) => {
    return request({
      url: `/member/receiveAddress/search/one/${id}`,
      method: 'GET'
    })
  },

  //编辑地址
  UpdateAddress: (addressInfo) => {
    return request({
      url: '/member/receiveAddress/update',
      method: 'POST',
      data: addressInfo
    })
  },

  //新增地址
  AddAddress: (addressInfo) => {
    return request({
      url: '/member/receiveAddress/add',
      method: 'POST',
      data: addressInfo
    })
  },

  //设置默认地址
  ToUser:(id)=>{
    return request({
      url: `/member/receiveAddress/update/default/${id}`,
      method: 'POST',
    })
  },

  /**
   * 优惠券模块
   */

  //我的优惠券
  myCouponList:(page,size,data)=>{
    console.log("======前台传的值=======")
    console.log(page)
    console.log(size)
    console.log(data)
    console.log("=============")
    return request({
      url: `/member/coupon/draw/search/${page}/${size}`,
      method: 'POST',
      data: data
    })
  },

  //展示优惠券（领取）
  couponList:(page,size,data)=>{
    console.log("======前台传的值=======")
    console.log(page)
    console.log(size)
    console.log(data)
    console.log("=============")
    return request({
      url: `/common/couponTemp/search/${page}/${size}`,
      method: 'POST',
      data: data
    })
  },

  //领取优惠券（领取）
  getCoupon:(id)=>{
    console.log(id);
    return request({
      url: `/member/coupon/draw/${id}`,
      method: 'POST',
    })
  },

  /**
   * 积分换购
   */

  // 加载可换购商品列表
  loadSwapList: (page, size, data) => {
    return request({
      url: `/common/swap/search/${page}/${size}`,
      method: 'POST',
      data: data
    })
  },

  // 加载兑换记录列表
  loadRecord: (page, size) => {
    return request({
      url: `/member/swap/record/search/${page}/${size}`,
      method: 'GET',
    })
  },

  // 执行兑换操作
  performExchange:(id) => {
    return request({
      url: `/member/swap/record/add/${id}`,
      method: 'POST'
    })
  },

  /**
   * 商品收藏
   */
  //商品收藏列表
  showCollectionList:function(page,size,data){
    console.log("======前台传的值=======")
    console.log(page)
    console.log(size)
    console.log(data)
    console.log("=======END======")
    return request({
      url: `/member/collection/search/${page}/${size}`,
      method: 'POST',
      data:data
    })
  },

  //移除收藏
  delCollention:function(id){
    return request({
      url: `/member/collection/cancel/${id}`,
      method: 'POST',
    })
  },

  // 添加收藏
  addCollection:function(id){
    return request({
      url: `/member/collection/add/${id}`,
      method: 'POST'
    })
  },

  // 取消收藏
  cancelCollection:(id) =>{
    return request({
      url: `/member/collection/cancel/${id}`,
      method: 'POST'
    })
  },

  // 检索手否收藏该商品
  searchCollection:(id) => {
    return request({
      url: `/member/collection/goods/${id}`,
      method: 'GET'
    })
  },

  /*
   * 商品页管理
   */

  // 查看商品详情
  loadProductInt: (id) => {
    return request({
      url: `/common/goods/one/${id}`,
      method: 'GET'
    })
  },

  // 加载拼团模板信息
  loadSpellTemplate:(id) => {
    return request({
      url: `/common/group/temp/customer/query/${id}`,
      method: 'GET'
    })
  },

  // 加载拼团队伍列表
  loadSpellTeamList: (data) => {
    return request({
      url: `/common/group/temp/search/${data.templateId}/${data.page}/${data.size}`,
      method: 'GET'
    })
  },

  //查詢賬戶信息
  queryAccountInfo:()=>{
    return request({
      url: '/member/finance/one/searchOrCreate',
      method: 'POST'
    })
  },

  //查询充值模型
  AmountsList:()=>{
    return request({
      url: '/member/finance/rechargeModel',
      method: 'GET'
    })
  },

   //充值之前获取充值信息
   RechargeMsg:(data)=>{
     return request({
      url: '/member/finance/create/recharge',
      method: 'POST',
      data:data
     })
   },

   // 优惠券数量
   couponNum:()=>{
     return request({
      url:'/member/coupon/dra/count/can/use',
      method:'POST'
     })
   },


  /**
   * 确认订单页面
   */

  // 加载默认收货地址
  loadDefaultAddress:() => {
    return request({
      url: '/member/receiveAddress/search/default',
      method: 'GET'
    })
  },

  //生成订单
  generateOrder: (data) => {
    //console.log(data)
    return request({
      url: `/member/cart/search/by/ids`,
      method: 'POST',
      data: data
    })
  },

  //订单价格预览
  previewOrder: (data) => {
    return request({
      url: `/member/order/common/pre`,
      method: 'POST',
      data: data
    })
  },

  //支付接口
  payment: (data) => {
    return request({
      url: `/member/order/common/create`,
      method: 'POST',
      data: data
    })
  },

  //余额支付
  balancePayment: (billId) => {
    return request({
      url: `/member/order/common/confirm/remain/${billId}`,
      method: 'POST',
    })
  },

  /**
   * 订单管理
   */

  //用户订单查询
  queryOrder: (page, size, data) => {
    return request({
      url: `/member/order/search/${page}/${size}`,
      method: 'POST',
      data: data
    })
  },

  //取消订单
  cancelOrder: (orderId) => {
    return request({
      url: `/member/order/cancel/${orderId}`,
      method: 'POST',
    })
  },

  //申请订单原因
  applyRefund: (data) => {
    return request({
      url: `/member/order/application`,
      method: 'POST',
      data: data,
    })
  },

  //待收货接口
  receivingGoods: (orderId) => {
    return request({
      url: `/member/order/receive/${orderId}`,
      method: 'POST',
    })
  },
  //订单付款接口
  paymentOrder: (orderId) => {
    return request({
      url: `/member/order/pay/${orderId}`,
      method: 'POST',
    })
  },
  //拼团支付接口
  paymentAssemble: (orderId) => {
    return request({
      url: `/member/spell/task/confirm/remain/${orderId}`,
      method: 'POST',
    })
  },

  //预览明细
  previewRecharge:(fee)=>{
    return request({
      url: '/member/finance/pre/recharge?amount='+fee,
      method: 'POST',
    })
  }
}