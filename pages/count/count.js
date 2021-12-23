// pages/count/count.js
let App = getApp()
import Api from '../../api/index'
import storage from '../../utils/cache'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_jy: false,
    getdataCount: '',
    all_numAll: '',
    beianAll: '',
    zaituAll: '',
    jieshuAll: '',
    userInfo: App.globalData.userInfo,
    jy_list: []
  },
  getSum(total, num) {
    console.log(total, num)
    return total + num.all_num;
  },
  goJypage(event) {
    console.log(event)
    let {
      item
    } = event.currentTarget.dataset
    if(item.status==1){
      wx.navigateTo({
        url: '/pages/jiuyuanDetail/jiuyuanDetail?beian_id='+item.id,
      })
    }
 
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
  getSosList() {
    let {
      is_jy,
      page,
      jy_list
    } = this.data
    if (is_jy) {
      Api.getSosList({
        page
      }).then(res => {
        this.setData({
          isNulist: res.length <= 0 ? true : false
        })
        if (page == 1) {
          this.setData({
            jy_list: res
          })
        } else {
          this.setData({
            jy_list: jy_list.concat(res)
          })
        }
      })
    }
  },
  tj() {
    this.setData({
      is_jy: false
    })
  },
  jy() {
    this.setData({
      is_jy: true,
      page: 1
    })
    this.getSosList()
  },

  //触底响应函数
  onBottom() {
    var that = this;
    (this.data.pageNum) ++;
    this.getSosList();
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
    this.getSosList()
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
    this.onBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})