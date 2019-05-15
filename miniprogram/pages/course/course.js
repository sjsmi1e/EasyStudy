// miniprogram/pages/course/course.js
const app = getApp()
const db = wx.cloud.database()
const time = require("../../utils/time.js")
const week = ['mon', 'tue', 'wed', 'thr', 'fri', 'sat', 'sun']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    x: -1,
    y: -1,
    addCon: {
      time: "",
      course: "",
      addr: "",
      teacher: "",
    },
    resCourse: [{
        message: []
      },
      {
        message: []
      },
      {
        message: []
      },
      {
        message: []
      },
      {
        message: []
      },
      {
        message: []
      },
      {
        message: []
      },
      {
        message: []
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在加载课表',
    })
    var that = this;
    db.collection("user_course").where({
      user_id: app.globalData.id
    }).get({
      success(res) {
        //console.log(res.data);
        that.setData({
          'resCourse[0].message': res.data[0].one,
          'resCourse[1].message': res.data[0].tow,
          'resCourse[2].message': res.data[0].three,
          'resCourse[3].message': res.data[0].four,
          'resCourse[4].message': res.data[0].five,
          'resCourse[5].message': res.data[0].six,
          'resCourse[6].message': res.data[0].seven,
          'resCourse[7].message': res.data[0].eight
        })
        wx.hideLoading()
      }
    })
    //console.log(this.data.resCourse);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function(e) {
    //console.log(e);
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      x: e.currentTarget.dataset.x,
      y: e.currentTarget.dataset.y
    })
    //console.log(this.data);
  },
  //取消按钮  
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function() {
    var that = this;
    this.setData({
      hiddenmodalput: true
    })
    //新增课程数据库
    db.collection("user_course").where({
      user_id: app.globalData.id
    }).get({
      success(res) {
        console.log(res);
        var temp = res.data[0];
        switch (that.data.x) {
          case 0:
            temp.one[that.data.y] = that.data.addCon;
            break;
          case 1:
            temp.two[that.data.y] = that.data.addCon;
            break;
          case 2:
            temp.three[that.data.y] = that.data.addCon;
            break;
          case 3:
            temp.four[that.data.y] = that.data.addCon;
            break;
          case 4:
            temp.five[that.data.y] = that.data.addCon;
            break;
          case 5:
            temp.six[that.data.y] = that.data.addCon;
            break;
          case 6:
            temp.seven[that.data.y] = that.data.addCon;
            break;
          case 7:
            temp.eight[that.data.y] = that.data.addCon;
            break;
        }
        that.setData({
          coursedata: res
        })
        //调用云函数增加数据
        wx.cloud.callFunction({
          // 云函数名称
          name: 'addCourse2',
          // 传给云函数的参数
          data: {
            rest: that.data.coursedata
          },
          success(res) {
            //console.log(res);
            that.onLoad();
          },
          fail: console.error
        });
      }
    })
  },
  //获取时间
  // getTime: function(e) {
  //   this.setData({
  //     'addCon.time': e.detail.value,
  //   })
  // },
  //获取课程
  getCour: function(e) {
    this.setData({
      'addCon.course': e.detail.value
    })

  },
  //获取地址
  getAddr: function(e) {
    this.setData({
      'addCon.addr': e.detail.value
    })
  },
  //获取老师
  getTeach: function(e) {
    this.setData({
      'addCon.teacher': e.detail.value
    })
  },
  //时间
  bindTimeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      'addCon.time': e.detail.value
    })
  },
  //删除课表
  delCourse(e) {
    var that = this;
    this.setData({
      x: e.currentTarget.dataset.x,
      y: e.currentTarget.dataset.y
    })
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.showLoading({
            title: '正在删除',
          })
          //删除课程数据库
          db.collection("user_course").where({
            user_id: app.globalData.id
          }).get({
            success(res) {
              console.log(res);
              var temp = res.data[0];
              switch (that.data.x) {
                case 0:
                  temp.one[that.data.y] = null;
                  break;
                case 1:
                  temp.two[that.data.y] = null;
                  break;
                case 2:
                  temp.three[that.data.y] = null;
                  break;
                case 3:
                  temp.four[that.data.y] = null;
                  break;
                case 4:
                  temp.five[that.data.y] = null;
                  break;
                case 5:
                  temp.six[that.data.y] = null;
                  break;
                case 6:
                  temp.seven[that.data.y] = null;
                  break;
                case 7:
                  temp.eight[that.data.y] = null;
                  break;
              }
              that.setData({
                coursedata: res
              })
              //调用云函数增加数据
              wx.cloud.callFunction({
                // 云函数名称
                name: 'addCourse2',
                // 传给云函数的参数
                data: {
                  rest: that.data.coursedata
                },
                success(res) {
                  //console.log(res);
                  wx.hideLoading();
                  that.onLoad();
                },
                fail: console.error
              });
            }
          })
        }
      }
    })



  }
})