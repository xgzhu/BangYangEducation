const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function() {
    that = this
    var shownList = wx.getStorageSync('fakeInternship')
    that.setData({shownList: shownList})
  },
  navToInternCard: function(e) {
    var idx = parseInt(e.currentTarget.dataset.index)
    var item = that.data.shownList[idx]
    var url = "../../pages/card/card?type=institute"
    if (item.id != undefined) {
      url += "&id=" + item.id
    }
    if (item.institute != undefined) {
      url += "&name=" + item.institute
    }
    if (item.address != undefined) {
      url += "&address=" + item.address
    }
    if (item.description != undefined) {
      url += "&description=" + item.description
    }
    if (item.hourly_pay != undefined) {
      url += "&hourly_pay=" + item.hourly_pay
    }
    if (item.flexible_pay != undefined) {
      url += "&flexible_pay=" + item.flexible_pay
    }
    if (item.subjects != undefined) {
      url += "&subjects=" + item.subjects
    }
    if (item.week_length != undefined) {
      url += "&week_length=" + item.week_length
    }
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  }
})
