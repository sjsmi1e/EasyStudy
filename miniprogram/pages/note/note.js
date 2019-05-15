// miniprogram/pages/note/note.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    notes: [],
    types: ['', '../../images/index/pic.png', '../../images/index/voice2.png', '../../images/index/addword.png', '../../images/index/picword.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    const db = wx.cloud.database()
    db.collection('user_notes').where({
      user_id: app.globalData.id, // 填入当前用户 openid
    }).get({
      success(res) {
        console.log(res.data);
        that.setData({
          notes: res.data
        })
        wx.hideLoading();
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
  writeNote: function() {
    this.setData({
      hiddenmodalput: false
    })
  },
  //确定
  confirm: function() {
    this.setData({
      hiddenmodalput: true
    })
  },
  toNoteImage: function() {
    wx.navigateTo({
      url: '../noteimage/noteimage',
    })
  },
  toNoteVoice: function () {
    wx.navigateTo({
      url: '../noteVoice/noteVoice',
    })
  },
  //删除笔记
  delNote(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.showLoading({
            title: '正在删除',
          })

          console.log(e.currentTarget.dataset.id);
          console.log(e.currentTarget.dataset.index);
          //调用云函数删除数据库
          wx.cloud.callFunction({
            // 云函数名称
            name: 'delNote',
            // 传给云函数的参数
            data: {
              id: e.currentTarget.dataset.id
            },
            success(res) {
              console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
              })
              that.data.notes.splice(e.currentTarget.dataset.index, 1);
              that.setData({
                notes: that.data.notes
              })
            },
            fail: console.error
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获取详情页
  getDetail(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../noteDetail/noteDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  //文字页
  toNoteWord(){
    wx.navigateTo({
      url: '../noteword/noteword',
    })
  },
  toNoteImageAndWord(){
    wx.navigateTo({
      url: '../noteWordAndImage/noteWordAndImage',
    })
  }
})