//base.js
class Base {
  constructor() {
    this.baseUrl = "http://localhost/zerg/public/index.php/api/v1/";
    // this.baseUrl = "http://192.168.34.189/zerg/public/index.php/api/v1/";
  }
  request(url, data = {}, method = "GET") {
    return new Promise((reslove, reject) => {
      wx.request({
        url: this.baseUrl + url,
        data,
        method,
        header:{
          "content-type":'application/json',
          token:wx.getStorageSync('token')
        },
        success: (res) => {
          const code = res.statusCode.toString();
          if (code.startsWith("2")) {
            reslove(res.data);
          } else {
            reject(code);
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }
}

export default Base;
