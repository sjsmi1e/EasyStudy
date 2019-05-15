//index.js
//获取应用实例
var app = getApp()
const jinrishici = require('../../utils/jinrishici.js')
Page({
  data: {
    /**
     * 页面配置
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    time: '',
    image: '',
    engword: '',
    chnword: '',
    myword: '',
    voide: '',
    poem: {},
    daka: ""
  },
  onLoad: function (option) {
    if (option.daka == 'true') {
      wx.showToast({
        title: '记得打卡哦',
        icon: 'none'
      })
    }
    var that = this;
    this.get();
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /**
   * 滑动切换tab
   */
  bindChange: function (e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current == 0 && that.data.time == '') {
      that.get();
    }
    if (e.detail.current == 1) {
      that.get2();
    }

  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current == 0 && that.data.time == '') {
        that.get();
      }
      if (e.target.dataset.current == 1) {
        that.get2();
      }
    }
  },
  //获取每日英语
  get() {
    var that = this;
    var url = "http://open.iciba.com/dsapi/";
    wx.cloud.callFunction({
      // 云函数名称
      name: 'http',
      // 传给云函数的参数
      data: {
        url: url
      },
      success(res) {
        //console.log(res.result);
        that.setData({
          time: res.result.dateline,
          engword: res.result.content,
          chnword: res.result.note,
          image: res.result.picture2,
          voide: res.result.tts,
          myword: res.result.translation
        })
      },
      fail: console.error
    });
  },
  //不妨英语mp3
  play: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.innerAudioContext.src = this.data.voide; // 这里可以是录音的临时路径
    this.innerAudioContext.play()
  },

  //获取每日诗词
  get2() {
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      //console.log(result)
      this.setData({ poem: result.data })
    })
  }
})