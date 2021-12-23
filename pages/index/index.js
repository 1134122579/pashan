import storage from '../../utils/cache'
let App = getApp()
import Api from '../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Weather: {},
    isUser: true,
    enter: [],
    date: '',
    enterIndex: '',
    ensureEnter: '',
    modify: false,
    DsCount: '',
    userInfo: App.globalData.userInfo
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  pdf() {
    wx.navigateTo({
      url: '/pages/pdf/pdf',
    })
  },
  // 获取数据
  getDsCount() {
    return
    Api.getDsCount().then(res => {
      this.setData({
        DsCount: res
      })
    })
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
  modify() {
    this.setData({
      modify: !this.data.modify
    })
  },
  goAdmin() {
    wx.navigateTo({
      url: '/pages/count/count',
    })
  },
  bindPickerEnter: function (e) {
    this.setData({
      enterIndex: e.detail.value,
      ensureEnter: this.data.enter[e.detail.value]['name']
    });
  },
  getDsRk() {
    Api.getDsRk().then(res => {
      this.setData({
        enter: res
      })
    })
  },
  confirmModify() {
    let {
      userInfo,
      date,
      ensureEnter
    } = this.data
    if (!ensureEnter) {
      wx.showToast({
        title: '请选择登山入口',
        icon: 'none'
      })
      return
    }
    if (!date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }
    userInfo['bean_info']['rukou'] = ensureEnter
    userInfo['bean_info']['ds_time'] = date

    Api.editDsLog({
      ...userInfo.bean_info
    }).then(res => {
      this.getUser()
      wx.showToast({
        title: '修改成功',
      })
      this.cancelModify()
    })
  },
  start() {
    wx.navigateTo({
      url: '/pages/entryDetail/entryDetail',
    })
  },

  cancelModify() {
    this.setData({
      modify: !this.data.modify
    })
  },
  getWeather() {
    Api.getWeather().then(res => {
      this.setData({
        Weather: res
      })
    })
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
        url: '/pages/add/add',
      })
      return
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
  async getUser() {
    let res = await Api.getUserInfo()
    storage.setUserInfo(res)
    this.setData({
      userInfo: res
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
      this.getDsCount()
      this.getUser()
      this.getDsRk()
      this.getWeather()

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