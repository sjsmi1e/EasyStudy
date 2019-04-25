//index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    avatarUrl: "",
    nick:"",
    time:"",
    //userInfo: app.globalData.userInfo,
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onLoad: function() {
    var that = this;
    //console.log("index:" + app.globalData.avatarUrl);
    app.getAuthKey().then(function (res) {
      //console.log(res);
      if (res.status == 200) {
        //var auth_key = res.data;
        console.log("index:"+app.globalData.avatarUrl);
        //var time = util.formatTime(new Date());
        that.setData({
          avatarUrl: app.globalData.avatarUrl,
          nick: app.globalData.nick,
          time: util.formatTime(new Date())
        })
      } else {
        console.log(res.data);
      }
    });
    //console.log("index:"+app.globalData.avatarUrl);
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function() {
    // 调用云函数
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     console.log('[云函数] [login] user openid: ', res.result.openid)
    //     app.globalData.openid = res.result.openid
    //     wx.navigateTo({
    //       url: '../userConsole/userConsole',
    //     })
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //     wx.navigateTo({
    //       url: '../deployFunctions/deployFunctions',
    //     })
    //   }
    // })
    
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
