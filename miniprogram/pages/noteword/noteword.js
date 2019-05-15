// miniprogram/pages/noteword/noteword.js
const time = require("../../utils/time.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head:"",
    content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取文本框的值(标题)
  listenerPhoneInput: function (e) {
    this.setData({
      head: e.detail.value
    })
    //console.log(words);
  },
  //获取文本框的值(内容)
  listenercontent: function (e) {
    this.setData({
      content: e.detail.value
    })
    //console.log(words);
  },
  //发布笔记
  publish() {
    wx.showLoading({
      title: '正在保存',
    })
    var that = this
    var ttime = time.formatTime(new Date);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addNote',
      // 传给云函数的参数
      data: {
        id: app.globalData.id,
        content: that.data.content,
        type: 3, //文字
        fileId: [],
        head: that.data.head,
        time: ttime
      },
      success(res) {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '../note/note',
          })
        }, 1500)
      },
      fail: console.error
    });
  }
})