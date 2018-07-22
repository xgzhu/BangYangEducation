const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function(e) {
    that = this
    console.log(e)
    e.subjects = JSON.parse(e.subjects);
    that.setData(e)
  },
  onShow: function() {
    var reserveConfirm = wx.getStorageSync("reserveConfirm")
    wx.setStorageSync("reserveConfirm", false)
    console.log("reserveConfirm", reserveConfirm)
    if (reserveConfirm) {
      wx.showToast({
        title: 'TODO: 剩下就是后台的事情啦',
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
    var shownList = []
    if (type == 'teacher') {
      // 找家教，所以要学员信息
      var studentList = app.globalData.myStudentHistory
      for (var i = 0; i < studentList.length && i < 5; i++) {
        shownList.push("学员 " + studentList[i].sName)
      }
      if (studentList.length > 5) {
        shownList.pop()
        shownList.push("更多学员信息")
      }
      shownList.push("填写新的学员信息")
    } else {
      // 找学生或者兼职或者实习，所以要教员信息
      var teacherList = app.globalData.myTeacherHistory
      for (var i = 0; i < teacherList.length && i < 5; i++) {
        shownList.push("教员 " + teacherList[i].tName)
      }
      if (teacherList.length > 5) {
        shownList.pop()
        shownList.push("更多教员信息")
      }
      shownList.push("填写新的教员信息")
    } 
    // TODO: we ignore the intern now.
    wx.showActionSheet({
      itemList: shownList,
      success: function(res) {
        if (shownList[res.tapIndex].includes("更多")) {
          // wx.showToast({
          //   title: 'TODO: 这里应该导向namelist',
          //   icon: 'success',
          //   duration: 1000
          // })
          wx.setStorageSync("reserveConfirm", false)
          that.navToHistory(type)
        } else if (shownList[res.tapIndex].includes("填写新的")) {
          wx.setStorageSync("reserveConfirm", false)
          that.navToForm(type)
        } else {
          console.log(shownList[res.tapIndex])
          wx.showToast({
            title: 'TODO: 剩下就是后台的事情啦',
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})