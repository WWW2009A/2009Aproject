// app.js
import Token from "utils/token"
let token = new Token()
App({
  onLaunch(){
    // 先尝试获取令牌
    let tokenStr = wx.getStorageSync('token')
    if(tokenStr){
      token.verifyToke(tokenStr)
    }else{
      // 登录小程序获取身份令牌
      token.getToken()
    }
  }
})