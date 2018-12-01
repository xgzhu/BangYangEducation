const app = getApp()
const subjects = require('../../utils/js/subject.js')
const teachers = require('../../utils/js/teacher.js')
const universitys = require('../../utils/js/university.js')
const grades = require('../../utils/js/grade.js')
const citys = require('../../utils/js/city.js')
var animation1
var that

Page({
  data: {
    subjectClassSelected: false,
    moreFilter: false,
    selectTeacherEnabled: true,
    selectAllSubjects: ">>全选<<",
    selectAllUniversities: ">>全选<<",
    selectAllIdentities: ">>全选<<",
    selectAllPoints: ">>全选<<",
  },
  onHide: function (e) {
  },
  onLoad: function (e) {
    that = this
    if (e.info != undefined) {
      that.setData({selections: {info: e.info}})
    } else {
      that.setData({selections: {info: "teacher"}})
    }
    var areaValues = app.globalData.userCustomInfo.region
    var uProvince = universitys.provinces.slice()
    var province = areaValues[0]
    var foundProvince = uProvince.find(function(element) {
      return element.name == province;
    });
    if (foundProvince != undefined) {
      that.setData({universities: universitys.universitys[foundProvince.id].slice()})
    }
    that.setData({
      identities: teachers.grades.slice(),
      uProvince: universitys.provinces.slice(),
      points: subjects.points.slice(),
    })
    console.log(that.data)
  },
  selectObjectFilter: function (e) {
    var selection = e.detail.value
    var selections = that.data.selections
    selections.info = selection
    that.setData({selectTeacherEnabled: selection == "teacher", selections: selections})
  },
  selectGenderFilter: function (e) {
    var selection = e.detail.value
    var selections = that.data.selections
    selections.gender = selection
    that.setData({selections: selections})
  },
  selectSubjectClassFilter: function(e) {
    var selection = e.detail.value
    var shown_subjects = []
    switch (selection) {
      case "basic": shown_subjects = subjects.subjects.slice(0, 12); break;
      case "art": shown_subjects = subjects.subjects.slice(12, 20); break;
      case "sport": shown_subjects = subjects.subjects.slice(20, 30); break;
      case "language": shown_subjects = subjects.subjects.slice(30, 42); break;
      case "other": shown_subjects = subjects.subjects.slice(42, 44); break;
      default: shown_subjects = subjects.subjects.slice(); break;
    }
    var selections = that.data.selections
    selections.subjects = []
    that.setData({subjectClassSelected: true, selectAllSubject: ">>全选<<", shown_subjects: shown_subjects, selections: selections})
  },
  selectSubjectFilter: function(e) {
    var selection = e.detail.value
    console.log(selection)
    var selections = that.data.selections
    selections.subjects = selection
    that.setData({selections: selections})
  },
  selectIdentityFilter: function(e) {
    var selection = e.detail.value
    console.log(selection)
    var selections = that.data.selections
    selections.identities = selection
    that.setData({selections: selections})
  },
  selectUniversityFilter: function(e) {
    var selection = e.detail.value
    console.log(selection)
    var selections = that.data.selections
    selections.universities = selection
    that.setData({selections: selections})
  },
  selectAllSubjects: function() {
    if (that.data.selectAllSubjects == ">>全选<<") {
      var shown_subjects = that.data.shown_subjects
      var selection = []
      for (var i = 0; i < shown_subjects.length; i++) {
        var subject = shown_subjects[i]
        subject.checked = true
        selection.push(subject.name)
      }
      var selections = that.data.selections
      selections.subjects = selection
      that.setData({selectAllSubjects: ">>全不选<<", shown_subjects: shown_subjects, selections: selections})
    }
    else if (that.data.selectAllSubjects == ">>全不选<<") {
      var shown_subjects = that.data.shown_subjects
      for (var i = 0; i < shown_subjects.length; i++) {
        var subject = shown_subjects[i]
        subject.checked = false
      }
      var selections = that.data.selections
      selections.subjects = []
      that.setData({selectAllSubjects: ">>全选<<", shown_subjects: shown_subjects, selections: selections})
    }
  },
  selectAllIdentities: function() {
    if (that.data.selectAllIdentities == ">>全选<<") {
      var identities = that.data.identities
      var selection = []
      for (var i = 0; i < identities.length; i++) {
        var identity = identities[i]
        identity.checked = true
        selection.push(identity.id)
      }
      var selections = that.data.selections
      selections.identities = selection
      that.setData({selectAllIdentities: ">>全不选<<", identities: identities, selections: selections})
    }
    else if (that.data.selectAllIdentities == ">>全不选<<") {
      var identities = that.data.identities
      for (var i = 0; i < identities.length; i++) {
        var identity = identities[i]
        identity.checked = false
      }
      var selections = that.data.selections
      selections.identities = []
      that.setData({selectAllIdentities: ">>全选<<", identities: identities, selections: selections})
    }
  },
  selectAllUniversities: function() {
    if (that.data.selectAllUniversities == ">>全选<<") {
      var universities = that.data.universities
      var selection = ["U0"]
      for (var i = 0; i < universities.length; i++) {
        var university = universities[i]
        university.checked = true
        selection.push("U" + university.id)
      }
      var selections = that.data.selections
      selections.universities = selection
      that.setData({selectAllUniversities: ">>全不选<<", universities: universities, selections: selections, U0checked: true})
    }
    else if (that.data.selectAllUniversities == ">>全不选<<") {
      var universities = that.data.universities
      for (var i = 0; i < universities.length; i++) {
        var university = universities[i]
        university.checked = false
      }
      var selections = that.data.selections
      selections.universities = []
      that.setData({selectAllUniversities: ">>全选<<", universities: universities, selections: selections, U0checked: false})
    }
  },
  selectAllPoints: function() {
    if (that.data.selectAllPoints == ">>全选<<") {
      var points = that.data.points
      var selection = []
      for (var i = 0; i < points.length; i++) {
        var point = points[i]
        point.checked = true
        selection.push(point.id)
      }
      var selections = that.data.selections
      selections.points = selection
      that.setData({selectAllPoints: ">>全不选<<", points: points, selections: selections})
    }
    else if (that.data.selectAllPoints == ">>全不选<<") {
      var points = that.data.points
      var selection = []
      for (var i = 0; i < points.length; i++) {
        var point = points[i]
        point.checked = false
      }
      var selections = that.data.selections
      selections.points = []
      that.setData({selectAllPoints: ">>全选<<", points: points, selections: selections})
    }
  },
  showMoreFilter: function() {
    that.setData({moreFilter: true})
  },
  submitFilter: function() {
    var selections = that.data.selections
    var selectionString = JSON.stringify(selections)
    if (selections.subjects == undefined || selections.subjects == []) {
      wx.showModal({
        title: '确认查找信息',
        content: '您未选择具体科目，默认显示全部，是否进行查询？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../library/library?selections='+selectionString
            })
          }
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../library/library?selections='+selectionString
      })
    }
  }
})
