// miniprogram/pages/plantable/plantable.js
const app = getApp();
const db = wx.cloud.database()
const time = require("../../utils/time.js")
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
var y = time.formatTime(new Date);
y = y.substr(0, 4);
//console.log(y);
for (let i = y; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    q: 0,
    planData: "",
    addTime: "",
    addCon: "",
    time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: ''
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function() {
    wx.showLoading({
      title: '正在新建计划',
    })
    var that = this;
    this.setData({
      hiddenmodalput: true
    })
    //console.log(that.data);
    //console.log("app.globalData.id:" + app.globalData.id);
    //调用云函数上传到数据库
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addPlan',
      // 传给云函数的参数
      data: {
        q: that.data.q,
        _id: app.globalData.id,
        addData: {
          time: that.data.time,
          content: that.data.addCon
        }
      },
      success(res) {
        //console.log("成功"+res);
        wx.hideLoading();
        wx.showToast({
          title: '新增成功',
          icon: 'success'
        })
        that.onLoad();
      },
      fail: console.error
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在加载',
    })
    //设置默认的年份
    this.setData({
      choose_year: this.data.multiArray[0][0]
    })
    var that = this;
    //console.log(options)
    if (options) {
      app.globalData.q = options.q;
    }
    this.setData({
      q: app.globalData.q
    })
    this.getData(this.data.q);
  },

  getData: function(e) {
    var that = this;
    //console.log("e:"+e);
    var q = e; //获取查询的计划类型
    var id = app.globalData.id;
    wx.getStorage({
      key: 'id',
      success: function(res) {
        //console.log(res.data);
        id = res.data
      },
    })
    //console.log("id:"+id);
    //const db = wx.cloud.database()
    if (q == 1) {
      //查询天计划
      db.collection('user_plan_day').orderBy('time', 'desc').where({
        user_id: id
      }).get().then(res => {
        //console.log(res.data);
        that.setData({
          planData: res.data
        })
        wx.hideLoading();
      })
    } else if (q == 2) {
      //周计划
      db.collection('user_plan_week').orderBy('time', 'desc').where({
        user_id: id
      }).get().then(res => {
        //console.log(res.data);
        that.setData({
          planData: res.data
        })
        wx.hideLoading();
      })
    } else if (q == 3) {
      //月计划
      db.collection('user_plan_month').orderBy('time', 'desc').where({
        user_id: id
      }).get().then(res => {
        //console.log(res.data);
        that.setData({
          planData: res.data
        })
        wx.hideLoading();
      })
    } else {
      //年计划
      db.collection('user_plan_year').orderBy('time', 'desc').where({
        user_id: id
      }).get().then(res => {
        //console.log(res.data);
        that.setData({
          planData: res.data
        })
        wx.hideLoading();
      })
    }
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

  //新增计划
  getTime: function(e) {
    this.setData({
      addTime: e.detail.value
    })
  },
  getCont: function(e) {
    this.setData({
      addCon: e.detail.value
    })
  },
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    })
    // console.log(this.data.time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function(e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      //console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        //console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      //console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  delPlan: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.showLoading({
            title: '正在删除',
          })

          var id = e.currentTarget.dataset.id;
          //console.log(id);
          //调用云函数删除数据
          wx.cloud.callFunction({
            // 云函数名称
            name: 'delPlan',
            // 传给云函数的参数
            data: {
              q: that.data.q,
              id: id,
            },
            success(res) {
              //console.log("成功"+res);
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              that.onLoad();
            },
            fail: console.error
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },



})