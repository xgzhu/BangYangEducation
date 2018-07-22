const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function() {
    that = this
    var areaValues = app.globalData.userCustomInfo.region
    var cityId = app.getCityId(areaValues)
    var shownList = app.globalData.localInternshipInfo[cityId]
    that.setData({shownList: shownList, areaValues: areaValues})
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
    if (that.data.areaValues != undefined) {
      url += "&address=" + that.data.areaValues
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
      url += "&subjects=" + JSON.stringify(item.subjects)
    }
    if (item.worktime != undefined) {
      url += "&worktime=" + item.worktime
    }
    if (item.start_time != undefined) {
      url += "&start_time=" + item.start_time
    }
    if (item.end_time != undefined) {
      url += "&end_time=" + item.end_time
    }
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  }
})
