//index.js
const app = getApp()
const db = wx.cloud.database()
const time = require("../../utils/time.js")
Page({
  data: {
    hiddenmodalput:true,
    daily:true,
    totalDays:0,
    avatarUrl: "",
    nick: "",
    time: "",
    noteData:"",
    courseData:{},
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
  onPullDownRefresh() {
    this.onLoad();
    wx.startPullDownRefresh()
  },
  onLoad: function () {
    wx.stopPullDownRefresh()
    var that = this;
    //判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {//授权了，可以获取用户信息了
        wx.showLoading({
          title: '登陆中',
        })
          wx.getUserInfo({
            success: (res) => {
              //console.log(res.userInfo);
              app.globalData.userInfo = res.userInfo
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nick:res.userInfo.nickName,
                time:time.formatTime(new Date)
              })
              //检验注册或不注册
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  //console.log(res.result);
                  //console.log('[云函数] [login] user openid: ', res.result.openid);
                  app.globalData.openid = res.result.openid;
                  //云数据库查询用户信息
                  const db = wx.cloud.database();
                  db.collection('userinfo').where({
                    openid: res.result.openid
                  })
                    .get({
                      success(res) {
                        //console.log(res);
                        if (res.data.length == 0) {
                          //console.log("注册");
                          //调用云函数注册信息
                          wx.cloud.callFunction({
                            // 云函数名称
                            name: 'updataUser',
                            // 传给云函数的参数
                            data: {
                              user_name: that.data.nick,
                              user_img: that.data.avatarUrl,
                              openid: app.globalData.openid
                            },
                            success(res) {
                              console.log(res);
                              app.globalData.id = res.result._id;
                              that.getNotify();
                              that.getCourse();
                              that.getDailyInfo();
                              wx.setStorage({
                                key: 'id',
                                data: res.result._id
                              })
                              //新增课程数据库
                              wx.cloud.callFunction({
                                // 云函数名称
                                name: 'addCourse',
                                // 传给云函数的参数
                                data: {
                                  id:app.globalData.id,
                                },
                                success(res) {
                                },
                                fail: console.error
                              });
                              //新增打卡表
                              wx.cloud.callFunction({
                                // 云函数名称
                                name: 'initDaily',
                                // 传给云函数的参数
                                data: {
                                  id: app.globalData.id,
                                  latest_time:"",
                                  totalDays:0,
                                },
                                success(res) {
                                  console.log('initDaily:'+res);
                                },
                                fail: console.error
                              });
                            },
                            fail: console.error
                          });
                        }else{
                          app.globalData.id = res.data[0]._id;
                          that.getNotify();
                          that.getCourse();
                          that.getDailyInfo();
                          wx.setStorage({
                            key: 'id',
                            data: res.data[0]._id
                          })
                        }
                        //console.log(res);
                      }
                    })
                },
                fail: err => {
                  console.error('[云函数] [login] 调用失败', err)
                  wx.navigateTo({
                    url: '../deployFunctions/deployFunctions',
                  })
                }
              })
            }
          })
          
        } else {//未授权，跳到授权页面
          wx.redirectTo({
            url: '../authorize/authorize',//授权页面
          })
        }
      }
    })

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  //获取最近通知
  getNotify: function () {
    var that = this;
    const _ = db.command
    //获取当前时间
    var ttime = time.formatTime(new Date);
    //console.log(ttime);
    // this.setData({
    //   number: 
    db.collection("user_plan_day").orderBy('time', 'esc').where({
      time: _.gt(ttime),
      user_id:app.globalData.id
    }).get().then(res => {
      //console.log(res);
      if(res.data.length!=0){
        that.setData({
          noteData: res.data[0]
        })
      }
    })
  },
  //获取最近课程
  getCourse:function(){
    var that = this;
    //获取星期
    var a = ["日", "一", "二", "三", "四", "五", "六"];
    var week = new Date().getDay();
    // var str = "今天是星期" + a[week];
    
    if(week-1<0){
      week = 6;
    }else{
      week = week-1;
    }
    //console.log("week:" + week);
    db.collection("user_course").where({
      user_id: app.globalData.id
    }).get().then(res => {
      //console.log(res);
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
      //console.log(that.data.resCourse);
      var ttime = time.formatTime(new Date);
      ttime = ttime.substr(11, 5)
      //console.log(ttime); 
      for(let i = 0;i<8;i++){
        var temp = that.data.resCourse[i].message;
        //console.log(i+":"+temp[6]);
        if (temp[week]!=null){
          if (temp[week].time > ttime) {
            console.log(temp[week]);
            that.setData({
              courseData: temp[week]
            })
            //console.log("that.courseData:" + that.data.courseData);
            break;
          }
        }
        
      }
    })

  },
//获取打卡信息
getDailyInfo:function(){
  var that = this;
  //获取当前时间
  var ttime = time.formatTime(new Date);
  ttime = ttime.substr(0,10);
  //console.log(ttime)
  db.collection("user_daily").where({
    user_id: app.globalData.id
  }).get().then(res => {
    if (res.data[0].latest_time == "" || res.data[0].latest_time<ttime){
      //console.log("没打卡")
      that.setData({
        daily: true,
        totalDays: res.data[0].totalDays
      })
    }else{
      that.setData({
        daily:false,
        totalDays: res.data[0].totalDays
      })
    }
    wx.hideLoading()
    wx.showToast({
      title: '登录成功',
    })   
  })
},

//打卡
  SignIn:function(){
    wx.showLoading({
      title: '打卡中...',
    })
    var that = this
    //更新打卡表
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateDaily',
      // 传给云函数的参数
      data: {
        id:app.globalData.id,
        latest_time: time.formatTime(new Date).substr(0, 10)
      },
      success(res) {
        console.log(res);
        that.setData({
          daily:false,
          totalDays:that.data.totalDays+1
        })
        wx.hideLoading()
      },
      fail: console.error
    });
  },
  toMateria(){
    wx.showToast({
      title:'敬请期待',
      icon: 'none'
    })
  },
  aboutUs(){
    this.setData({
      hiddenmodalput:!this.data.hiddenmodalput
    })
  },
  confirm(){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  }

})
