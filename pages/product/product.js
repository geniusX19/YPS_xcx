// pages/product/product.js

const app = getApp();

var util = require("../../utils/util.js");

//引入页面api
import Api from '../../utils/api';

var page = 1; // 页码
var size = 10; // 页面加载条数
var countdownClear = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    navTitName: null, // 顶部导航栏名称
    loadFlag: '', // 加载页面商品信息标识
    tabshow: 0, // 用于控制切换商品和详情
    countdown: '', // 秒杀倒计时
    spellCountdown: [], // 拼团倒计时
    productId: null, // 所需加载商品的id
    totalPage: null, // 当前页面数据总页数
    product: {}, // 页面商品信息
    productCarousel: [], // 商品轮播
    shareViewOpen: false, // 分享框显示标识
    showDialog: false, // 分享大图视图框
    percentage: 0, //已抢占百分比,
    numTotal: 0, //总条数
    popupSpell: false, //展示全部拼团订单 最多为10条
    imgUrls: {
      url: 'https://yipeisong.oss-cn-hangzhou.aliyuncs.com/wanken/product/%E5%9B%BE%E5%B1%82%20160%402x.png'
    },
    userInfo: {}, //用户信息
    portrait_temp: null, //头像
    wxName: null, //昵称
    _productImg: null, //商品图片
    bgPath: '/imgs/background.png', //背景
    qrcode_temp: '/imgs/qr.png', //二维码
    windowWidth: 320,
    windowHeight: 560,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight, // 获取顶部导航栏高度
      userInfo: app.globalData.userInfo,
      // windowWidth: wx.getSystemInfoSync().windowWidth,
      // windowHeight: wx.getSystemInfoSync().windowHeight,
    })

    // 获取头像到本地 ，做分享绘制图片用（网络图片无法绘制）
    wx.downloadFile({
      url: _this.data.userInfo.avatarUrl,
      success(res) {
        if (res.statusCode === 200) {
          console.log("=====看看头像图片下载到本地打印的是啥???======")
          console.log(res)
          let image = res.tempFilePath
          console.log(image)
          _this.setData({
            portrait_temp: image
          })
        }
      }
    })


    wx.getSystemInfo({
      success(res) {
        // _this.setData({
        //   windowWidth:res.windowWidth,
        //   windowHeight:res.windowHeight,
        // })
      }
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
    if (options.id != undefined) {
      _this.setData({
        productId: options.id //goodsId
      })
    }
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
    console.log(_this.data.loadFlag)
    if (_this.data.loadFlag == 'product') {
      this.buttom = this.selectComponent('#buttom'); // 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
      let myComponent = this.buttom;
      myComponent.cartNumUp(app.globalData.shoppingData); // 调用自定义组件中的方法
    }
    //console.log('页面加载所需要的id', _this.data.productId, _this.data.loadFlag)
    switch (_this.data.loadFlag) {
      case 'spell':

      case 'limit':
        _this.loadSpellTemplate(_this.data.productId);
        console.log('秒杀');
        break;
      case 'product':
        _this.loadProduct(_this.data.productId);
        console.log('执行商品查询');
        break;
    }
    // console.log("====获取用户信息=====")
    // console.log(_this.data.userInfo)
    // console.log(_this.data.userInfo.avatarUrl)
    // console.log(_this.data.userInfo.nickName)
    // console.log(_this.data.windowWidth)
    // console.log(_this.data.windowHeight)
    // console.log("====END=====")
    // 检索是否收藏该商品
    Api.searchCollection(_this.data.productId).then(res => {
      console.log(res);
      if (res.data) {
        this.buttom = this.selectComponent('#buttom'); // 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
        let myComponent = this.buttom;
        myComponent.settingCollection(); // 调用自定义组件中的方法
      }
    })
    
    _this.getQRcode();
  },


  /**
   * 生命周期函数--监听页面显示
   */

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
  addCart: function () {
    this.buttom = this.selectComponent('#buttom'); // 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
    let myComponent = this.buttom;
    myComponent.addCart(); // 调用自定义组件中的方法
  },

  /**
   * 监听底部导航栏事件
   */
  listentCart: function (e) {
    var _this = this;
    if (e.detail.num == 'buy') {
      wx.showToast({
        title: '我要购买',
        icon: 'none',
      })
      wx.navigateTo({
        url: '/pages/ordering/ordering?id=' + _this.data.product.id,
      })
    } else if (e.detail.num == 'collection') {
      Api.addCollection(_this.data.product.id).then(res => {
        console.log(res);
        wx.showToast({
          title: '添加成功',
          icon: 'none',
        })
      })
    } else if (e.detail.num == 'cancel') {
      Api.cancelCollection(_this.data.product.id).then(res => {
        console.log(res);
        wx.showToast({
          title: '取消成功',
          icon: 'none',
        })
      })
    } else if (e.detail.num == 'cart') {
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
        this.buttom = this.selectComponent('#buttom'); // 页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象
        let myComponent = this.buttom;
        myComponent.addCarts(); // 调用自定义组件中的方法
        wx.hideLoading();
      })
      console.log(e.detail.num);
    }
  },

  /**
   * 切换商品详情展示
   */
  handleEventListener: function (e) {
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
  loadProduct: function (id) {
    var _this = this;
    Api.loadProductInt(id).then(res => {
      console.log("商品信息", res);
      _this.setData({
        product: res.data,
        productCarousel: JSON.parse(res.data.image),
      })

      //下载商品图片到本地（网络图片canvas无法绘制）
      wx.downloadFile({
        url: JSON.parse(res.data.image)[0],
        success: (res) => {
          console.log("===========商品图片的请求地址长啥样????==============")
          console.log(res)
          _this.setData({
            _productImg: res.tempFilePath
          })
        },
      });
    })
  },

  /**
   * 加载拼团模板信息
   */
  loadSpellTemplate: function (id) {
    var _this = this;
    Api.loadSpellTemplate(id).then(res => {
      console.log("拼团模板信息", res);
      let percentage = res.data.goods.saleCount == 0 ? 0 : parseInt((res.data.goods.saleCount / res.data.goods.stockCount) * 100);
      _this.setData({
        product: res.data,
        productCarousel: JSON.parse(res.data.goods.image),
        percentage: percentage
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
  loadSpellTeamList: function (id) {
    var _this = this;
    var data = {
      templateId: id,
      page: page,
      size: size
    }
    Api.loadSpellTeamList(data).then(res => {
      console.log('拼团队伍列表', res);
      if (res.data.dataList.length > 0) {
        // for (let i = 0; i < res.data.dataList.length; i++) {
        //   res.data.dataList[i].createTime = util.formatDate(res.data.dataList[i].createTime, 'all');
        // }
        // console.log(res.data.dataList);
        _this.setData({
          spellteam: res.data.dataList,
          totalPage: res.data.totalPages,
          numTotal: res.data.numTotal, //总条数
        })
        countdownClear = setInterval(function () {
          _this.countdown();
        }, 1000);
      }
      if (_this.data.loadFlag == "limit") { //秒杀执行倒计时
        countdownClear = setInterval(function () {
          _this.countTime()
        }, 1000);
      }
    })
  },

  /**
   * 拼团倒计时
   */
  countdown: function () {
    var _this = this;
    var teamTimeList = [];
    for (let i = 0; i < _this.data.spellteam.length; i++) {
      var dayTime = null;
      var date = new Date();
      var now = date.getTime();
      var endDate = new Date(_this.data.spellteam[i].createTime + _this.data.product.duration); //设置截止时间
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
        dayTime = d + ":" + h + ":" + m + ":" + s;
        // console.log(dayTime);
        teamTimeList.push(dayTime);
        //递归每秒调用countTime方法，显示动态时间效果
      } else {
        //console.log('已截止')
        _this.setData({
          countdown: '00:00:00'
        })
        wx.showToast({
          title: '拼团已结束',
          icon: 'none',
        })
        wx.navigateBack({
          delta: 1,
        })

      }
      //console.log(teamTimeList);
    }
    _this.setData({
      spellCountdown: teamTimeList
    })
    // console.log(_this.data.spellCountdown);
  },

  /**
   * 秒杀倒计时
   */
  countTime() {
    var _this = this;
    var date = new Date();
    var now = date.getTime();
    var endDate = new Date(_this.data.product.endTime); //设置截止时间
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
      _this.setData({
        countdown: d + ":" + h + ":" + m + ":" + s, // + ms,
      })
      //递归每秒调用countTime方法，显示动态时间效果
      //countdownClear = setTimeout(_this.countTime, 1000);
    } else {
      _this.setData({
        countdown: '00:00:00'
      })
      wx.showToast({
        title: '秒杀已结束',
        icon: 'none',
      })
      wx.navigateBack({
        delta: 1,
      })

    }

  },

  /**
   * 点击分享
   */
  share: function () {
    var _this = this;
    _this.setData({
      shareViewOpen: !_this.data.shareViewOpen
    })
  },

  /**
   * 生成大图分享
   */
  sharePic: function () {
    var _this = this;

  },

  /**
   * 拼团支付
   */
  tospellPay: function () {
    //  console.log(this.data.product)
    //   return;
    wx.navigateTo({
      url: '/pages/spellOrdering/spellOrdering?id=' + this.data.product.id + "&goodsId=" + this.data.product.goodsId + "&isAddGroup=false",
    })
  },

  //秒杀立即购买
  spikePay: function () {
    //  console.log(this.data.product)
    //   return;
    wx.navigateTo({
      url: '/pages/spellOrdering/spellOrdering?id=' + this.data.product.id + "&goodsId=" + this.data.product.goodsId + "&isAddGroup=false",
    })
  },


  /**
   * 分享事件
   */
  shareImage(event) {
    var _this = this;
    _this.setData({
      // portrait_temp: _this.data.userInfo.avatarUrl,
      wxName: _this.data.userInfo.nickName,
      shareViewOpen: !_this.data.shareViewOpen
    })
    //缓存canvas绘制小程序二维码
    _this.drawImage();
    wx.hideLoading();
    setTimeout(function () {
      _this.canvasToImage()
    }, 200)

    console.log(_this.data.productCarousel)
  },
  drawImage() {
    var _this = this;
    //绘制canvas图片    
    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = _this.data.bgPath
    // var portraitPath = _this.data.portrait_temp
    var hostNickname = _this.data.wxName
    var productImg = _this.data._productImg
    var _spPrice = _this.data.product.price
    var _spName = _this.data.product.title

    var qrPath = _this.data.qrcode_temp
    var w = _this.data.windowWidth
    var h = _this.data.windowHeight
    _this.setData({
      scale: 1.78
    })
    //绘制背景图片
    ctx.drawImage(bgPath, w * 0.025, h * 0.025, w * 0.95, h * 0.95)

    //生成头像/logo     
    ctx.save()
    ctx.arc(w * 0.2, h * 0.16, 35, 0, 2 * Math.PI)
    ctx.setFillStyle('#AFAFAF') //AFAFAF
    ctx.fill()
    ctx.clip()
    ctx.drawImage(_this.data.portrait_temp, w * 0.090, h * 0.096, 70, 70)
    ctx.restore()
    console.log("=======-----------------------======" + _this.data.portrait_temp)
    //生成用户ID 微信名
    ctx.setFillStyle('#999999')
    ctx.setFontSize(12)
    ctx.setTextAlign('left')
    ctx.fillText(hostNickname, w * 0.36, h * 0.14)
    console.log("=======-----------------------======" + hostNickname)
    // 文字
    ctx.setFillStyle('#000000')
    ctx.setFontSize(16)
    ctx.setTextAlign('left')
    ctx.fillText('喜欢的好物，分享给你', w * 0.36, h * 0.19)

    //生成商品图片
    ctx.drawImage(productImg, w * 0.1, h * 0.25, w * 0.8, h * 0.47)
    console.log("=======-----------------------======" + productImg)

    //商品名称
    ctx.setFillStyle('#666666')
    ctx.setFontSize(14)
    ctx.setTextAlign('left')
    ctx.fillText(_spName, w * 0.1, h * 0.78)
    console.log("=======-----------------------======" + _spName)

    //商品价格
    ctx.setFillStyle('#41BA53')
    ctx.setFontSize(24)
    ctx.setTextAlign('left')
    ctx.fillText("￥" + _spPrice, w * 0.1, h * 0.84)

    //绘制二维码
    ctx.drawImage(qrPath, w * 0.615, h * 0.75, 80, 80)
    console.log("=======-----------------------======" + qrPath)
    //点击识别查看商品
    ctx.setFillStyle('#666666')
    ctx.setFontSize(12)
    ctx.setTextAlign('center')
    ctx.fillText('长按识别查看商品', w * 0.72, h * 0.92)

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
      success: function (res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        wx.previewImage({
          current: 'www.ooago.com', // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function (err) {
        console.log('失败')
        console.log(err)
      }

    })
  },

  //展示全部的拼团订单最多10条
  showSpellListClick() {
    let _this = this;
    _this.setData({
      popupSpell: true
    })
  },

  //关闭全部的拼团订单最多10条
  hideSpellListClick() {
    let _this = this;
    _this.setData({
      popupSpell: false
    })
  },

  //获取二维码从后台
  getQRcode: function () {
    var _this = this;
    var _data = {
      goodsId: _this.options.id, //商品ID
      scene: _this.options.flag, //从哪里进入详情 0=热销，1=拼团，2=秒杀，3=会员
    } //自定义参数(用于扫码读取)

    console.log("QRcode需要传给后台的参数======")
    console.log(_data)
    console.log("QRcode需要传给后台的参数====END==")

    //生成小程序二维码分享
    wx.request({
      url: 'https://peter.xiaomiqiu.com/api/common/wx/create/mini/code',
      data: _data,
      header: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + wx.getStorageSync("third_Session").accessToken
      },
      method: 'POST',
      success: (res) => {
        console.log("==========QRcode")
        console.log(res.data.data)

        // 下载 ，做分享绘制图片用（网络图片无法绘制）
        wx.downloadFile({
          url: res.data.data,
          success(res) {
            if (res.statusCode === 200) {
              console.log("=====看看QRcode下载到本地打印的是啥???======")
              console.log(res)
              let image = res.tempFilePath
              console.log(image)

              _this.setData({
                qrcode_temp: image
              })
            }
          }
        })
      },
    });

  },

})