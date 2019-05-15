// pages/authorize/authorize.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')//获取用户信息是否在当前版本可用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  bindGetUserInfo: function (e) {//点击的“拒绝”或者“允许
    if (e.detail.userInfo) {//点击了“允许”按钮，
      //console.log(e.detail.userInfo);
      //获取openid
      app.globalData.userInfo = e.detail.userInfo;
      wx.redirectTo({
        url: '../first/first',
      })
    }
  }
})
