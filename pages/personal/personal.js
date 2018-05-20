const app = getApp()
var that

Page({
  data: {
    hasUserInfo: false
  },
  onShow: function () {
    that = this
    if (app.globalData.userInfo != null) {
      that.setData({
        userInfo: app.globalData.userInfo,
        systemInfo: app.globalData.systemInfo,
        hasUserInfo: true
      })
      console.log(that.data)
      console.log(wx.getStorageSync('userCustomerInfo'))
    }
  },
  navToPersonalHistory: function () {
    wx.navigateTo({
      url: '../histories/histories'
    })
  },
  navToPersonalData: function() {
    wx.navigateTo({
      url: '../personaldata/personaldata'
    })
  },
})