const app = getApp()
var that

Page({
  data: {},
  onLoad: function(e) {
    that = this
    console.log(wx.getStorageSync('cardSelection'))
    that.setData({namecard: wx.getStorageSync('cardSelection')}) 
  }
})