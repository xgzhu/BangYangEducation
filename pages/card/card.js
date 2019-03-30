const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function(e) {
    that = this
    console.log("card",e.personal)
    if (e.personal == "student") {
      if (app.globalData.myStudentRegister == null) {
        //todo
        return
      }
      var myStudent = app.globalData.myStudentRegister
      var work_time = myStudent.time&0x01 ? "平时 " : "" 
      work_time = work_time + (myStudent.time&0x02 ? "周末 " : "")
      work_time = work_time + (myStudent.time&0x04 ? "假期 " : "")
      that.setData(myStudent)
      that.setData({
        nickname: myStudent.name,
        title: myStudent.gender == 0 ? "男生":"女生",
        address_detail: myStudent.sArea + " " + myStudent.sAddress,
        work_time: work_time,
        canRegister: false,
        showReserveOption: false
      })
    } else if (e.personal == "teacher") {
      if (app.globalData.myTeacherRegister == null) {
        return
      }
      that.setData(app.globalData.myTeacherRegister)
      that.setData({
        nickname: app.globalData.myTeacherRegister.name,
        canRegister: false,
        showReserveOption: false
      })
    } else {
      var item = JSON.parse(e.item)
      that.setData(item)
      that.setData({
        canRegister: true,
        showReserveOption: true})
      that.initReservationInfo()
    }
    var subjectsList = that.data.subjectsList
    var subjectsListReadable = ""
    for (var i = 0; i < subjectsList.length; i++) {
      if (i > 0) {
        subjectsListReadable += ", "
      }
      subjectsListReadable += subjectsList[i].name
    }
    that.setData({subjectsListReadable: subjectsListReadable})
    console.log(that.data)
  },
  onShow: function() {
    var reserveConfirm = wx.getStorageSync("reserveConfirm")
    wx.setStorageSync("reserveConfirm", false)
    console.log("reserveConfirm", reserveConfirm)
    if (reserveConfirm) {
      that.makeReverservation()
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
  initReservationInfo: function() {
    if (that.data.type == "teacher") {
      for (var i = 0; i < app.globalData.myTeacherReservations.length; i++) {
        if (app.globalData.myTeacherReservations[i].tId == that.data.tId) {
          that.setData({
            canRegister: false,
            reservationStatus: app.globalData.myTeacherReservations[i].iStatus,
            currentReservation: app.globalData.myTeacherReservations[i]
          })
        }
      }
    } else {
      for (var i = 0; i < app.globalData.myStudentReservations.length; i++) {
        if (app.globalData.myStudentReservations[i].sId == that.data.sId) {
          that.setData({
            canRegister: false,
            reservationStatus: app.globalData.myStudentReservations[i].iStatus,
            currentReservation: app.globalData.myStudentReservations[i]
          })
        }
      }
    }
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
    var url = "https://api.zhexiankeji.com/education/intention/insert"
    if (that.data.reservationStatus == 3) {
      data.iStatus = 0
      url = "https://api.zhexiankeji.com/education/intention/update"
    }
    console.log("data", JSON.stringify(data))
    wx.request({
      url: url,
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // 这不是真的成功，需要 res.data.errInfo == "success" 才是成功
        // {errCode: "000000", errInfo: "success", result: Array(1)}
        console.log(res)
        wx.showToast({
          title: '已预约',
          icon: 'success',
          duration: 1000
        })
        if (that.data.reservationStatus != 3) {
          if (that.data.type == "teacher") {
            app.globalData.myTeacherReservations.push(data)
          } else {
            app.globalData.myStudentReservations.push(data)
          }
        } else {
          if (that.data.type == "teacher") {
            for (var i = 0; i < app.globalData.myTeacherReservations.length; i++) {
              if (app.globalData.myTeacherReservations[i].tId == that.data.tId) {
                app.globalData.myTeacherReservations[i].iStatus = 0
              }
            }
          } else {
            for (var i = 0; i < app.globalData.myStudentReservations.length; i++) {
              if (app.globalData.myStudentReservations[i].sId == that.data.sId) {
                app.globalData.myStudentReservations[i].iStatus = 0
              }
            }
          }
        }
        that.setData({
          canRegister: false,
          reservationStatus: 0
        })
        
      },
      fail: function (res) {
        wx.showToast({
          title: '网络出现了问题',
          icon: 'fail',
          duration: 1000
        })
      },
    })
  },
  cancelReverservation: function() {
    that.data.currentReservation.iStatus = 3
    var data = {}
    data.id = that.data.currentReservation.id
    data.sIds = [that.data.currentReservation.sId]
    data.tIds = [that.data.currentReservation.tId]
    data.iType = that.data.currentReservation.iType
    data.iStatus = 3
    console.log("data", JSON.stringify(data))
    var url = "https://api.zhexiankeji.com/education/intention/update"
    wx.request({
      url: url,
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '已取消预约',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          canRegister: false,
          reservationStatus: 3
        })
        if (that.data.type == "teacher") {
          for (var i = 0; i < app.globalData.myTeacherReservations.length; i++) {
            if (app.globalData.myTeacherReservations[i].tId == that.data.tId) {
              app.globalData.myTeacherReservations[i].iStatus = 3
            }
          }
        } else {
          for (var i = 0; i < app.globalData.myStudentReservations.length; i++) {
            if (app.globalData.myStudentReservations[i].sId == that.data.sId) {
              app.globalData.myStudentReservations[i].iStatus = 3
            }
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络出现了问题',
          icon: 'fail',
          duration: 1000
        })
      },
    })
  }
})