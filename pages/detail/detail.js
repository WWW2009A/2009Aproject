// pages/detail/detail.js
import Base from  "../../utils/base"
let base = new Base()
import Address from "../../utils/address"
let address = new Address()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const id = options.id;
    this.data.id = id
    let addressInfo = await address.getAddress()
    this.setData({addressInfo })
    // 获取订单id
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(this.data.id){
      // 旧订单 从服务器加载旧订单详情
      this.getOrderFromServer(this.data.id)
    }else{
      // 新订单
      this.getOrderData()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  async onAddress(){
    let res = await wx.chooseAddress()
    console.log(res);
    // 将当前选中的地址渲染到页面
    let addressInfo = await address._bindAddress(res)
    this.setData({addressInfo})
    // 将当前选中的地址上传服务器
    base.request("address",{
      name:res.userName,
      mobile:'15124752964',
      province:res.provinceName,
      city:res.cityName,
      country:res.countyName,
      detail:res.detailInfo
    },"POST")
  },
  getOrderData(){
    let cartData = wx.getStorageSync('cart')
    // 筛选要买的商品
    let orderData = cartData.filter((item)=>{
      return item.status
    })
    let shu = 0;
    orderData.filter((item)=>{
      shu+=Math.floor(item.price*100)*item.count
    })
    shu /=100
    console.log();
    this.setData({orderData,shu})
  },
  onPay(){
    if(!this.data.addressInfo){
      this._showTips("下单提示","请填写您的收货地址")
      return
    }
    // 如果是第一次支付则先生成订单再付款 如果不是第一次直接付款
    if(!this.data.id){
       this.createOrder()
    }else{
      this.toPay()
    }
  },
  // 封装函数显示弹窗
  _showTips(title,content){
    wx.showModal({
      cancelColor: 'cancelColor',
      title,
      content,
      showCancel:false
    })
  },
  async toPay(id){
    // const res = await base.request()
    // let res = await base.request("pay/pre_order",{id:id||this.data.id},"POST")
    // wx.requestPayment({
    //   nonceStr: res.nonceStr,
    //   package: res.package,
    //   paySign: res.paySign,
    //   timeStamp: res.timeStamp,
    //   success:(res)=>{
    //     // 支付成功后可以跳转展示支付结果页面
    //   }
    // })
  },
  async createOrder(){
    // 先组装往后台发送的数据
    let products = this.data.orderData.map((item)=>{
      return {
        product_id:item.id,
        count:item.count
      }
    })
    let res = await base.request("order",{products},"post")
    console.log(res);
    if(!res.pass){
      this.orderFail(res)
    }else{
      // let orderInfo = await base.request("pay/pre_order",{id:res.order_id},"POST")
      // console.log(orderInfo);
    }
  },
  orderFail(res){
      // let cai = ""
      // res.pStatusArray.map((item)=>{
      //   // 选出所有缺货的商品
      //   if(!item.haveStock){
      //     cai +=item.name
      //   }
      // })
      let noStocks = res.pStatusArray.filter((item)=>{
        return !item.haveStock
      })
      // 拿到缺货商品的名字
      let nameArr = noStocks.map((item)=>{
        return item.name
      })
      let tips = '';
      if(nameArr.length<=2){
        tips = nameArr.join("、")
      }else{
        tips =nameArr[0]+"、"+nameArr[1]+"等"
      }
      tips+="缺货"
      this._showTips("缺菜",tips)
  },
  // 从服务器加载旧订单
  async getOrderFromServer(id){
    const data = await base.request("order/"+id)
    // 处理订单地址
    const addressInfo = data.snap_address
    console.log(data);
    this.setData({
      orderInfo:{
        createTime:data.create_time,
        orderNo:data.order_no,
        status:data.status,
      },
      orderData:data.snap_items,
      shu:data.total_price,
      addressInfo:address._bindAddress(addressInfo)
    })
  }
})