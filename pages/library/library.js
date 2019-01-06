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
    subjects: [],
    selectedSubjects: [],
    subjectsInfo: "全部科目",
    selectedUniversitys: ["U0"],
    selectedGender: [],
    filterAnimation: {},
    title_display: "",
    title_detail: "none",
    objectsInfo: "教员信息",
    selectedObject: "teacher",
    teacherChecked: true,
    studentChecked: false,
    filterOpen: false,
    regionMayChanged: false,
    list: [],
  },
  onHide: function (e) {
    console.log("onHide")
    if (that.data.filterOpen) {
      that.saveFilter()
    }
  },
  onLoad: function (e) {
    that = this
    var selections = JSON.parse(e.selections)
    console.log("librarySelection", selections)
    var areaValues = app.globalData.userCustomInfo.region
    var cityId = app.getCityId(areaValues)
    // var showBtn = false
    // if (selections.showBtn != undefined) {
    //   showBtn = selections.showBtn
    // }
    that.setData({
      idToTeacherIdentity: teachers.reversedGrade.slice(),
      idToUniversitys: universitys.idToUniversitys,
      areaValues: areaValues,
      cityId: cityId,
      selections: selections,
      emptyInfo: "啊呀，好像没有信息，放宽点要求试试？"
      // showBtn: showBtn,
    })
    that.setupList(selections)
    console.log(that.data)
  },
  setupList: function(selections) {
    var allList = null
    // Object Filter
    if (selections.info == "teacher") {
      allList = app.globalData.localTeacherLibrary[that.data.cityId]
    } else if (selections.info == "student") {
      allList = app.globalData.localStudentLibrary[that.data.cityId]
    }
    console.log("allList", allList)
    if (allList == null) {
      that.setData({shownList: []})
      return;
    }
    var shownList = []
    for (var i = 0; i < allList.length; i++) {
      var element = allList[i]
      // Gender Filter
      if (selections.gender != undefined && selections.gender != "2"
        && selections.gender != element.gender.toString()) {
        continue
      }
      // Subject Filter
      if (selections.subjects != undefined && selections.subjects.length > 0) {
        var invalid = true
        for (var j = 0; j < element.subjectsList.length; j++) {
          var subject = element.subjectsList[j]
          if (selections.subjects.includes(subject.name)) {
            invalid = false
            break
          }
        }
        if (invalid) {
          continue
        }
      }
      // Grade Filter
      if (selections.grades != undefined && selections.grades.length > 0) {
        if (element.isTeacher) {
          // teacher: targetGrade
          if (!that.listAContainsAtLeastOneFromListB(selections.grades, element.targetGrade)) {
            continue;
          }
        } else {
          // student: grade
          if (!that.listAContainsAtLeastOneFromListB(selections.grades, [element.grade])) {
            console.log(selections.grades, element.grade, "failed")
            continue;
          } else {
            console.log(selections.grades, element.grade, "passed")
          }
        }
      }
      // Identities(tType) Filter
      if (selections.identities != undefined && selections.universities.length > 0) {
        if (!selections.identities.includes(element.tType)) {
          continue;
        }
      }
      // Universities Filter
      if (selections.info == "teacher" && selections.universities != undefined && selections.universities.length > 0) {
        var passed = false
        if (selections.universities.includes("U0") 
          && (element.tUniversity.length < 4
           || element.tGraduate.length < 4
           || element.tDoctoral.length < 4)) {
          passed = true
        }
        if (!selections.universities.includes("U0") 
          && (selections.universities.includes(element.tUniversity) 
           || selections.universities.includes(element.tGraduate)
           || selections.universities.includes(element.tDoctoral))) {
          passed = true
        }
        if (!passed) {
          continue
        }
      }
      element.nickname = element.name.substring(0, 1)+"同学";
      if (element.type == "teacher") {
        element.isTeacher = true
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
        
      } else {
        element.isTeacher = false
      }
      if (element.gender == 0) {
        element.isMale = true
      } else {
        element.isMale = false
      }
      shownList.push(element)
    }
    that.setData({shownList: shownList})
  },
  navToNamecard: function (e) {
    var idx = e.currentTarget.dataset.index
    var item = that.data.shownList[idx]
    var url = '../card/card?item=' + JSON.stringify(item)
    // + item.type
    // url += "&id=" + item.id
    // url += "&description=" + item.description
    // url += "&name=" + item.nickname
    // url += "&hourly_pay=" + item.hourly_pay
    // url += "&subjects=" + JSON.stringify(item.subjectsList)
    // if (item.type == "teacher") {
    //   url += "&title=" + that.data.idToTeacherIdentity[parseInt(item.identity)]
    //   url += item.isMale ? "(男)" : "(女)"
    //   url += "&targetGrade=" + item.targetGrade
    // } else {
    //   url += "&grade=" + item.grade
    // }
    // var url = '../card/card?data=' + JSON.stringify(item)
    wx.navigateTo({
      url: url
    })
  },
  navToForm: function() {
    var url = that.data.selections.info=="teacher" ? '../find/find' : '../apply/apply';
    wx.navigateTo({
      url: url + '?region='+app.globalData.userCustomInfo.region
    })
  },
  navToFilter: function() {
    // lib-selection cannot be navTo because it is tab
    wx.navigateTo({
      url: '../lib-selection-bp/lib-selection-bp?info='+that.data.selections.info
    })
  },
  returnToMainPage: function() {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  onPullDownRefresh: function() {
    console.log("REFRESH!!")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showLoading({
      title: '正在更新...'
    })
    app.studentLibraryReadyCallback = function() {
      if (that.data.selectedObject == "student") {
        that.setupList(that.data.selections)
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    }
    app.teacherLibraryReadyCallback = function() {
      if (that.data.selectedObject == "teacher") {
        that.setupList(that.data.selections)
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    }
    app.getLibraryData(that.data.cityId)
  },
  /** Local Functions: listAContainsAtLeastOneFromListB
   */
  listAContainsAtLeastOneFromListB: function(listA, listB) {
    for (var j = 0; j < listA.length; j++) {
      var a = listA[j]
      if (listB.includes(a)) {
        return true
      }
    }
    return false
  }
})
