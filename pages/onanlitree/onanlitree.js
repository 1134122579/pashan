// pages/onanlitree/onanlitree.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  openDocument(){
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: 'https://api.uba9.com/img/a.pdf',
      success: function (res) {
        const filePath = res.tempFilePath
        console.log('打开文档成功',res)
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功',res)
          }
        })
      }
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
this.openDocument()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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