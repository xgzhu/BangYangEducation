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
    for (var i = 0; i < list.length; i++) {
      list[i].idString = app.formatId(list[i].id)
      if (type == "teacher") {
        list[i].nickname = list[i].generalTeacher.teacher.tName.substring(0, 1)+"老师";
        list[i].targetGradeReadable = app.getTargetGradeReadable(list[i].generalTeacher.teacherWorks[0].tAim.split("+"))
        list[i].subjects = list[i].generalTeacher.teacherWorks[0].tSubject.split("+")
      } else {
        list[i].nickname = list[i].generalStudent.student.sName.substring(0, 1)+"同学";
        list[i].subjects = list[i].generalStudent.works[0].wSubject.split("+")
      }
    }
    return list
  }
})
