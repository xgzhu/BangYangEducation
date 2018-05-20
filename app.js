//app.js
const grades = require('utils/js/grade.js')
const citys = require('utils/js/city.js')
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
    var addressValues = wx.getStorageSync('userCustomerInfo').region
    if (addressValues == undefined) {
      addressValues = ["山东省", "济南市", "市中区"]
    }
    that.getLibraryData(that.getCityId(addressValues))
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
        var appId = "wx28e4a84ebaa9d9f4"
        var code = res.code
        var secret = "3f0559dbc6a747a5c6888d6539610bf6"
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
            wx.setStorageSync('openId', wxId)
            console.log('openId', wxId)
            that.getUserHistories(wxId)
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
  getLibraryData: function(cityId) {
    var bsurl = "https://www.zhexiankeji.com/education/baseStudent/search"
    wx.request({
      url: bsurl,
      data:  {"cityId":cityId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var bsresult = res.data.result
        var wurl = "https://www.zhexiankeji.com/education/work/search"
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

    var bturl = "https://www.zhexiankeji.com/education/baseTeacher/search"
    wx.request({
      url: bturl,
      data:  {"cityId":cityId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var btresult = res.data.result
        var wturl = "https://www.zhexiankeji.com/education/workTeacher/search"
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
    var bsurl = "https://www.zhexiankeji.com/education/baseStudent/search"
    wx.request({
      url: bsurl,
      data:  {"sWxid":wxId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var bsresult = res.data.result
        var wurl = "https://www.zhexiankeji.com/education/work/search"
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
            wx.setStorageSync('myStudentHistory', studentHistory)
            console.log('myStudentHistory', studentHistory)
            if (that.personalStudentHistoriesReadyCallback) {
              that.personalStudentHistoriesReadyCallback()
              that.personalStudentHistoriesReadyCallback = false
            }
          },
          fail: function (res) {
            wx.setStorageSync('myStudentHistory', [])
          }
        })
      },
      fail: function (res) {
        wx.setStorageSync('myStudentHistory', [])
      }
    })
    var bturl = "https://www.zhexiankeji.com/education/baseTeacher/search"
    wx.request({
      url: bturl,
      data:  {"tWxid":wxId},
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      success: function (res) {
        var btresult = res.data.result
        var wturl = "https://www.zhexiankeji.com/education/workTeacher/search"
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
            wx.setStorageSync('myTeacherHistory', teacherHistory)
            console.log('myTeacherHistory', teacherHistory)
            if (that.personalTeacherHistoriesReadyCallback) {
              that.personalTeacherHistoriesReadyCallback()
              that.personalTeacherHistoriesReadyCallback = false
            }
          },
          fail: function (res) {
            wx.setStorageSync('myTeacherHistory', [])
          }
        })
      },
      fail: function (res) {
        wx.setStorageSync('myTeacherHistory', [])
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
        var id = "00000000000" + bt.id
        bt.id = id.substr(id.length - idLength)
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
        var id = "00000000000" + bs.id
        bs.id = id.substr(id.length - idLength)
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
  getMockLibraryData: function() {
    var t1 = {type:"teacher", id:"00000001", sName:"王元鹏", sSex:1,  hourly_pay:"200",
      sDescribe:"快学教育创始人，著名教育家，山东省实验中学优秀学子。", sDirection: 0,
      subjects:["语文", "体育"], 
      university:"74", universityMaster:"75", identity:3, targetGrade:["初中", "高中"],
      postDate:"2018-04-20"}
    var t2 = {type:"teacher", id:"00000003", name:"邢宽", gender:"male",  hourly_pay:"200",
      description:"很聪明的程序猿，很喜欢教育小朋友们。", subjects:["数学", "英语", "计算机"], 
      university:"46", universityMaster:"1", universityPhd:"1", identity:4, targetGrade:["高中"],
      postDate:"2018-04-21"}
    var s1 = {type:"student", id:"00000002", name:"徐艺唯", gender:"female", 
      description:"爱哭的小女生。但是很聪明。", hourly_pay:"150",
      subjects:["数学"], point:"成绩保密", grade:"小学一年级",
      postDate:"2018-04-21"}
    var t3 = {type:"teacher", id:"00000005", name:"佟丽娅", gender:"female", 
      description:"明星。", subjects:["数学", "英语", "物理", "化学"],  hourly_pay:"1000",
      university:"24", identity:5, targetGrade:["高中"],
      postDate:"2018-04-21"}
    var library = [t1, t2, s1, t3]
    wx.setStorageSync('fakelibrary', library)
    var i1 = {id:"00000666", institute: "新东方", subjects:["数学", "英语", "物理", "化学"], 
      hourly_pay:"75", flexible_pay: false, week_length: 24, address: ["山东省", "济南市", "槐荫区"],
      description:"新东方招募老师啦，一次课两小时，要求一周至少上2次课，时长半年。"}
    var i2 = {id:"00000888", institute: "蓝翔", subjects:["其他"], 
      hourly_pay:"40", flexible_pay: true, week_length: 50, address: ["山东省", "济南市", "市中区"],
      description:"学厨师，挖掘机，找蓝翔。蓝翔高级技工学校招聘实习老师。工资可议。"}
    var internship = [i1, i2]
    wx.setStorageSync('fakeInternship', internship)
  },
  globalData: {
    needAuth: false,
    userInfo: null,
    systemInfo: null,
    localStudentLibrary: {},
    localTeacherLibrary: {}
  }
})