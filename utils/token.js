import Base from  "../utils/base"
let base = new Base()
class Token {
  getToken(){
    wx.login({
      success: async (res) => {
        let data = await base.request("token/user",{code:res.code},"POST")
        wx.setStorageSync('token', data.token)
      }
    })
  }
  // 验证令牌
  async verifyToke(token){
    let res = await base.request("token/verify",{token},"POST")
    if(!res.isValid){
      // 令牌无效重新获取
      this.getToken()
    }
  } 
}

export default Token;