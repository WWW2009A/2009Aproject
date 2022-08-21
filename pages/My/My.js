// pages/My/My.js
import Base from  "../../utils/base"
let base = new Base()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txhide:true,
    hasAddress:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let addressInfo = this.getAddress()
    this.setData({addressInfo})
    this.getAllOrder()
  },
  async getInfo(){
    let res = await wx.getUserProfile({
      desc: '获取您的昵称和头像',
    })
    console.log(res);
    let {avatarUrl,nickName} = res.userInfo
    this.setData({
      thumb:avatarUrl,
      nickname:nickName,
      txhide:false
    })
  },
  async onChoose(){
    let res = await wx.chooseAddress()
    console.log(res);
    // 将当前选中的地址渲染到页面
    let addressInfo =  this._bindAddress(res)
    this.setData({
      addressInfo,
      hasAddress:true
    })
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
  _bindAddress(res){
    // 拼接详细地址
    let province = res.provinceName||res.province,
    city = res.cityName||res.city,
    country=res.countyName||res.country,
    detail=res.detailInfo||res.detail;
    // 先拼接市县街道
    let str = city+country+detail;
    // 在根据是不是直辖市来决定要不要拼接省
    if(!this.isCenterCity(province)){
      str=province+str;
    }
    let addressInfo = {
      name:res.userName||res.name,
      mobile:res.telNumber||res.mobile,
      detailAddress:str
    }
    return addressInfo
    // this.setData({addressInfo})
  },
  isCenterCity(name){
    let centerCity = ["北京市","上海市","重庆市","天津市"]
    return centerCity.includes(name)
  },
  async getAddress(){
    let res = await base.request("address","","GET")
    console.log(res);
    let addressInfo =  this._bindAddress(res)
    this.setData({
      addressInfo,
      hasAddress:true
    })
  },
  async getAllOrder(){
    let res = await base.request("order/by_user",{page:1})
    console.log(res);
    this.setData({orderData:res.data})
  },
  payOrders(e){
    const id = e.mark.id;
    wx.navigateTo({
      url: '/pages/order/order?id='+id,
    })
  }
})