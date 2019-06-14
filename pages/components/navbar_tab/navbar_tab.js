// pages/components/navbar_tab/navbar_tab.js

// const App = getApp();

// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {

//   },

//   /**
//    * 组件的初始数据
//    */
//   data: {
//     num: 0,
//     select: 1
//   },
//   lifetimes: {
//     attached: function () {
//       this.setData({
//         navH: App.globalData.navHeight
//       })
//     }
//   },

//   /**
//    * 组件的方法列表
//    */
//   methods: {
//     // 加载购物车商品数量
//     cartNumUp: function (e) {
//       var _this = this;
//       _this.setData({
//         num: e
//       })
//     },
//     // 选中对应tab页
//     select: function (e) {
//       var _this = this;
//       _this.setData({
//         select: e.currentTarget.dataset.num
//       })
//     }
//   }
// })


const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

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
  }
})
