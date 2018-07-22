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
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    that.getUserIdAndHistories()
    that.getUserInfo()
    that.getSystemInfo()
    // var addressValues = wx.getStorageSync('userCustomerInfo').region
    // if (addressValues == undefined) {
    //   addressValues = ["山东省", "济南市", "市中区"]
    // }
    that.setupUserCustomInfo()
  },
  setupUserCustomInfo: function() {
    // These data should be stored in the cloud later.
    that.globalData.userCustomInfo = {region: ["山东省", "济南市", "市中区"]}
    var cityId = that.getCityId(that.globalData.userCustomInfo.region)
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
          //url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
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
            // wx.setStorageSync('openId', wxId)
            console.log('openId', wxId)
            that.getUserHistories(wxId)
            that.globalData.openId = wxId
          },
          fail: function (res) {
            console.log("fail to get openId")
          }
        })
      }
    })
  },
  getCityId: function(addressValues) {
    var provinceId = citys.provinceToId[addressValues[0]]
    var cityId = provinceId
    var citysInProvince = citys.citys[provinceId]
    for (var i = 0; i < citysInProvince.length; i++) {
      if (citysInProvince[i].name == addressValues[1]) {
        cityId = citysInProvince[i].id
        break
      }
    }
    console.log(cityId)
    return cityId
  },
  getProvinceUniversityId: function(provinceName) {
    for (var i = 0; i < universitys.provinces.length; i++) {
      if (universitys.provinces[i].name == provinceName) {
        return universitys.provinces[i].id
      }
    }
    return "0"
  },
  getLibraryData: function(cityId) {
    var bsurl = "https://api.zhexiankeji.com/education/baseStudent/search"
    wx.request({
      url: bsurl,
      data:  {"cityId":cityId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var bsresult = res.data.result
        var wurl = "https://api.zhexiankeji.com/education/work/search"
        wx.request({
          url: wurl,
          data:  {"cityId":cityId},
          header: {
            'content-type': 'application/json' 
          },
          method: "POST",
          success: function (res) {
            var wresult = res.data.result
            var studentLibrary = that.mapBsrAndWr(bsresult, wresult, "student")
            that.globalData.localStudentLibrary[cityId] = studentLibrary
            if (that.studentLibraryReadyCallback) {
              that.studentLibraryReadyCallback()
              that.studentLibraryReadyCallback = false
            }
            console.log('localStudentLibrary', studentLibrary)
          },
          fail: function (res) {
            console.log("fail to get localStudentLibrary 1", res)
          }
        })
      },
      fail: function (res) {
        console.log("fail to get localStudentLibrary 2", res)
      }
    })

    var bturl = "https://api.zhexiankeji.com/education/baseTeacher/search"
    wx.request({
      url: bturl,
      data:  {"cityId":cityId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var btresult = res.data.result
        var wturl = "https://api.zhexiankeji.com/education/workTeacher/search"
        wx.request({
          url: wturl,
          data:  {"cityId":cityId},
          header: {
            'content-type': 'application/json' 
          },
          method: "POST",
          success: function (res) {
            var wtresult = res.data.result
            var teacherLibrary = that.mapBtrAndWtr(btresult, wtresult, "teacher")
            that.globalData.localTeacherLibrary[cityId] = teacherLibrary
            console.log('localTeacherLibrary', teacherLibrary)
            if (that.teacherLibraryReadyCallback) {
              that.teacherLibraryReadyCallback()
              that.teacherLibraryReadyCallback = false
            }
          },
          fail: function (res) {
            console.log("fail to get localTeacherLibrary 1", res)
          }
        })
      },
      fail: function (res) {
        console.log("fail to get localTeacherLibrary 2", res)
      }
    })
    // console.log("global", that.globalData)
  },
  getUserHistories: function(wxId) {
    var bsurl = "https://api.zhexiankeji.com/education/baseStudent/search"
    wx.request({
      url: bsurl,
      data:  {"sWxid":wxId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var bsresult = res.data.result
        var wurl = "https://api.zhexiankeji.com/education/work/search"
        wx.request({
          url: wurl,
          data:  {"sWxid":wxId},
          header: {
            'content-type': 'application/json' 
          },
          method: "POST",
          success: function (res) {
            var wresult = res.data.result
            var studentHistory = that.mapBsrAndWr(bsresult, wresult, "student")
            // wx.setStorageSync('myStudentHistory', studentHistory)
            that.globalData.myStudentHistory = studentHistory
            console.log('myStudentHistory', studentHistory)
            if (that.personalStudentHistoriesReadyCallback) {
              that.personalStudentHistoriesReadyCallback()
              that.personalStudentHistoriesReadyCallback = false
            }
          },
          fail: function (res) {
            // wx.setStorageSync('myStudentHistory', [])
          }
        })
      },
      fail: function (res) {
        // wx.setStorageSync('myStudentHistory', [])
      }
    })
    var bturl = "https://api.zhexiankeji.com/education/baseTeacher/search"
    wx.request({
      url: bturl,
      data:  {"tWxid":wxId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var btresult = res.data.result
        var wturl = "https://api.zhexiankeji.com/education/workTeacher/search"
        wx.request({
          url: wturl,
          data:  {"tWxid":wxId},
          header: {
            'content-type': 'application/json' 
          },
          method: "POST",
          success: function (res) {
            var wtresult = res.data.result
            var teacherHistory = that.mapBtrAndWtr(btresult, wtresult, "teacher")
            // wx.setStorageSync('myTeacherHistory', teacherHistory)
            that.globalData.myTeacherHistory = teacherHistory
            console.log('myTeacherHistory', teacherHistory)
            if (that.personalTeacherHistoriesReadyCallback) {
              that.personalTeacherHistoriesReadyCallback()
              that.personalTeacherHistoriesReadyCallback = false
            }
          },
          fail: function (res) {
            // wx.setStorageSync('myTeacherHistory', [])
          }
        })
      },
      fail: function (res) {
        // wx.setStorageSync('myTeacherHistory', [])
      }
    })
  },
  mapBtrAndWtr: function(btresult, wtresult, type) {
    var result = []
    for (var i = 0; i < btresult.length; i++) {
      var bt = btresult[i]
      for (var j = 0; j < wtresult.length; j++) {
        var wt = wtresult[j]
        if (bt.id != wt.tId) {
          continue
        }
        bt.type = type
        bt.name = bt.tName
        bt.description = "未填写描述"
        if (bt.tDescribe != "")
          bt.description = bt.tDescribe
        bt.id = that.formatId(bt.id)
        bt.time = wt.tDirection
        bt.identity = bt.tType
        bt.gender = bt.tSex
        bt.subjects = ""
        bt.subjectsList = []
        bt.hourly_pay = wt.tPrice
        bt.targetGrade = wt.tAim.split("+")
        bt.isTeacher = true
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
        // console.log(bt)
        break;
      }
    }
    return result
  },
  mapBsrAndWr: function(bsresult, wresult, type) {
    var result = []
    for (var i = 0; i < bsresult.length; i++) {
      var bs = bsresult[i]
      for (var j = 0; j < wresult.length; j++) {
        var w = wresult[j]
        // console.log(i + " " + j + " : " + bs.id + " " +w.sId)
        if (bs.id != w.sId) {
          continue;
        }
        bs.type = type
        bs.name = bs.sName
        bs.description = "未填写描述"
        if (bs.sDescribe != "")
          bs.description = bs.sDescribe
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
  /** getInternshipData
   *
   * Get data from message lib, including internship & part-time job, maybe system messages in the future.
   * 
   * id: Id of poster.
   * mClass: 1 - verified; 2 - self-posted.
   * mType: 1 - internship; 2 - part-time.
   * mLevel: Minimal Reuirement (map to teacher.js id 1-7)
   * mId: Message Id.
   * mName: Name of the poster.
   * mTitle: Name of the position.
   * mContent: Must include "start_time", "end_time", "hourly_pay", "flexible_pay", "subjects", "worktime"
   * mDescribe: description to show.
   * mSource: Picture url
   * mStatus: 0 - soon; 1 - open; 2 - almost full
   */
  getInternshipData: function(cityId) {
    var murl = "https://api.zhexiankeji.com/education/message/search"
    wx.request({
      url: murl,
      data:  {"cityId":cityId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var result = res.data.result
        var localInternshipInfo = []
        var localParttimeInfo = []
        for (var i = 0; i < result.length; i++) {
          var cur = result[i]
          if (cur.mType == 1) {
            localInternshipInfo.push(that.buildInternshipMessage(cur))
          } else if (cur.mType == 2) {
            localParttimeInfo.push(that.buildInternshipMessage(cur))
          }
        }
        that.globalData.localInternshipInfo[cityId] = localInternshipInfo
        that.globalData.localParttimeInfo[cityId] = localParttimeInfo
      },
      fail: function (res) {
        console.log("fail to get Internship Message.", res)
      }
    })
  },
  buildInternshipMessage: function(message) {
    var status_pool = ["长期有效", "报名中", "即将报满", "已结束"]
    var content = JSON.parse(message.mContent)
    content.id = that.formatId(message.mId)
    content.institute = message.mName
    content.title = message.mTitle
    content.description = message.mDescribe
    content.picLink = message.mSource
    if (message.level >= 1 && message.level <= 7)
      content.minimal_level = teachers.grades[message.level-1].name // message.level = minimal_requirement.id
    else
      content.minimal_level = "无要求"
    content.status = status_pool[message.mStatus]
    console.log("buildInternshipMessage", content)
    return content
  },
  formatId: function (id) {
    var formattedId = "00000000000" + id
    return formattedId.substr(formattedId.length - idLength)
  },
  globalData: {
    needAuth: false,
    userInfo: null,
    systemInfo: null,
    openId: null,
    myStudentHistory: [],
    myTeacherHistory: [],
    localStudentLibrary: {},
    localTeacherLibrary: {},
    localInternshipInfo: [],
    localParttimeInfo: [],
    librarySelection: "", // For lib-selection part
  }
})