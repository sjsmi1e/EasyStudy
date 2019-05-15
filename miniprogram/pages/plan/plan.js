const time = require("../../utils/time.js")
const app = getApp()
const db = wx.cloud.database()
var util = require('../../utils/time.js');
Page({
  data: {
    avatarUrl: "",
    number: "0",
  },
  onLoad: function () {
    wx.showLoading({
      title: '正在加载',
    })
    //计算未完成计划数
   this.unfinish();
   this.setData({
       avatarUrl: app.globalData.userInfo.avatarUrl
     }
   )
   wx.hideLoading()
  },
  plan: function (event) {
    var year = event.currentTarget.dataset.year;

    wx.navigateTo({
      url: '../plantable/plantable?q='+year
    })
  },
  //未完成计划数
  unfinish: function () {
    var that = this;
    const _ = db.command
    //获取当前时间
    var ttime = time.formatTime(new Date);
    //console.log(ttime);
    // this.setData({
    //   number: 
    db.collection("user_plan_day").where({
      time: _.gt(ttime),
      user_id: app.globalData.id
    }).get().then(res => {
      //console.log(res);
      that.setData({
        number:res.data.length
      })
    })
  }
})

