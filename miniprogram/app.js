//app.js
App({
  onLaunch: function () {
    //var that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'easys-8d4ce3',
        traceUser: true,
      })
    }

    this.globalData = {
      //userInfo: {},
      avatarUrl: "",
      nick:"",
      id:"",
      openid:""
    }
  },

  getAuthKey: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      // 调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            //that.globalData.code = res.code;
            wx.request({
              url: 'http://localhost:8080/user/getOpenId', // 仅为示例，并非真实的接口地址
              data: {
                code: res.code
                  },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                that.globalData.openid = res.data.data;
                //console.log(res.data);
                  wx.request({
                    url: 'http://localhost:8080/user/getId', // 仅为示例，并非真实的接口地址
                    data: {
                      openId: res.data.data,
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                      if(res.data.stat==200){
                        //console.log(res.data.data);
                        that.globalData.id = res.data.data;
                        wx.setStorage({
                          key: 'id',
                          data: res.data.data
                        })
                      }else{
                        console.log("登录失败！");
                      }
                    }
                  })
              },
            })
            //调用登录接口
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                //that.globalData.UserRes = res;
               
                that.globalData.avatarUrl = res.userInfo.avatarUrl;
                that.globalData.nick = res.userInfo.nickName;
                //console.log(res.userInfo);
              },
              complete: function(){
                var res = {
                  status: 200,
                  //data: res.data.auth_key
                }
                resolve(res);
              }
            })
            
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
            var res = {
              status: 300,
              data: '错误'
            }
            reject('error');
          }
        }
      })
    });
  },



})
