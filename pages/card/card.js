const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function(e) {
    that = this
    console.log(e)
    if (e.personal == "student") {
      that.setData(app.globalData.myStudentRegister)
    } else if (e.personal == "teacher") {
      that.setData(app.globalData.myTeacherRegister)
    } else {
      var item = JSON.parse(e.item)
      that.setData(item)
      that.setData({canRegister: true})
    }
  },
  onShow: function() {
    var reserveConfirm = wx.getStorageSync("reserveConfirm")
    wx.setStorageSync("reserveConfirm", false)
    console.log("reserveConfirm", reserveConfirm)
    if (reserveConfirm) {
      wx.showToast({
        title: 'TODO: 尚未实现',
        icon: 'success',
        duration: 1000
      })
    }
  },
  navToForm: function(type) {
    var url = type=="teacher" ? '../find/find' : '../apply/apply';
    wx.navigateTo({
      url: url + '?region='+app.globalData.userCustomInfo.region + '&shouldReturn=true'
    })
  },
  navToHistory: function(type) {
    var url = '../histories/histories'
    url += type=="teacher" ? '?onlyStudent=true' : '?onlyTeacher=true'
    wx.navigateTo({
      url: url
    })
  },
  makeReverservation: function() {
    var type = that.data.type
    var data = {
      cityId: app.getCityId(),
      sIds: [],
      tIds: [],
    }
    if (type == 'teacher') {
      // 找家教，所以要学员信息
      if (app.globalData.myStudentRegister == null) {
        wx.showModal({
          title: '学员信息未注册',
          content: '后台显示你尚未注册过学员信息，请你先注册（只需两分钟）再预约。谢谢您的合作。',
          success: function(res) {
            wx.setStorageSync("reserveConfirm", res.confirm)
            if (res.confirm) {
              wx.navigateTo({
                url: '../student-form/student-form'
              })
            }
          },
          fail: function(res) {
            console.log("checkExisting fail")
          },
        })
        return
      }
      data.sIds.push(app.globalData.myStudentRegister.sId)
      data.tIds.push(that.data.tId)
      data.iType = 2
    } else {
      // 找学生或者兼职或者实习，所以要教员信息
      if (app.globalData.myTeacherRegister == null) {
        wx.showModal({
          title: '教员信息未注册',
          content: '后台显示你尚未注册过教员信息，请你先注册并上传相关材料再进行预约。谢谢您的合作。',
          success: function(res) {
            wx.setStorageSync("reserveConfirm", res.confirm)
            if (res.confirm) {
              wx.navigateTo({
                url: '../teacher-form/teacher-form'
              })
            }
          },
          fail: function(res) {
            console.log("checkExisting fail")
          },
        })
        return
      }
      data.tIds.push(app.globalData.myTeacherRegister.tId)
      data.sIds.push(that.data.sId)
      data.iType = 1
    }
    console.log(JSON.stringify(data))
    var url = "https://api.zhexiankeji.com/education/intention/insert"
    wx.request({
      url: url,
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '已预约',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '出现了问题',
          icon: 'fail',
          duration: 1000
        })
      },
    })
  }
})