//index.js
const app = getApp()
var that

Page({
  data: {
    subjects: ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '计算机', '英语口语', '书法', '奥数', '托福', '雅思', '体育中考', '艺考', '陪读', '音乐/乐器', '其他'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperItems: ['demo-text-1', 'demo-text-2', 'demo-text-3', 'demo-text-4'],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    that.setData({
      region: app.getRegion(), 
      cityId: app.getCityId(),
      universities: app.getLocalUniversities()
    })
    console.log("index.data", that.data)
  },
  // 初始化用户数据
  getUserInfo: function(e) {
    console.log(e)
    // Setup globalData
    app.globalData.userInfo = e.detail.userInfo
    // Setup local page data
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value
    app.setGlobalRegion(region)
    var cityId = app.getCityId()
    if (cityId != that.data.cityId) {
      app.getLibraryData()
      app.getInternshipData()
    }
    that.setData({
      region: region,
      cityId: cityId,
      universities: app.getLocalUniversities()
    })
    console.log(app.globalData)
  },
  //跳转处理函数
  navToStudentForm: function() {
    wx.navigateTo({
      url: '../student-form/student-form'
    })
  },
  navToTeacherForm: function() {
    wx.navigateTo({
      url: '../teacher-form/teacher-form'
    })
  },
  tapDebug: function() {
    console.log("TAPED 1")
  },
  tapDebug2: function() {
    console.log("TAPED 2")
  },
})
