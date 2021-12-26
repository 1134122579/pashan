//app.js

App({
  onLaunch: function () {

    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    // } else {
    //   wx.cloud.init({
    //     // env 参数说明：
    //     //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
    //     //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
    //     //   如不填则使用默认环境（第一个创建的环境）
    //     env: 'cloud1-3gcwd0o5b4b2bb83',
    //     traceUser: true,
    //   })
    // }
    // this.globalData = {}
    // 获取小程序顶部参数
    try {
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      let res = wx.getSystemInfoSync()
      console.log("获取自定义顶部高度相关参数====", res)
      let statusBarHeight = res.statusBarHeight,
        navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
        navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
      this.globalData.navHeight = navHeight;
      this.globalData.navTop = navTop;
      this.globalData.windowHeight = res.windowHeight;
      this.globalData.windowWidth = res.windowWidth

    } catch (err) {
      console.error('获取小程序顶部参数', err)
    }
    // 热更新
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      //检查是否有新版本
      updateManager.onCheckForUpdate(function (res) {
        // 如果有新版本
        if (res.hasUpdate) {
          // 手机支持热更新时
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });
          // 手机不支持热更新时
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
            });
          });
        }
      });
    } else {}

  },
  // 获取定位权限
  isGetlocation(cb) {
    var that = this
    wx.getLocation({
      success(res) {
            cb()
      },
      fail() {
        wx.getSetting({
          success(res) {
            //这里判断是否有地位权限
            if (!res.authSetting['scope.userLocationBackground']) {
                  wx.showModal({
                    showCancel: !0,
                    content: "未开启后台位置获取，请点击右上角“…”，进入设置，选择位置消息，勾选按钮“使用小程序期间和离开小程序后”。",
                    success: function (t) {
                      wx.openSetting({
                        success: function (t) {
                          wx.redirectTo({
                            url: '/pages/index/index',
                          })
                          // wx.getSetting({
                          //   success: function (t) {
                          //     if (console.log(t), 1 == t.authSetting["scope.userLocationBackground"]) {
                          //       cb()
                          //     } else {
                          //       wx.showModal({
                          //         title: '您手机定位功能没有开启',
                          //         content: '请在系统设置中打开定位服务',
                          //         success() {
                          //           // 跳到首页
                          //           wx.redirectTo({
                          //             url: '/pages/index/index',
                          //           })
                          //         }
                          //       })
                          //     }
                          //   }
                          // });
                        }
                      });
                    }
                  });
            } else {
              //如果有定位权限，调用地图
              wx.showModal({
                title: '您手机定位功能没有开启',
                content: '请在系统设置中打开定位服务',
                success() {
                  // 跳到首页
                  wx.redirectTo({
                    url: '/pages/index/index',
                  })
                }
              })
            }
          }
        })
      }
    })
  

  },
  globalData: {
    userInfo: "",
    is_login: true,
    navHeight: 0,
    navTop: 0,
    windowHeight: 0,
    windowWidth: 0,
  }
})