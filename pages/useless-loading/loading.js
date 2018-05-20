const app = getApp()
var that

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    that = this
    if (app.globalData.userInfo) {
      that.redirToIndex()
    } else if (that.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.redirToIndex()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.redirToIndex()
        }
      })
    }
    console.log(that.data)
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo != undefined) {
      app.globalData.userInfo = e.detail.userInfo
      console.log("dsf")
      wx.navigateTo({
        url: '../index/index'
      })
    }
  },
  redirToIndex: function() {
    console.log("should red")
    wx.redirectTo({
      url: '../index/index'
    })
  }
})