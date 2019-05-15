// miniprogram/pages/noteVoice/noteVoice.js
const recorderManager = wx.getRecorderManager();
const time = require("../../utils/time.js");
const uuid = require("../../utils/uuid.js")
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voiceTP: "",
    head: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  chooseSound(e) {
    const options = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
  },
  //停止录音
  soundEnd(e) {
    var that = this;
    var length = 0;
    var tempFilePath = "";
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath);
      that.setData({
        voiceTP: res.tempFilePath
      })
    })
  },
  //播放录音
  playVoice() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.voiceTP
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  //获取文本框的值(标题)
  listenerPhoneInput: function(e) {
    this.setData({
      head: e.detail.value
    })
    //console.log(words);
  },
  //发布
  //发布笔记
  publish() {
    wx.showLoading({
      title: '正在保存',
    })
    var that = this
    //console.log(this.data.head);
    var ttime = time.formatTime(new Date);
    var uid = uuid.guid();
    //开始上传录音
    //录音base64编码
    wx.getFileSystemManager().readFile({
      filePath: that.data.voiceTP,
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        //console.log(res.data)
        //调用云函数上传图片
        wx.cloud.callFunction({
          // 云函数名称
          name: 'uploadFile',
          // 传给云函数的参数
          data: {
            data: res.data,
            name: uid +".mp3",
          },
          success(res) {
            console.log(res);
            var ttvoice = []
            ttvoice.push(res.result.fileID)
            wx.cloud.callFunction({
              // 云函数名称
              name: 'addNote',
              // 传给云函数的参数
              data: {
                id: app.globalData.id,
                content: "",
                type: 2, //语音
                fileId: ttvoice,
                head: that.data.head,
                time: ttime
              },
              success(res) {
                wx.hideLoading();
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                });
                setTimeout(function() {
                  wx.navigateTo({
                    url: '../note/note',
                  })
                }, 1500)
              },
              fail: console.error
            });

          },
          fail: console.error
        });
      }
    })
  }
})