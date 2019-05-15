// miniprogram/pages/noteDetail/noteDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: "",
    time: "",
    content: "",
    id:"",
    images:[],
    voice:"",
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      id: options.id 
    })
    const db = wx.cloud.database()
    db.collection('user_notes').where({
      _id: options.id // 填入当前用户 openid
    }).get({
      success(res) {
        // console.log("res.data[0].fileId:")
        // console.log(res.data[0].fileId)
        for (let i = 0; i < res.data[0].fileId.length;i++){
          wx.cloud.getTempFileURL({
            fileList: [{
              fileID: res.data[0].fileId[i],
              maxAge: 60 * 60, // one hour
            }]
          }).then(res => {
            // get temp file URL
            console.log(res);
            // that.setData({
            //   images: that.data.images.push(res.fileList[0].tempFileURL) 
            // })
            that.data.images.push(res.fileList[0].tempFileURL)
            that.data.voice = res.fileList[0].tempFileURL
            //console.log("this.data.images:")
            //console.log(this.data.images)
          }).catch(error => {
            // handle error
          })
        }

        that.setData({
          head: res.data[0].head,
          time: res.data[0].time,
          content: res.data[0].content,
          images: res.data[0].fileId,
          type: res.data[0].type,
        })
        console.log(that.data.voice)
      }
    })
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
    // //分享笔记
  onShareAppMessage: function (e) {
    console.log('开始转发')
    let that = this;
    return {
      title: that.data.head, // 转发后 所显示的title
      path: '/pages/noteDetail/noteDetail?id=' + that.data.id, // 相对的路径
      success: (res) => {    // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //播放录音
  playVoice(){
    console.log(this.data.voice)
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.voice
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})