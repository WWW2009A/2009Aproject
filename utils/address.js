import Base from  "../utils/base"
let base = new Base()
export default class Address {
  // 从服务器获取地址
  async getAddress(){
    let res = await base.request("address","","GET")
    // console.log(res);
    return this._bindAddress(res)
  }
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
  }
  isCenterCity(name){
    let centerCity = ["北京市","上海市","重庆市","天津市"]
    return centerCity.includes(name)
  }
}
