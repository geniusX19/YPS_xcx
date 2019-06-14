// pages/components/navbar/navbar.js

const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName1: String,
    pageName2: String,
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    },
    tit: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    tab: 0
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navH: App.globalData.navHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    //回主页
    toIndex: function () {
      wx.navigateTo({
        url: '/pages/admin/home/index/index'
      })
    },
    //切换
    switchTit: function(e) {
      App.globalData.switchTit = e.currentTarget.dataset.index;
      this.setData({
        tab: e.currentTarget.dataset.index
      })
      console.log(e.currentTarget.dataset.index);
      this.triggerEvent('eventListener', { num: e.currentTarget.dataset.index });
    }
  }
})
