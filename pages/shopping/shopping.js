// pages/cart/cart.js
// 从缓存取购物车数据
let cartData = wx.getStorageSync("cart");
Page({
  data: {
    cartData,
    isDisabled: false, //控制减按钮是否禁用
    all:"/img/icon/all.png",
    allSelected:"/img/icon/all@selected.png",
    isAllSelected:false,
  },
  onShow() {
    cartData = wx.getStorageSync("cart");
    this.setData({ cartData });
    // 初始化全选状态
    this.getAllStatus();
    // 初始化商品总数和总价
    this.getTotal();
  },

  onChange(e) {
    // 拿到当前要操作的商品id,以及操作类型
    const { id, type } = e.detail;
    // 根据id在购物车中找商品
    const product = cartData.find((item) => {
      return item.id == id;
    });
    // 更新商品数量
    if (type == "add") {
      product.count++;
    } else if (type == "cut") {
      product.count--;
      if (product.count < 1) {
        product.count = 1;
      }
    } else if (type == "select") {
      // 更新商品状态
      product.status = !product.status;
    }
    // 更新页面
    this.setData({
      cartData,
    });
    // 更新缓存
    wx.setStorageSync("cart", cartData);
    // 更新总数总价
    this.getTotal()
    if(type=="select") this.getAllStatus();
  },

  // 删除操作
  onDel(e) {
    // 取当前要删除商品的id
    const id = e.detail.id;
    // 在购物车中找当前商品对应的下标
    const index = cartData.findIndex((item) => {
      return item.id == id;
    });
    //从购物车中把该下标对应的商品删掉
    cartData.splice(index, 1);
    // 更新页面
    this.setData({ cartData });
    // 更新缓存
    wx.setStorageSync("cart", cartData);
    // 更新数量
    this.getTotal();
  },


//   判断多选按钮是否被选中
  getAllStatus(){
    // 判断购物车（缓存）中是否所有商品都是被选中的
    const isAllSelected=cartData.every((item)=>{
        return item.status;
    })
    this.setData({isAllSelected});
  },

//   求商品总数和总价
  getTotal(){
    //  想获取所有要买的商品
    const  selectedDate=cartData.filter(item=>{
        return item.status;
    });
    let totalNum=0;
    let totalPrice=0;
    selectedDate.forEach((item)=>{
        totalNum+=item.count;
        totalPrice+=Math.floor(item.price*100)*item.count;
    });
    this.setData({
        totalNum,
        totalPrice:totalPrice/100,
    })
  },
//      全选按钮点击
    onAllSelect(){
    // 点击对当前全选状态取反
    const allStatus=!this.data.isAllSelected;
    // 所有商品的状态要跟全选状态保持一直
    cartData.forEach(item=>{
        item.status=allStatus;
    });
    this.setData({
        isAllSelected:allStatus,
        cartData,
    })
    // 更新缓存
    wx.setStorageSync('cart', cartData);
    // 更新商品总数
    this.getTotal();
  },

//   跳转订单页面
  toOrder(){
      wx.reLaunch({
        url: '/pages/detail/detail?totalPrice='+this.data.totalPrice,
      })
  }

});
