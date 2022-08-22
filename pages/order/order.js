// pages/product_detail/detail.js
import Base from "../../utils/base";
const base = new Base();
// 定义全局变量求飞入购物车图标的横向平移距离
let x = 0;
// 定义全局变量充当购物车
let  cartArr=[];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    btnList: ["商品详情", "产品参数", "售后保障"],
    // 数量可选范围
    arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    num: 1,
    translateStyle: "translate(0px)",
    isFly: false, //控制图片飞
    isScale: false, //控制购物车缩放
    total: 0, //购物车商品总数
    curIndex: 0, //选项卡默认下标
  },

  // 选项卡逻辑
  onTab(e) {
    const index = e.mark.index;
    this.setData({ curIndex: index });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取详情id
    const id = options.id;
    this.data.id = id;
    // 加载详情数据
    this._loadData();
    // 初始化购物车总数
    this.getTotal();
  },
  async _loadData() {
    const detailData = await base.request("product/" + this.data.id);
    this.setData(detailData);
  },
  // picker数量选择
  onNumChange(e) {
    // 拿到选中的数量对应的下标
    const index = e.detail.value;
    this.setData({
      num: this.data.arr[index],
    });
  },

  // 加入购物车
  onAddToCart() {
    // 如果当前有商品在飞，请稍等
    if (this.data.isFly) {
      return;
    }
    this.setData({
      isFly: true,
      isScale: false,
    });
    // 商品飞入购物车效果
    this.flyToCart();
  },
  addCart() {
    // 先尝试从购物车中找这个商品，如果有商品只更新数量，如果没有将商品打包加入购物车
    const pro = cartArr.find((item) => {
      return item.id == this.data.id;
    });
    if (pro) {
      //说明购物车有商品，需要更新数量
      pro.count += this.data.num;
    } else {
      // 购物没有该商品，需要新打包添加
      // 将当前要加入购物车的商品进行打包
      const product = {
        imgSrc: this.data.main_img_url,
        name: this.data.name,
        price: this.data.price,
        id: this.data.id,
        count: this.data.num,
        status: true,
      };
      cartArr.push(product);
    }
    // 更新缓存：将当前购物车存入缓存
    wx.setStorageSync("cart", cartArr);
    // 更新购物车总数
    this.getTotal();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  flyToCart: function () {
    // 平移距离=fixed_box.left - flyImg.left
    const query = wx.createSelectorQuery();
    query.select(".fixed_box").boundingClientRect();
    query.select(".flyImg").boundingClientRect();
    query.exec((res) => {
      // 求元素横向平移距离
      x = res[0].left - res[1].left + (res[0].width / 2 - res[1].width / 2);
      // 求元素纵向平移距离
      let y = res[1].top - res[0].top - (res[0].height / 2 - res[1].height / 2);
      this.setData({
        translateStyle: `translate(${x}px,-${y}px) scale(0.3)`,
      });
      // 飞完之后回归原位
      setTimeout(() => {
        // 将商品添加至购物车
        this.addCart();

        this.setData({
          translateStyle: "translate(0px)",
          isFly: false,
          isScale: true,
        });
      }, 600);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //   从新获取缓存
    cartArr=wx.getStorageSync('cart')||[];

    this.getTotal();
  },

  // 求购物车总数
  getTotal() {
    let total = 0;
    cartArr.forEach((item) => {
      total += item.count;
    });
    this.setData({ total });
  },

  // 跳转购物车页面
  toCart() {
    wx.reLaunch({
      url: "/pages/shopping/shopping",
    });
  },
});
