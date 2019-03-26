//app.js
const grades = require('utils/js/grade.js')
const teachers = require('utils/js/teacher.js')
const citys = require('utils/js/city.js')
const universitys = require('utils/js/university.js')
const idLength = 8

var that

App({
  onLaunch: function () {
    that = this

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    that.getUserIdAndHistories()
    that.getUserInfo()
    that.getSystemInfo()
    that.setupUserCustomInfo()

    console.log("globalData", that.globalData)
  },
  setupUserCustomInfo: function() {
    // These data should be stored in the cloud later.
    that.globalData.userCustomInfo = {region: ["山东省", "济南市", "市中区"]}
    var cityId = that.getCityId()
    that.getLibraryData(cityId)
    that.getInternshipData(cityId)
  },
  getUserInfo: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log("fail to get userInfo")
      }
    })
  },
  getSystemInfo: function() {
    wx.getSystemInfo({
      success: function (res) {
        console.log('systemInfo', res)
        that.globalData.systemInfo = res
      },
      fail: function (res) {
        console.log("fail to get sysInfo")
      }
    })
  },
  getUserIdAndHistories: function () {
    wx.login({
      success: function (res) {
        var code = res.code
        wx.request({
          url: 'https://api.zhexiankeji.com/education/wx/getOpenid?code=' + code,
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            var wxId  = ""
            if (res.data.openid != undefined) {
              wxId = res.data.openid
            } else {
              var obj = JSON.parse(res.data.result);
              wxId = obj.openid
            }
            that.globalData.openId = wxId

            // Will be used in studentInfoCallback
            var teacherReservationCallback = function(teacherReservations) {
              console.log("myTeacherReservations", teacherReservations)
              that.globalData.myTeacherReservations = teacherReservations
            }

            // Will be used in teacherInfoCallback
            var studentReservationCallback = function(studentReservations) {
              console.log("myStudentReservations", studentReservations)
              that.globalData.myStudentReservations = studentReservations
            }

            var studentInfoCallback = function(studentInfo) {
              that.globalData.myStudentHistory = studentInfo
              console.log('myStudentHistory', that.globalData.myStudentHistory)
              that.globalData.myStudentRegister = that.selectNewestData(studentInfo)
              console.log('myStudentRegister', that.globalData.myStudentRegister)
              if (that.globalData.myStudentRegister == null) {
                return
              }
              that.getReservationInfo({sId: that.globalData.myStudentRegister.sId, iType: 2, searchType:2}, teacherReservationCallback)
            }
            that.getStudentInfo({"sWxid":wxId}, studentInfoCallback)
            
            var teacherInfoCallback = function(teacherInfo) {
              that.globalData.myTeacherHistory = teacherInfo
              that.globalData.myTeacherRegister = that.selectNewestData(teacherInfo)
              console.log('myTeacherRegister', that.globalData.myTeacherRegister)
              if (that.globalData.myTeacherRegister == null) {
                return
              }
              that.getReservationInfo({tId: that.globalData.myTeacherRegister.tId, iType: 1, searchType:1}, studentReservationCallback)
            }
            that.getTeacherInfo({"tWxid":wxId}, teacherInfoCallback)
          },
          fail: function (res) {
            console.log("fail to get openId")
          }
        })
      }
    })
  },
  getRegion: function() {
    return that.globalData.userCustomInfo.region.slice()
  },
  getCityId: function() {
    var addressValues = that.globalData.userCustomInfo.region
    var provinceId = citys.provinceToId[addressValues[0]]
    var cityId = provinceId
    var citysInProvince = citys.citys[provinceId]
    for (var i = 0; i < citysInProvince.length; i++) {
      if (citysInProvince[i].name == addressValues[1]) {
        cityId = citysInProvince[i].id
        break
      }
    }
    return cityId
  },
  getLocalUniversities: function() {
    var provinceId = that.getProvinceUniversityId()
    var universities =  universitys.universitys[provinceId].slice()
    return universities
  },
  getProvinceUniversityId: function() {
    var provinceName = that.globalData.userCustomInfo.region[0]
    for (var i = 0; i < universitys.provinces.length; i++) {
      if (universitys.provinces[i].name == provinceName) {
        return universitys.provinces[i].id
      }
    }
    return "0"
  },
  setGlobalRegion: function(region) {
    that.globalData.userCustomInfo = {region: region}
  },
  getLibraryData: function() {
    var cityId = that.getCityId()
    var studentInfoCallback = function(studentInfo) {
      that.globalData.localStudentLibrary[cityId] = studentInfo
      console.log('studentLibData', studentInfo)
    }
    that.getStudentInfo({"cityId":cityId}, studentInfoCallback)
    
    var teacherInfoCallback = function(teacherInfo) {
      that.globalData.localTeacherLibrary[cityId] = teacherInfo
      console.log('teacherLibData', teacherInfo)
    }
    that.getTeacherInfo({"cityId":cityId}, teacherInfoCallback)
  },
  getReservationInfo: function(searchData, callback) {
    var intention_url = "https://api.zhexiankeji.com/education/intention/search"
    console.log("getReservationInfo", searchData)
    wx.request({
      url: intention_url,
      data:  searchData,
      header: {'content-type': 'application/json'},
      method: "POST",
      success: function (res) {
        // console.log("xiaoguang debug", searchData, res)
        callback(res.data.result)
      },
      fail: function (res) {console.log("failed", res)}
    })
  },
  getStudentInfo: function(searchData, callback) {
    var basic_student_url = "https://api.zhexiankeji.com/education/baseStudent/search"
    // if (select) {
    //   basic_student_url = "https://api.zhexiankeji.com/education/student/select"
    // }
    wx.request({
      url: basic_student_url,
      data:  searchData,
      header: {'content-type': 'application/json'},
      method: "POST",
      success: function (res) {
        var basic_student_result = res.data.result
        var work_student_url = "https://api.zhexiankeji.com/education/work/search"
        wx.request({
          url: work_student_url,
          data:  searchData,
          header: {'content-type': 'application/json'},
          method: "POST",
          success: function (res) {
            
            var studentInfo = that.constructStudentInfo(basic_student_result, res.data.result)
            callback(studentInfo)
          },
          fail: function (res) {console.log("failed", res)}
        })
      },
      fail: function (res) {console.log("failed", res)}
    })
  },
  getTeacherInfo: function(searchData, callback) {
    var basic_teacher_url = "https://api.zhexiankeji.com/education/baseTeacher/search"
    wx.request({
      url: basic_teacher_url,
      data:  searchData,
      header: {'content-type': 'application/json'},
      method: "POST",
      success: function (res) {
        var basic_teacher_result = res.data.result
        var work_teacher_url = "https://api.zhexiankeji.com/education/workTeacher/search"
        wx.request({
          url: work_teacher_url,
          data:  searchData,
          header: {'content-type': 'application/json'},
          method: "POST",
          success: function (res) {
            var teacherInfo = that.constructTeacherInfo(basic_teacher_result, res.data.result)
            callback(teacherInfo);
          },
          fail: function (res) {console.log("failed", res)}
        })
      },
      fail: function (res) {console.log("failed", res)}
    })
  },
  constructTeacherInfo: function(btresult, wtresult) {
    console.log("constructTeacherInfo", btresult, wtresult)
    var result = []
    for (var i = 0; i < btresult.length; i++) {
      var bt = btresult[i]
      for (var j = 0; j < wtresult.length; j++) {
        var wt = wtresult[j]
        if (bt.id != wt.tId) {
          continue
        }
        bt.type = "teacher"
        bt.name = bt.tName
        bt.nickname = bt.tName.substring(0, 1)+"老师";
        bt.description = "未填写描述"
        if (bt.tDescribe != "")
          bt.description = bt.tDescribe
        bt.tId = bt.id
        bt.id = that.formatId(bt.id)
        bt.time = wt.tDirection
        bt.identity = bt.tType
        bt.gender = bt.tSex
        bt.subjects = ""
        bt.subjectsList = []
        bt.hourly_pay = wt.tPrice
        bt.targetGrade = wt.tAim.split("+")
        bt.targetGradeReadable = that.getTargetGradeReadable(bt.targetGrade)
        bt.isTeacher = true
        bt.title = "未审核教师"
        if (bt.tTitle != "") {
          bt.title = bt.tTitle
        }
        if (bt.tUniversity != "") {
          bt.university = that.getUniversityName(bt.tUniversity)
        }
        if (bt.tGraduate != "") {
          bt.universityMaster = that.getUniversityName(bt.tGraduate)
        }
        if (bt.tDoctoral != "") {
          bt.universityPhd = that.getUniversityName(bt.tDoctoral)
        }
        var subjectsList = wt.tSubject.split("+")
        for (var k = 0; k < subjectsList.length; k++) {
          bt.subjectsList.push({name: subjectsList[k]})
          if (k == 4) {
            bt.subjects += "等"
          } else if (k < 4) {
            bt.subjects += subjectsList[k] + " "
          }
        }
        result.push(bt)
        break;
      }
    }
    console.log("result", result)
    return result
  },
  formatId: function (id) {
    var formattedId = "00000000000" + id
    return formattedId.substr(formattedId.length - idLength)
  },
  constructStudentInfo: function(bsresult, wresult) {
    var result = []
    for (var i = 0; i < bsresult.length; i++) {
      var bs = bsresult[i]
      for (var j = 0; j < wresult.length; j++) {
        var w = wresult[j]
        // console.log(i + " " + j + " : " + bs.id + " " +w.sId)
        if (bs.id != w.sId) {
          continue;
        }
        bs.type = "student"
        bs.name = bs.sName
        bs.nickname = bs.sName.substring(0, 1)+"同学";
        bs.description = "未填写描述"
        if (bs.sDescribe != "")
          bs.description = bs.sDescribe
        bs.sId = bs.id
        bs.id = that.formatId(bs.id)
        bs.time = w.wType
        bs.grade = grades.idToGrades[w.wGrade]
        bs.subjects = ""
        bs.subjectsList = []
        bs.gender = bs.sSex
        bs.isTeacher = false
        var subjectsAndPoints = w.wSubject.split("+")
        for (var k = 0; k < subjectsAndPoints.length; k++) {
          var sap = subjectsAndPoints[k].split(",")
          bs.subjectsList.push({name: sap[0], point: sap[1]})
          if (k == 4) {
            bs.subjects += "等"
          } else if (k < 4) {
            bs.subjects += sap[0] + " "
          }
        }
        bs.hourly_pay = w.wPrice
        bs.education = w.wEducation
        var demand
        if (w.wSex == 2 && w.wEducation == "") {
          demand = "无要求"
        } else if (w.wEducation == "") {
          demand = w.wSex == 0 ? "男教员" : "女教员"
        } else if (w.wSex == 2) {
          demand = w.wEducation
        } else {
          demand = w.wEducation + ", "
          demand += w.wSex == 0 ? "男教员" : "女教员"
        }
        bs.demand = demand
        result.push(bs)
        // console.log(bs)
        break;
      }
    }
    return result
  },
  getUniversityName: function(uid) {
    return universitys.idToUniversitys[uid]
  },
  getTargetGradeReadable: function(gradeList) {
    // Construct targetGrade String
    var targetGradeReadable = []
    var schoolBitMap = [false, false, false, false, false, false, false, 
                        false, false, false, false, false, false, false]
    var numToChar = ["", "一", "二", "三", "四", "五", "六", "一", "二", "三", "一", "二", "三"]
    for (var i = 0; i < gradeList.length; i++) {
      var grade = grades.gradesToId[gradeList[i]]
      if (grade == undefined) {
        continue 
      }
      var idx = parseInt(grade.substring(1))
      schoolBitMap[idx] = true
    }
    var start = 0
    var end = 0
    for (var i = 1; i <= 12; i++) {
      if (schoolBitMap[i]) {
        if (start == 0) {
          start = i
        }
        end = i
      } 
      if (!schoolBitMap[i] || i == 6 || i == 9 || i == 12) {
        if (start == 0) {
          continue
        }
        var lvl = "小"
        if (i > 6 && i <= 9) {
          lvl = "初"
        } else if (i > 9 && i <= 12) {
          lvl = "高"
        }
        if (start == end) {
          targetGradeReadable.push(lvl + numToChar[start])
        } else {
          targetGradeReadable.push(lvl + numToChar[start] + "到" + lvl + numToChar[end])
        }
        start = 0
        end = 0
      }
    }
    return targetGradeReadable
  },
  selectNewestData: function(lst) {
    if (lst == null || lst.length <= 0) {
      return null
    }
    lst.sort(function(a, b) {
      if (a.updateTime < b.updateTime) return 1;
      if (a.updateTime > b.updateTime) return -1;
      return 0
    });
    return lst[0]
  },
  // Not ready
  getInternshipData: function() {
    var cityId = that.getCityId()
  },
  globalData: {
    needAuth: false,
    userInfo: null,
    systemInfo: null,
    openId: null,
    // Deprecated: 全部注册信息
    myStudentHistory: [],
    myTeacherHistory: [],
    // 唯一注册信息
    myStudentRegister: null,
    myTeacherRegister: null,
    myStudentReservations: [],
    myTeacherReservations: [],
    localStudentLibrary: {},
    localTeacherLibrary: {},
    localInternshipInfo: [],
    localParttimeInfo: [],
    librarySelection: "",
  }
})