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
  onShow: function (e) {
    that = this
    // console.log(app.globalData)
    // var areaValues = wx.getStorageSync('userCustomerInfo').region
    var areaValues = app.globalData.userCustomInfo.region
    var cityId = app.getCityId(areaValues)
    that.setData({
      subjects: subjects.subjects.slice(),
      uProvince: universitys.provinces.slice(),
      idToTeacherIdentity: teachers.reversedGrade.slice(),
      idToUniversitys: universitys.idToUniversitys,
      areaValues: areaValues,
      region: areaValues[1],
      cityId: cityId,
    })

    var province = areaValues[0]
    var foundProvince = that.data.uProvince.find(function(element) {
      return element.name == province;
    });
    if (foundProvince != undefined) {
      var localUniversitys = universitys.universitys[foundProvince.id].slice()
      localUniversitys.pop()
      while (localUniversitys.length > 6) {
        localUniversitys.pop()
      }
      that.setData({universitys: localUniversitys})
    }

    // var subjectSelected = wx.getStorageSync('librarySelection')
    var subjectSelected = app.globalData.librarySelection
    console.log(subjectSelected)
    if (subjectSelected != "") {
      // wx.setStorageSync('librarySelection', "")
      app.globalData.librarySelection = ""
      that.setData({
        selectedSubjects: [subjectSelected],
        subjectsInfo: subjectSelected,
        teacherChecked: true,
        selectedObject: "teacher",
        objectsInfo: "教员信息"
      })
      var subjectsLocalCopy = that.data.subjects
      for (var i = 0; i < subjectsLocalCopy.length; i++) {
        if (subjectsLocalCopy[i].name == subjectSelected) {
          subjectsLocalCopy[i].checked = true
          that.setData({subjects: subjectsLocalCopy})
        }
      }
    }
    that.setupList()
    console.log(that.data)
  },
  setupList: function() {
    var allList
    console.log("globalData",app.globalData)
    console.log("thatData",that.data)
    if (that.data.selectedObject == "teacher") {
      allList = app.globalData.localTeacherLibrary[that.data.cityId]
    } else if (that.data.selectedObject == "student") {
      allList = app.globalData.localStudentLibrary[that.data.cityId]
    }
    if (allList == null) {
      that.setData({shownList: []})
      wx.startPullDownRefresh()
      return;
    }
    console.log("allList",allList)
    var shownList = []
    for (var i = 0; i < allList.length; i++) {
      var element = allList[i]
      if (that.data.selectedObject != element.type) {
        continue
      }
      if (that.data.selectedGender.length != 0 
        && !that.data.selectedGender.includes(element.gender.toString())) {
        continue
      }
      if (that.data.selectedObject == "teacher" 
        && that.data.selectedUniversitys.length != 0) {
          // console.log("U--->0")
        if (that.data.selectedUniversitys.includes("U0") 
          && element.tUniversity.length >= 4
          && element.tGraduate.length >= 4
          && element.tDoctoral.length >= 4) {
          // console.log("U--->1")
          continue
        }
        if (!that.data.selectedUniversitys.includes("U0") 
          && !that.data.selectedUniversitys.includes(element.tUniversity)
          && !that.data.selectedUniversitys.includes(element.tGraduate)
          && !that.data.selectedUniversitys.includes(element.tDoctoral)) {
          // console.log("U--->2")
          continue
        }
      }
      if (that.data.selectedSubjects.length != 0) {
        var invalid = true
        for (var j = 0; j < element.subjectsList.length; j++) {
          var subject = element.subjectsList[j]
          if (that.data.selectedSubjects.includes(subject.name)) {
            invalid = false
            break
          }
        }
        if (invalid) {
          console.log(that.data.selectedSubjects)
          console.log(element.subjects)
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
  openFilter: function() {
    var animation1 = wx.createAnimation({
      duration: 500,
        timingFunction: 'ease',
    })
    var animation2 = wx.createAnimation({
      duration: 700,
        timingFunction: 'ease',
    })
    that.animation1 = animation1
    that.animation2 = animation2
    animation1.scaleY(40).step()
    animation2.translateX(375).step()

    that.setData({
      filterAnimation:animation1.export(),
      dividerAnimation:animation2.export(),
      title_display:"none",
      filterOpen: true
    })

    console.log(that.data)
  },
  saveFilter: function() {
    if (that.data.regionMayChanged) {
      var currentRegion = that.data.currentAreaValues
      var newRegion = that.data.areaValues
      var cityId = app.getCityId(newRegion)
      that.setData({regionMayChanged: false, cityId:cityId})
      if (that.cityId != cityId && app.globalData.localStudentLibrary[cityId] == undefined) {
        console.log("NEW REGION!!", cityId)
        that.setData({shownList: []})
        wx.showLoading({
          title: '正在更新...'
        })
        app.studentLibraryReadyCallback = function() {
          if (that.data.selectedObject == "student") {
            that.setupList()
            wx.hideLoading()
          }
        }
        app.teacherLibraryReadyCallback = function() {
          if (that.data.selectedObject == "teacher") {
            that.setupList()
            wx.hideLoading()
          }
        }
        app.getLibraryData(cityId)
      } else {
        that.setData({regionMayChanged: false})
        that.setupList()
      }  
    } else {
      that.setupList()
    }

    var animation1 = wx.createAnimation({
      duration: 700,
        timingFunction: 'ease',
    })
    var animation2 = wx.createAnimation({
      duration: 700,
        timingFunction: 'ease',
    })
    that.animation1 = animation1
    that.animation2 = animation2
    animation1.scaleY(1/40).step()
    animation2.translateX(-375).step()

    that.setData({
      filterAnimation:animation1.export(),
      dividerAnimation:animation2.export(),
      filterOpen: false
    })

    setTimeout(function() {
      that.setData({
        title_display:""
      })
    }.bind(that), 500)

  },
  selectUniversityFilter: function(e) {
    that.setData({selectedUniversitys: e.detail.value})
  },
  selectGenderFilter: function(e) {
    that.setData({selectedGender: e.detail.value})
  },
  selectSubjectFilter: function(e) {
    that.setData({selectedSubjects: e.detail.value})
    if (that.data.selectedSubjects.length == 0 || that.data.selectedSubjects.length == that.data.subjects.length) {
      that.setData({subjectsInfo: "全部科目"})
    } else {
      var i = 1
      var subjectsInfo=that.data.selectedSubjects[0]
      for (i = 1; i < 3; i++) {
        if (i >= that.data.selectedSubjects.length)
          break
        subjectsInfo = subjectsInfo + "," + that.data.selectedSubjects[i]
      }
      if (i < that.data.selectedSubjects.length) {
        subjectsInfo = subjectsInfo + "..."
      }
      that.setData({subjectsInfo: subjectsInfo})
    }
  },
  selectRegionFilter: function(e) {
    var currentRegion = that.data.areaValues
    that.setData({
      regionMayChanged: true,
      areaValues: e.detail.value,
      currentAreaValues: currentRegion,
      region: e.detail.value[1],
    })
    console.log(e)
  },
  selectObjectFilter: function(e) {
    console.log(e)
    that.setData({selectedObject: e.detail.value})
    if (that.data.selectedObject == "teacher") {
      that.setData({objectsInfo: "教员信息"})
    } else {
      that.setData({objectsInfo: "学生信息"})
    }
  },
  navToNamecard: function (e) {
    var idx = e.currentTarget.dataset.index
    var item = that.data.shownList[idx]
    var url = '../card/card?type=' + item.type
    url += "&id=" + item.id
    url += "&description=" + item.description
    url += "&name=" + item.nickname
    url += "&hourly_pay=" + item.hourly_pay
    url += "&subjects=" + JSON.stringify(item.subjectsList)
    if (item.type == "teacher") {
      url += "&title=" + that.data.idToTeacherIdentity[parseInt(item.identity)]
      url += item.isMale ? "(男)" : "(女)"
      url += "&targetGrade=" + item.targetGrade
    } else {
      url += "&grade=" + item.grade
    }
    // var url = '../card/card?data=' + JSON.stringify(item)
    wx.navigateTo({
      url: url
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
        that.setupList()
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    }
    app.teacherLibraryReadyCallback = function() {
      if (that.data.selectedObject == "teacher") {
        that.setupList()
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    }
    app.getLibraryData(that.data.cityId)
  },
})
