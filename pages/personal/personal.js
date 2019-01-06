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
      // console.log(wx.getStorageSync('userCustomerInfo'))
    }
  },
  navToPersonalHistory: function (e) {
    var selections = {}
    selections.showPersonalHistory = true
    selections.info = e.currentTarget.dataset.type
    var selectionString = JSON.stringify(selections)
    wx.navigateTo({
      url: '../library/library?selections='+selectionString
    })
  },
  navToPersonalData: function() {
    wx.navigateTo({
      url: '../personaldata/personaldata'
    })
  },
})