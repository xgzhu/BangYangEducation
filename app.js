//app.js
const grades = require('utils/js/grade.js')
const teachers = require('utils/js/teacher.js')
const citys = require('utils/js/city.js')
const universitys = require('utils/js/university.js')
const idLength = 8

var that

App({
  onLaunch: function () {
    that = this

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    that.getUserIdAndHistories()
    that.getUserInfo()
    that.getSystemInfo()
    that.setupUserCustomInfo()
  },
  setupUserCustomInfo: function() {
    // These data should be stored in the cloud later.
    that.globalData.userCustomInfo = {region: ["山东省", "济南市", "市中区"]}
    var cityId = that.getCityId()
    that.getLibraryData(cityId)
    that.getInternshipData(cityId)
  },
  getUserInfo: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log("fail to get userInfo")
      }
    })
  },
  getSystemInfo: function() {
    wx.getSystemInfo({
      success: function (res) {
        console.log('systemInfo', res)
        that.globalData.systemInfo = res
      },
      fail: function (res) {
        console.log("fail to get sysInfo")
      }
    })
  },
  getUserIdAndHistories: function () {
    wx.login({
      success: function (res) {
        var code = res.code
        wx.request({
          url: 'https://api.zhexiankeji.com/education/wx/getOpenid?code=' + code,
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            var wxId  = ""
            if (res.data.openid != undefined) {
              wxId = res.data.openid
            } else {
              var obj = JSON.parse(res.data.result);
              wxId = obj.openid
            }
            console.log('openId', wxId)
            //that.getUserHistories(wxId)
            that.globalData.openId = wxId
          },
          fail: function (res) {
            console.log("fail to get openId")
          }
        })
      }
    })
  },
  getRegion: function() {
    return that.globalData.userCustomInfo.region.slice()
  },
  getCityId: function() {
    var addressValues = that.globalData.userCustomInfo.region
    var provinceId = citys.provinceToId[addressValues[0]]
    var cityId = provinceId
    var citysInProvince = citys.citys[provinceId]
    for (var i = 0; i < citysInProvince.length; i++) {
      if (citysInProvince[i].name == addressValues[1]) {
        cityId = citysInProvince[i].id
        break
      }
    }
    return cityId
  },
  getLocalUniversities: function() {
    var provinceId = that.getProvinceUniversityId()
    var universities =  universitys.universitys[provinceId].slice()
    return universities
  },
  getProvinceUniversityId: function() {
    var provinceName = that.globalData.userCustomInfo.region[0]
    for (var i = 0; i < universitys.provinces.length; i++) {
      if (universitys.provinces[i].name == provinceName) {
        return universitys.provinces[i].id
      }
    }
    return "0"
  },
  setGlobalRegion: function(region) {
    that.globalData.userCustomInfo = {region: region}
  },
  // Not ready
  getLibraryData: function() {
    var cityId = that.getCityId()
  },
  getInternshipData: function() {
    var cityId = that.getCityId()
  },
  globalData: {
    needAuth: false,
    userInfo: null,
    systemInfo: null,
    openId: null,
    myStudentHistory: [],
    myTeacherHistory: [],
    localStudentLibrary: {},
    localTeacherLibrary: {},
    localInternshipInfo: [],
    localParttimeInfo: [],
    librarySelection: "",
  }
})