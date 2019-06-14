// pages/product/product.js

const app = getApp();

var util = require("../../utils/util.js");

//引入页面api
import Api from '../../utils/api';

var page = 1;// 页码
var size = 3;// 页面加载条数
var countdownClear = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,// 用户手机导航高度
    navTitName: null,// 顶部导航栏名称
    loadFlag: '',// 加载页面商品信息标识
    tabshow: 0,// 用于控制切换商品和详情
    countdown: '',// 秒杀倒计时
    spellCountdown: [],// 拼团倒计时
    productId: null,// 所需加载商品的id
    totalPage: null,// 当前页面数据总页数
    product: {},// 页面商品信息
    productCarousel: [],// 商品轮播
    shareViewOpen: false,// 分享框显示标识
    showDialog: false,// 分享大图视图框
    imgHide:false, //分享图显示隐藏标识
    srcOne:'',
    imgList:[],
    spellteam: [
      {
        spellNum: 3,
        spellPrice: 28.00,
        personName: '3987丶奋斗',
        limitNum: 6,
        remaining: '剩余01天17时00分18秒'
      }, {
        spellNum: 3,
        spellPrice: 28.00,
        personName: '3987丶奋斗',
        limitNum: 6,
        remaining: '剩余01天17时00分18秒'
      }, {
        spellNum: 3,
        spellPrice: 28.00,
        personName: '3987丶奋斗',
        limitNum: 6,
        remaining: '剩余01天17时00分18秒'
      }
    ],// 拼团队伍列表
    imgUrls: {
      url: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/product/%E5%9B%BE%E5%B1%82%20160%402x.png'
    },
    userInfo:{},//用户信息
    portrait_temp: null, //头像
    wxName:null,//昵称
    bgPath: '/imgs/background.png',  //背景
    qrcode_temp: '/imgs/qr.png', //二维码
    windowWidth: null, //图片宽度
    windowHeight: 1334, //图片高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,// 获取顶部导航栏高度
      userInfo: app.globalData.userInfo,
      windowWidth:wx.getSystemInfoSync().windowWidth,
      windowHeight:wx.getSystemInfoSync().windowHeight,
    })

    wx.showShareMenu({
      withShareTicket: true
    })

    if (options.flag != undefined) {
      switch (options.flag) {
        // 热销商品
        case '0':
          _this.setData({
            navTitName: '热销',
            loadFlag: 'product',
          })
          break;
        // 限时拼团
        case '1':
          _this.setData({
            navTitName: '拼团',
            loadFlag: 'spell',
          })
          break;
        // 限时秒杀
        case '2':
          _this.setData({
            navTitName: '秒杀',
            loadFlag: 'limit',
          })
          break;
        // 会员热卖
        case '3':
          _this.setData({
            navTitName: '会员',
            loadFlag: 'product',
          })
          break;
      }
    }
    if(options.id != undefined){
      _this.setData({
        productId: options.id
      })
    }
    console.log(options.id,options.flag,typeof(options.flag));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this; 
    if (_this.data.loadFlag == 'product'){
      this.buttom = this.selectComponent('#buttom');// 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
      let myComponent = this.buttom;
      myComponent.cartNumUp(app.globalData.shoppingData);// 调用自定义组件中的方法
    }
    console.log('页面加载所需要的id', _this.data.productId, _this.data.loadFlag)
    switch(_this.data.loadFlag){
      case 'spell':
      case 'limit':
        _this.loadSpellTemplate(_this.data.productId);
        console.log('执行拼团');
        break;
      case 'product':
        _this.loadProduct(_this.data.productId);
        console.log('执行商品查询');
        break;
      

    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    console.log("====获取用户信息=====")
    console.log(_this.data.userInfo)
    console.log(_this.data.userInfo.avatarUrl)
    console.log(_this.data.userInfo.nickName)
    console.log(_this.data.windowWidth)
    console.log(_this.data.windowHeight)
    console.log("====END=====")
    // 检索是否收藏该商品
    Api.searchCollection(_this.data.productId).then(res => {
      console.log(res);
      if(res.data){
        this.buttom = this.selectComponent('#buttom');// 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
        let myComponent = this.buttom;
        myComponent.settingCollection();// 调用自定义组件中的方法
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var _this = this;
    clearTimeout(countdownClear);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var _this = this;
    clearTimeout(countdownClear);
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
    if (page >= 1 && page <= _this.data.totalPage) {
      page++;
      _this.loadSpellTeamList(_this.data.productId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    console.log(" 用户点击右上角分享");
    //分享的title市店名
    return {
      title: '皖垦',
      imageUrl: _this.data.productCarousel[0],
      path: '/pages/deal_with/deal_with?scene=', // 相对的路径
    }
  },

  /**
   * 加入购物车
   */
  addCart:function(){
    this.buttom = this.selectComponent('#buttom');// 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
    let myComponent = this.buttom;
    myComponent.addCart();// 调用自定义组件中的方法
  },

  /**
   * 监听底部导航栏事件
   */
  listentCart:function(e){
    var _this = this;
    if (e.detail.num == 'buy'){
      wx.showToast({
        title: '我要购买',
        icon: 'none',
      })
      wx.navigateTo({
        url: '/pages/ordering/ordering?id=' + _this.data.product.id,
      })
    } else if (e.detail.num == 'collection'){
      Api.addCollection(_this.data.product.id).then(res => {
        console.log(res);
        wx.showToast({
          title: '添加成功',
          icon: 'none',
        })
      })
    } else if (e.detail.num == 'cancel'){
      Api.cancelCollection(_this.data.product.id).then(res => {
        console.log(res);
        wx.showToast({
          title: '取消成功',
          icon: 'none',
        })
      })
    } else if (e.detail.num == 'cart'){
      wx.showLoading({
        title: '加载中！',
      })
      var _this = this;
      var data = {
        goodsId: _this.data.product.id,
        num: 1
      };
      console.log(_this.data.product.id, data);
      app.addCart(data).then((res) => {
        // navbar.cartNumUp();
        this.buttom = this.selectComponent('#buttom');// 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
        let myComponent = this.buttom;
        myComponent.addCarts();// 调用自定义组件中的方法
        wx.hideLoading();
      })
      console.log(e.detail.num);
    }
  },

  /**
   * 切换商品详情展示
   */
  handleEventListener:function(e) {
    var _this = this;
    _this.setData({
      tabshow: e.detail.num
    })
    console.log(e.detail.num);

  },

  /**
   * 立即购买
   */
  // toordering:function(){
  //   var _this = this;
  //   this.buttom = this.selectComponent('#buttom');// 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
  //   let myComponent = this.buttom;
  //   myComponent.tooredring(1);// 调用自定义组件中的方法
  // },

  /**
   * 加载商品信息
   */
  loadProduct:function(id){
    var _this = this;
    Api.loadProductInt(id).then(res => {
      console.log("商品信息", res);
      _this.setData({
        product: res.data,
        productCarousel: JSON.parse(res.data.image)
      })
    })
  },

  /**
   * 加载拼团模板信息
   */
  loadSpellTemplate:function(id){
    var _this = this;
    Api.loadSpellTemplate(id).then(res => {
      console.log("拼团模板信息", res);
      _this.setData({
        product: res.data,
        productCarousel: JSON.parse(res.data.goods.image)
      })
      _this.loadSpellTeamList(res.data.id);
      // if(res.data.length > 0){
      //   for (let i = 0; i < res.data.length; i++) {
      //     res.data[i].createTime = util.formatDate(res.data[i].createTime, 'all');
      //   }
      // }
    })
  },
  
  /**
   * 加载拼团队伍列表
   */
  loadSpellTeamList:function(id){
    var _this = this;
    var data = {
      templateId: id,
      page: page,
      size: size
    }
    Api.loadSpellTeamList(data).then(res => {
      console.log('拼团队伍列表', res);
      if (res.data.dataList.length > 0){
        // for (let i = 0; i < res.data.dataList.length; i++) {
        //   res.data.dataList[i].createTime = util.formatDate(res.data.dataList[i].createTime, 'all');
        // }
        console.log(res.data.dataList);
        _this.setData({
          spellteam: res.data.dataList,
          totalPage: res.data.totalPages
        })
        _this.countdown();
      }
    })
  },

  /**
   * 拼团倒计时
   */
  countdown:function(){
    var _this = this;
    var teamTimeList = [];
    for (let i = 0; i < _this.data.spellteam.length; i++){
      var dayTime = null;
      var date = new Date();
      var now = date.getTime();
      var endDate = new Date(_this.data.spellteam[i].createTime + _this.data.product.duration);//设置截止时间
      var end = endDate.getTime();
      console.log(end, now, _this.data.spellteam[i].createTime + _this.data.product.duration);
      var leftTime = end - now; //时间差  
      console.log(leftTime);
      var d, h, m, s, ms;
      if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);
        // ms = Math.floor(leftTime % 1000);
        // ms = ms < 100 ? "0" + ms : ms
        s = s < 10 ? "0" + s : s
        m = m < 10 ? "0" + m : m
        h = h < 10 ? "0" + h : h
        dayTime = d + "天-" + h + "时-" + m + "分-" + s + "秒";
        teamTimeList.concat(dayTime);
        //递归每秒调用countTime方法，显示动态时间效果
        countdownClear = setTimeout(_this.countdown, 1000);
      } else {
        console.log('已截止')
        _this.setData({
          countdown: '00:00:00'
        })
      }
    }
    _this.setData({
      spellCountdown: teamTimeList
    })
    console.log(_this.data.teamTimeList);
  },

  /**
   * 秒杀倒计时
   */
  countTime(date) {
    var _this = this;
    var date = new Date();
    var now = date.getTime();
    var endDate = new Date(date);//设置截止时间
    var end = endDate.getTime();
    var leftTime = end - now; //时间差                              
    var d, h, m, s, ms;
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      // ms = Math.floor(leftTime % 1000);
      // ms = ms < 100 ? "0" + ms : ms
      s = s < 10 ? "0" + s : s
      m = m < 10 ? "0" + m : m
      h = h < 10 ? "0" + h : h
      that.setData({
        countdown: d + "天-" + h + "时-" + m + "分-" + s + "秒",// + ms,
      })
      //递归每秒调用countTime方法，显示动态时间效果
      countdownClear = setTimeout(that.countTime, 1000);
    } else {
      console.log('已截止')
      _this.setData({
        countdown: '00:00:00'
      })
    }

  },

  /**
   * 点击分享
   */
  share:function(){
    var _this = this;
    _this.setData({
      shareViewOpen: !_this.data.shareViewOpen
    })
  },

  /**
   * 生成大图分享
   */
  sharePic:function(){
    var _this = this;
  },


    /**
   * 分享事件
   */
  shareImage(event) {
    var _this = this;
    _this.setData({
      portrait_temp:_this.data.userInfo.avatarUrl,
      wxName:_this.data.userInfo.nickName,
      shareViewOpen: !_this.data.shareViewOpen
    })
    //缓存canvas绘制小程序二维码
    _this.drawImage();
    wx.hideLoading();
    setTimeout(function() {
      _this.canvasToImage()
    }, 200)
  },
  drawImage() {
    var _this=this;
    //绘制canvas图片    
    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = _this.data.bgPath
    var portraitPath = _this.data.portrait_temp
    var hostNickname = _this.data.wxName

    var qrPath = _this.data.qrcode_temp
    var windowWidth = _this.data.windowWidth
    _this.setData({
      scale: 1.2
    })
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, _this.data.scale * windowWidth)

    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()
    //绘制第一段文本
    ctx.setFillStyle('#000')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + ' 正在参加疯狂红包活动', windowWidth / 2, 0.52 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('red')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('邀请你一起来领券抢红包啦~', windowWidth / 2, 0.57 * windowWidth)
    //绘制二维码
    ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.75 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
    //绘制第三段文本
    ctx.setFillStyle('green')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码领红包', windowWidth / 2, 1.36 * windowWidth)
    ctx.draw();
  },
  canvasToImage() {
    var _this = this
    console.log()
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: _this.data.windowWidth,
      height: _this.data.windowWidth * _this.data.scale,
      destWidth: _this.data.windowWidth * 4,
      destHeight: _this.data.windowWidth * 4 * _this.data.scale,
      canvasId: 'myCanvas',
      success: function(res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        wx.previewImage({
          current: 'www.ooago.com', // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function(err) {
        console.log('失败')
        console.log(err)
      }
    })
  },

})

