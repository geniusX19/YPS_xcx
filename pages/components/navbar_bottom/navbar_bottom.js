// pages/components/navbar_bottom/navbar_bottom.js

const App = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 0,
    select: 1,
    collection: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 加载购物车商品数量
    cartNumUp:function(e){
      var _this = this;
      _this.setData({
        num: e
      })
    },
    // 增加购物车数量
    addCarts: function () {
      var _this = this;
      console.log('疯狂')
      _this.setData({
        num: App.globalData.shoppingData
      })
    },
    
    addCart:function(){
      var _this = this;
      this.triggerEvent('eventListener', { num: 'cart' });
    },
    // 选中对应tab页
    select:function(e){
      var _this =this;
      _this.setData({
        select: e.currentTarget.dataset.num
      })
    },
    // 前往确认订单页
    tooredring:function(e){
      var _this = this;
      console.log(e);
      this.triggerEvent('eventListener', { num: 'buy' });
    },
    // 设置收藏键默认状态
    settingCollection:function(){
      var _this = this;
      _this.setData({
        collection: true
      })
    },
    // 点击收藏
    collectiion:function(){
      var _this = this;
      if(_this.data.collection){
        _this.setData({
          collection: false
        })
        this.triggerEvent('eventListener', { num: 'cancel' });
      }else{
        _this.setData({
          collection: true
        })
        this.triggerEvent('eventListener', { num: 'collection' });
      }
    },
  }
})
