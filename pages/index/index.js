import storage from '../../utils/cache'
let App = getApp()
let Api = require('../../api/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUser: true,
    userInfo: App.globalData.userInfo
  },
  //  判断是否登录
  islogin(callback) {
    let token = storage.getToken()
    if (token) {

      (callback && typeof (callback) === "function") && callback();
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: App.globalData.userInfo
    })
  },
  record() {
    this.islogin((res) => {
      wx.navigateTo({
        url: '../backgroundLocation/backgroundLocation',
      })
    })
  },
  toTestify() {
    this.islogin(() => {
      wx.navigateTo({
        url: '../testify/testify',
      })
    })
  },
  toUser() {
    this.islogin(() => {

      wx.navigateTo({
        url: '../user/user',
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (storage.getToken()) {
      this.setData({
        userInfo: storage.getUserInfo()
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})