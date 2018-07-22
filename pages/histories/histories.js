const app = getApp()
const subjects = require('../../utils/js/subject.js')
const teachers = require('../../utils/js/teacher.js')
const universitys = require('../../utils/js/university.js')
const grades = require('../../utils/js/grade.js')
const idLength = 8
var animation1
var that

Page({
  data: {
  },
  onHide: function (e) {
    console.log("onHide")
  },
  onLoad: function (e) {
    that = this
    if (e.update) {
      wx.startPullDownRefresh()
    }
    that.setData({
      subjects: subjects.subjects.slice(),
      uProvince: universitys.provinces.slice(),
      idToTeacherIdentity: teachers.reversedGrade.slice(),
      idToUniversitys: universitys.idToUniversitys,
      // teacherList: wx.getStorageSync('myTeacherHistory'),
      // studentList: wx.getStorageSync('myStudentHistory')
      teacherList: app.globalData.myTeacherHistory,
      studentList: app.globalData.myStudentHistory,
      onlyTeacher: e.onlyTeacher,
      onlyStudent: e.onlyStudent
    })
    that.setupList()
    console.log(that.data)
  },
  setupList: function() {
    var teacherList = that.data.teacherList
    var studentList = that.data.studentList
    // Sort list by descending order
    teacherList.sort(function(a, b) {
      return a.updateTime < b.updateTime;
    });
    studentList.sort(function(a, b) {
      return a.updateTime < b.updateTime;
    });
    if (that.data.onlyStudent) {
      that.setData({shownList: studentList})
    } else if (that.data.onlyTeacher) {
      that.setData({shownList: teacherList})
    } else {
      var shownList = that.combineTwoListByUpdateTime(teacherList, studentList)
      that.setData({shownList: shownList})
    }
  },
  modifyTeacherIdentityInfo: function(element) {
    if (element.identity == "2") {
      element.identityInfo = 
        that.data.idToUniversitys[element.tUniversity] + " "
        + that.data.idToTeacherIdentity[2]
    } else if (element.identity == "3") {
      element.identityInfo = 
        that.data.idToUniversitys[element.tGraduate] + " "
        + that.data.idToTeacherIdentity[3]
    } else if (element.identity == "4") {
      element.identityInfo = 
        that.data.idToUniversitys[element.tDoctoral] + " "
        + that.data.idToTeacherIdentity[4]
    } else {
      element.identityInfo =
        that.data.idToTeacherIdentity[parseInt(element.identity)]
      if (element.gender == 0) {
        element.nickname = element.name.substring(0, 1)+"先生";
      } else {
        element.nickname = element.name.substring(0, 1)+"女士";
      }
    }
    return element
  },
  combineTwoListByUpdateTime: function(teacherList, studentList) {
    var p1 = 0
    var p2 = 0
    var result = []
    while (p1 < teacherList.length && p2 < studentList.length) {
      if (teacherList[p1].updateTime > studentList[p2].updateTime) {
        result.push(that.modifyTeacherIdentityInfo(teacherList[p1]))
        p1++
      } else {
        result.push(studentList[p2])
        p2++
      }
    }
    while (p1 < teacherList.length) {
      result.push(teacherList[p1])
      p1++
    }
    while (p2 < studentList.length) {
      result.push(studentList[p2])
      p2++
    }
    return result
  },
  namecardClicked: function (e) {
    var idx = e.currentTarget.dataset.index
    var item = that.data.shownList[idx]
    if (that.data.onlyTeacher || that.data.onlyStudent) {
      // wx.setStorageSync("selectedNamecard", JSON.stringify(item))
      wx.setStorageSync("reserveConfirm", true)
      wx.navigateBack()
      return
    }
    var url = '../card/card?type=' + item.type
    url += "&id=" + item.id
    url += "&description=" + item.description
    url += "&name=" + item.name
    url += "&hourly_pay=" + item.hourly_pay
    url += "&subjects=" + JSON.stringify(item.subjectsList)
    if (item.type == "teacher") {
      url += "&title=" + that.data.idToTeacherIdentity[parseInt(item.identity)]
      url += item.gender == 0 ? "(男)" : "(女)"
      url += "&targetGrade=" + item.targetGrade
    } else {
      url += "&grade=" + item.grade
    }
    url += '&isHistory=true'
    // var url = '../card/card?data=' + JSON.stringify(item)
    wx.navigateTo({
      url: url
    })
  },
  onPullDownRefresh: function() {
    console.log("REFRESH!!")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // var wxId = wx.getStorageSync('openId')
    var wxId = app.globalData.openId
    wx.showLoading({
      title: '正在更新...'
    })
    if (wxId == "" || wxId == undefined) {
      wx.stopPullDownRefresh()
    }
    that.setData({updateStudentFinished: false, updateTeacherFinished: false})
    app.personalStudentHistoriesReadyCallback = function() {
      that.setData({updateStudentFinished: true, studentList: app.globalData.myStudentHistory})
      that.updateFinished()
    }
    app.personalTeacherHistoriesReadyCallback = function() {
      that.setData({updateTeacherFinished: true, teacherList: app.globalData.myTeacherHistory})
      that.updateFinished()
    }
    app.getUserHistories(wxId)
  },
  updateFailed: function() {
    wx.hideLoading()
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: '请检查网络连接',
      icon: 'none',
      duration: 2000
    })
    // wx.setStorageSync('myStudentHistory', [])
    // wx.setStorageSync('myTeacherHistory', [])
    app.globalData.myStudentHistory = []
    app.globalData.myTeacherHistory = []
  },
  updateFinished: function() {
    console.log("updateFinished?")
    if (that.data.updateStudentFinished && that.data.updateTeacherFinished) {
      console.log("updateFinished success!")
      that.setupList()
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      // wx.setStorageSync('myStudentHistory', that.data.studentList)
      // wx.setStorageSync('myTeacherHistory', that.data.teacherList)
    app.globalData.myStudentHistory = that.data.studentList
    app.globalData.myTeacherHistory = that.data.teacherList
    }
  },
})
