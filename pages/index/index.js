//index.js
//获取应用实例
const app = getApp()
var that

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

Page({
  data: {
    subjects: ['语文', '数学', '英语', '物理', '化学', '计算机'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    that = this
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // var region = wx.getStorageSync('userCustomerInfo').region
    // if (region == undefined) {
    //   region = ["山东省", "济南市", "市中区"]
    //   wx.setStorageSync('userCustomerInfo', {region: region})
    // }
    // that.setData({region: region, cityId: app.getCityId(region)})
    var region = app.globalData.userCustomInfo.region
    that.setData({region: region, cityId: app.getCityId(region)})
    console.log("index.data", that.data)
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo != undefined) {
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  navToFind: function () {
    var selections = {info: "teacher", showBtn: true}
    var selectionString = JSON.stringify(selections)
    wx.navigateTo({
      url: '../library/library?selections='+selectionString
      //url: '../find/find?region='+that.data.region
    })
  },
  navToApply: function () {
    var selections = {info: "student", showBtn: true}
    var selectionString = JSON.stringify(selections)
    wx.navigateTo({
      url: '../library/library?selections='+selectionString
      //url: '../apply/apply?region='+that.data.region
    })
  },
  navToSubject: function (e) {
    var selections = {info: "teacher", subjects: [e.currentTarget.dataset.subject]}
    wx.navigateTo({
      url: '../library/library?selections=' + JSON.stringify(selections)
    })
  },
  navToInternship: function(e) {
    wx.navigateTo({
      url: '../internship/internship'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '985大学生教育平台',
      path: '/pages/index'
    }
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      region: e.detail.value
    })
    var cityId = app.getCityId(e.detail.value)
    if (cityId != that.data.cityId) {
      app.getLibraryData(cityId)
    }
    // wx.setStorageSync('userCustomerInfo', {region: e.detail.value})
    app.globalData.userCustomInfo = {region: e.detail.value}
    console.log(app.globalData)
  },
})

