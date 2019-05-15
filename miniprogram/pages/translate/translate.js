// miniprogram/pages/translate/translate.js
import md5 from '../../utils/md5.js'
const recorderManager = wx.getRecorderManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "res": "",
    "words": "",
    "index": 0,
    "index2": 0,
    "array": ['自动检测', '中文', '英语', '粤语', '文言文', '日语', '韩语', '法语', '西班牙语', '泰语'],
    "array2": ['中文', '英语', '粤语', '文言文', '日语', '韩语', '法语', '西班牙语', '泰语'],
    "language": [
      "aotu",
      "zh",
      "en",
      "yue",
      "wyw",
      "jp",
      "kor",
      "fra",
      "spa",
      "th",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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

  /**
   * 修改翻译语言
   */
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange2(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
  //获取文本框的值
  listenerPhoneInput: function(e) {
    this.setData({
      words: e.detail.value
    })
    //console.log(words);
  },
  //翻译操作
  subReq(e) {

    //var q = CusBase64.CusBASE64.encoder(this.data.words);
    //console.log(q);
    //var q = util.encodeUtf8( this.data.words);
    //console.log(q);
    var q = this.data.words;
    //q = writeUTF(encodeURI(q));
    //console.log(q);
    var f = this.data.language[this.data.index];
    var to = this.data.language[parseInt(this.data.index2) + 1];
    //console.log(this.data.index2 + 1);
    var appid = "20180603000171347";
    var salt = "123";
    var passwd = "I7Egvj9JSqrBPezZYuIi";
    var md5code = md5(appid + q + salt + passwd);
    var url = "https://fanyi-api.baidu.com/api/trans/vip/translate?q=" + q + "&from=" +
      f + "&to=" + to + "&appid=" + appid + "&salt=" + salt + "&sign=" + md5code;
    //console.log(url);
    url = encodeURI(url);
    var that = this;
    wx.request({
      url: url,
      data: {},
      success(res) {
        //console.log(res.data)
        if (res.data && res.data.trans_result) {
          that.setData({
            res: res.data.trans_result[0].dst
          })
        } else {
          //reject({ status: 'error', msg: '翻译失败' })
          wx.showToast({
            title: '翻译失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        reject({
          status: 'error',
          msg: '翻译失败'
        })
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  //图片拍照翻译
  //选择图片
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // that.setData({
        //   item: res.tempFilePaths
        // })
        wx.showLoading({
          title: '解析中',
        })
        const tempFilePaths = res.tempFilePaths;
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // that.setData({
            //   //base64: res.data

            // })
            //console.log(res.data)
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.6162525ae4d2c40f87e363cb75d7b721.2592000.1558927092.282335-16124070', // 仅为示例，并非真实的接口地址
              method: 'POST',

              data: {
                image: res.data,
                //language_type:"CHN_ENG"
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res) {
                //console.log(res.data);
                if (res.data.words_result[0]) {
                  wx.showToast({
                    title: '解析成功',
                  })
                  that.setData({
                    words: res.data.words_result[0].words
                  })
                } else {
                  wx.showToast({
                    title: '解析失败',
                    icon: 'none'
                  })
                  that.setData({
                    words: ""
                  })
                }
                wx.hideLoading();
              }
            })
          }
        })

      }
    })
  },

  // chooseSound(e) {
  //   wx.showToast({
  //     title: '敬请期待',
  //     duration: 2000,
  //     icon:"none"
  //   })
  // }

  //语音翻译
  chooseSound(e) {
    // const options = {
    //   duration: 60000,
    //   sampleRate: 16000,
    //   numberOfChannels: 1,
    //   format: 'mp3',
    //   frameSize: 50
    // }
    // recorderManager.start(options);
    wx.showToast({
      title: '敬请期待',
      icon:'none'
    })
  },
  //停止录音
  // soundEnd(e) {
  //   var length = 0;
  //   var tempFilePath = "";
  //   recorderManager.stop();
  //   recorderManager.onStop((res) => {
  //     console.log('停止录音', res.tempFilePath);
  //     tempFilePath = res.tempFilePath;
  //     //录音文件编码
  //     wx.getFileSystemManager().readFile({
  //       filePath: res.tempFilePath, //选择图片返回的相对路径
  //       encoding: 'binary', //编码格式
  //       success: res => { //成功的回调
  //         console.log(res.data);
  //         wx.cloud.callFunction({
  //           // 云函数名称
  //           name: 'uploadFile',
  //           // 传给云函数的参数
  //           data: {
  //             data: res.data,
  //             name: "temp.mp3",
  //           },
  //           success(res) {
  //             //console.log(res);
  //             //that.data.imagesId.push(res.result.fileID);
  //             //获取真实地址
  //             wx.cloud.getTempFileURL({
  //               fileList: [{
  //                 fileID: res.result.fileID,
  //                 maxAge: 60 * 60, // one hour
  //               }]
  //             }).then(res => {
  //               // get temp file URL
  //               console.log(res);
  //               //翻译
  //               wx.request({
  //                 url: 'http://localhost:8090/getWord/getRes', // 仅为示例，并非真实的接口地址
  //                 method: 'POST',
  //                 data: {
  //                   resource: res.fileList[0].tempFileURL
  //                 },
  //                 header: {
  //                   'Content-Type': 'application/x-www-form-urlencoded' // 默认值
  //                 },
  //                 success(res) {
  //                   console.log(res.data);
  //                 }
  //               })
  //               // that.data.images.push(res.fileList[0].tempFileURL)
  //               // that.data.voice = res.fileList[0].tempFileURL
  //             }).catch(error => {
  //               // handle error
  //             })
  //           },
  //           fail: console.error
  //         });
  //         // console.log(res.data.length);
  //       }
  //     })
  //   })
  // }
})