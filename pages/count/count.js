// pages/count/count.js
let App = getApp()
import Api from '../../api/index'
import storage from '../../utils/cache'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_jy:false,
    getdataCount: '',
    all_numAll: '',
    beianAll: '',
    zaituAll: '',
    jieshuAll: '',
    userInfo: App.globalData.userInfo
  },
  getSum(total, num) {
    console.log(total, num)
    return total + num.all_num;
  },
  getCount() {
    Api.getDsCount().then(res => {
      let all_numAll = res.reduce((total, num) => {
        return total + num.all_num;
      }, 0)
      let beianAll = res.reduce((total, num) => {
        return total + num.beian;
      }, 0)
      let zaituAll = res.reduce((total, num) => {
        return total + num.zaitu;
      }, 0)
      let jieshuAll = res.reduce((total, num) => {
        return total + num.jieshu;
      }, 0)
      this.setData({
        getdataCount: res,
        userInfo: storage.getUserInfo(),
        all_numAll,
        beianAll,
        zaituAll,
        jieshuAll
      })
    })
  },
  tj(){
    this.setData({
      is_jy:false
    })
  },
  jy(){
    this.setData({
      is_jy:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCount()
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