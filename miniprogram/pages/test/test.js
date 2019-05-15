// miniprogram/pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "",
    image: "",
    fileId: ""
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

  //选择图片
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          item: res.tempFilePaths
        })
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0], //选择图片返回的相对路径
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
                name: "123.jpg"
              },
              success(res) {
                //console.log(res.result.fileID);
                that.data.fileId = res.result.fileID
                console.log(that.data.fileId)
                wx.showToast({
                  title: '上传成功',
                  icon: 'success'
                })
                //上传
                wx.cloud.callFunction({
                  // 云函数名称
                  name: 'test',
                  // 传给云函数的参数
                  data: {
                    data: res.result.fileID,
                  },
                  success(res) {
                    console.log(res);
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
  },

  getImage: function(e) {
    var that = this
    const db = wx.cloud.database()
    db.collection('test').get().then(res => {
      console.log(res.data[0].data);
      wx.cloud.getTempFileURL({
        fileList: [{
          fileID: res.data[0].data,
          maxAge: 60 * 60, // one hour
        }]
      }).then(res => {
        // get temp file URL
        console.log(res.fileList);
        this.setData({
          image: res.fileList[0].tempFileURL
        })
      }).catch(error => {
        // handle error
      })
    })
  },
  //获取时间
  gettime(){
    var time = this.gettimeer()
    console.log(time)
  },
  gettimeer() {
    var date = new Date();
    var sign1 = "-";
    var sign2 = ":";
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getSeconds() //秒
    var res = year+sign1+month+sign1+day+hour+sign2+minutes+sign2+seconds
    return res
  }

})