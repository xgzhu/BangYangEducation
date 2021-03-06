const app = getApp()
const subjects = require('../../utils/js/subject.js')
const teachers = require('../../utils/js/teacher.js')
const universitys = require('../../utils/js/university.js')
const grades = require('../../utils/js/grade.js')
const citys = require('../../utils/js/city.js')
const idLength = 8
var animation1
var that

Page({
  data: {
    shownList: []
  },
  onLoad: function (e) {
    that = this

    var emptyInfo = "error"
    var shownList = []

    // todo: 这里有race condition, app.js可能还没有加载完毕
    if (e.type == "teacher") {
      // 我预约的家教
      emptyInfo = "你还没有预约任何老师，快去预约吧！"
      shownList = app.globalData.myTeacherReservations
    } else if (e.type == "student") {
      // 我预约的学生
      emptyInfo = "你还没有预约任何学生，快去预约吧！"
      shownList = app.globalData.myStudentReservations
    }

    that.setData({
      type: e.type,
      emptyInfo: emptyInfo, 
      shownList: that.initList(shownList, e.type),
    })
  },
  initList: function(list, type) {
    // for (var i = 0; i < list.length; i++) {
    //   list[i].idString = app.formatId(list[i].id)
    //   list[i].description = "未填写描述"
    //   if (type == "teacher") {
    //     list[i].nickname = list[i].generalTeacher.teacher.tName.substring(0, 1)+"老师";
    //     list[i].targetGradeReadable = app.getTargetGradeReadable(list[i].generalTeacher.teacherWorks[0].tAim.split("+"))
    //     list[i].subjects = list[i].generalTeacher.teacherWorks[0].tSubject.split("+")
    //     if (list[i].tDescribe != "") {
    //       list[i].description = list[i].tDescribe
    //     }
    //   } else {
    //     list[i].nickname = list[i].generalStudent.student.sName.substring(0, 1)+"同学";
    //     list[i].subjects = list[i].generalStudent.works[0].wSubject.split("+")
    //   }
    // }
    var shownList = []
    if (type == "teacher") {
      for (var i = 0; i < list.length; i++) {
        var shownItem = app.constructTeacherInfo([list[i].generalTeacher.teacher], list[i].generalTeacher.teacherWorks)
        shownItem = shownItem[0]
        if (list[i].iStatus == 3) {
          continue
        }
        shownList.push(shownItem)
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var shownItem = app.constructStudentInfo([list[i].generalStudent.student], list[i].generalStudent.works)
        shownItem = shownItem[0]
        if (list[i].iStatus == 3) {
          continue
        }
        shownList.push(shownItem)
      }
    }
    console.log("shownList", shownList)
    return shownList
  },
  navToNamecard: function (e) {
    var idx = e.currentTarget.dataset.index
    var item = that.data.shownList[idx]
    var url = '../card/card?item=' + JSON.stringify(item)
    wx.navigateTo({
      url: url
    })
  },
})
