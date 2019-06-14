// pages/saveAddress/saveAddress.js

var app = getApp();

var coordinate = require('../../utils/coordinate.js');

import Api from '../../utils/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null, // 用户手机导航高度
    array: ['周一至周五', '周六到周日', '时间不限'],
    index: 0,// 收货时间选择
    region: ['', '', ''],
    indexArr: 0,
    UserName: null, //收货人
    phoneNumber: null, // 电话号码
    address: null, // 当期选择地址
    AllAddress: null, //详细地址
    addressNum: null, //门牌号
    judgePhoneNumberFlag: true,// 判断手机号码格式是否正确
    province: null, //省
    city: null, //市
    town: null, // 县or区
    updateFlag: false,// 编辑地址标识
    id: null,// 地址ID
    addressEntity: {},// 需要修改的单条地址信息 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight
    });
    _this.getLocations();
    if(options.id != undefined){
      _this.setData({
        updateFlag: true,
        id: options.id

      })
      _this.queryAddressByID();
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
    console.log("我的查询方法！")
    
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
  onReachBotto : function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取用户当前位置
   */
  getLocations:function(){
    var _this = this;
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          console.log('未授权');
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              console.log(res);
            },
            fail(res) {
              console.log(res);
              wx.showModal({
                title: '授权提醒',
                content: '您当前已关闭位置授权，请点击确认后在设置中打开！',
                showCancel: false,
                success: function(res) {
                  wx.openSetting({
                    success: function (res) {
                      console.log(res.authSetting, res)
                    },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },
                fail: function(res) {

                }
              })
            }
          })
        }else{
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              console.log(res);
              var cood = coordinate.bd09togcj02(parseFloat(res.latitude), parseFloat(res.longitude));
              console.log(cood);
              wx.request({
                url: 'https://api.map.baidu.com/geocoder/v2/',
                data: {
                  location: cood[0] + "," + cood[1],
                  output: 'json',
                  ak: 'iOYBmDKHicYmzZigGIGnurrPf1YMKlEj' // 百度AK
                },
                method: 'GET',
                success: function (res) {
                  _this.data.region[0] = res.data.result.addressComponent.province,
                  _this.data.region[1] = res.data.result.addressComponent.city,
                  _this.data.region[2] = res.data.result.addressComponent.district,
                  _this.setData({
                    region: _this.data.region,
                    province:_this.data.region[0],
                    city:_this.data.region[1],
                    town:_this.data.region[2],
                    AllAddress:_this.data.region[0]+_this.data.region[1]+_this.data.region[2]
                  })
                },
                fail: function (res) {
                  wx.showToast({
                    title: res,
                    icon: 'none',
                  })
                },
              })
            },
            fail: function(res) {

            }
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  /**
   * 根据ID查询地址信息
   */
  queryAddressByID:function(){
    var _this = this;
    Api.SearchAddressById(this.data.id).then(res => {
      console.log(res.data);
      this.setData({
        province: res.data.province, //省
        city: res.data.city, //市
        town: res.data.town, // 县or区
        UserName:res.data.name, //姓名
        phoneNumber:res.data.telephone, //电话
        addressNum: res.data.detailAddress //详细地址
      })

    })
  },

  /**
   * 获取当前收货人姓名
   */
  getUserName: function (e) {
    this.setData({
      UserName: e.detail.value
    })
    // console.log(e.detail.value)
  },


  /**
   * 获取当前输入的电话
   */
  getPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    // console.log(e.detail.value);
  },

  judgePhoneNumber: function (e) {
    if (/0\d{2,3}-\d{7,8}/.test(e.detail.value) || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(e.detail.value)) {
      wx.showToast({
        title: '手机号码有误，请重填',
        icon: 'none',
      });
      this.setData({
        judgePhoneNumberFlag: false
      })
    } else {
      this.setData({
        judgePhoneNumberFlag: true
      })
    }
  },

  /**
   * 选择收货时间
   
  bindPickerChange: function (e) {
    var _this = this;
    console.log(e.detail.value);
    _this.setData({
      indexArr: e.detail.value
    })
  },*/


  /**
   * 选择地址
   */
  // chossAddress: function () {
  //   var _this = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       console.log("成功！", res);
  //       _this.setData({
  //         address: res.name,
  //         AllAddress: res.address
  //       })
  //     },
  //     fail: function (res) {
  //       console.log("失败！", res)
  //     }
  //   })
  // },
  
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      province:e.detail.value[0],
      city:e.detail.value[1],
      town:e.detail.value[2],
      AllAddress:e.detail.value[0]+e.detail.value[1]+e.detail.value[2]
    })
  },

  /**
   * 用户门牌号
   */
  getAddressNum: function (e) {
    var _this = this;
    _this.setData({
      addressNum: e.detail.value
    })
  },

  /**
   * 保存地址
   */
  addAddress: function () {
    console.log(this.data)
    var _this = this;
    if (this.data.UserName != null && this.data.phoneNumber != null && this.data.judgePhoneNumberFlag == true &&this.data.addressNum!=null) {
      // var citys = ["天津市", "北京市", "重庆市", "上海市"];
      // var reg = /.+?(省|市|自治区|自治州|县|区)/g;

      console.log("====================页面显示的参数")
      console.log('收货人：' + this.data.UserName);
      console.log('手机号：' + this.data.phoneNumber);
      console.log('收货时间：' + this.data.region);
      console.log('详细地址：' + this.data.AllAddress);
      console.log('门牌号：' + this.data.addressNum);
      console.log("====================")
      // console.log(this.data.AllAddress.match(reg))
      // console.log(citys.indexOf(this.data.AllAddress.match(reg)[0]))

      /*
      if (citys.indexOf(this.data.AllAddress.match(reg)[0]) == -1) {
        that.setData({
          province: this.data.AllAddress.match(reg)[0],
          city: this.data.AllAddress.match(reg)[1],
          town: this.data.AllAddress.match(reg)[2]
        });
      } else {
        that.setData({
          province: null,
          city: this.data.AllAddress.match(reg)[0],
          town: this.data.AllAddress.match(reg)[1]
        });
      }
      */

      var addressInfo = {
        name: this.data.UserName,
        telephone: this.data.phoneNumber,
        province: this.data.province,
        city: this.data.city,
        town: this.data.town,
        detailAddress: this.data.addressNum
      }
      if(this.data.updateFlag){
        addressInfo.id = this.data.id
      }
      console.log("=========传给后台的参数==========")
      console.log(addressInfo)
      console.log("====================")
      
      if(this.data.updateFlag){
        Api.UpdateAddress(addressInfo).then(res => {
          console.log(res);
        })
      }else{
        Api.AddAddress(addressInfo).then(res => {
          console.log(res);
        })
      }

      wx.redirectTo({
        url: '/pages/addresses/addresses',
      })

    } else {

      wx.showToast({
        title: '请正确填写地址信息',
        icon: 'none',
      })

    }
  },
})