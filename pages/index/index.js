// index.js
import Base from "../../utils/base";
const base = new Base();
Page({
  onload(){
    this._loadData();
  },
  async _loadData(){
    //加载首页轮播图数据
    const {items:bannerData} = await base.request("banner/1");
    console.log("轮播图数据", bannerData);
    // ②加载精选主题数据
    const themeData = await base.request("theme?ids=1,2,3");
    console.log("主题数据", themeData);
    // ③加载最近新品数据
    const recentData = await base.request("product/recent");
    console.log("最近新品数据", recentData);
    this.setData({
      bannerData,
      themeData,
      recentData,
    });
  },
   // 跳转主题页面
   toTheme(e) {
    // ①获取主题id
    const id = e.mark.id;
    wx.navigateTo({
      url: "/pages/theme/theme?id=" + id,
    });
  },
});

