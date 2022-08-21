// components/product/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product: Object,
  },
  options: {
    // 启用样式隔离
    styleIsolation: "shared",
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转商品详情页面
    toDetail() {
      wx.navigateTo({
        url: "/pages/product_detail/detail?id=" + this.data.product.id,
      });
    },
  },
});
