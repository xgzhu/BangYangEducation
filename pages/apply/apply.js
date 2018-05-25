// pages/apply/apply.js
const app = getApp()
const grades = require('../../utils/js/grade.js')
const subjects = require('../../utils/js/subject.js')
const characters = require('../../utils/js/character.js')
const teachers = require('../../utils/js/teacher.js')
const universitys = require('../../utils/js/university.js')
const citys = require('../../utils/js/city.js')
var curYear = new Date().getFullYear()
var that

const invalid = 100

Page({
  /**
   * 页面的初始数据
   */
  data: {
    identityValue: invalid,
    identitys: [],
    identityInfo: "请选择当前身份",
    collegeInfo: "请选择本科学校",
    collegeInfoMaster: "请选择硕士学校",
    collegeInfoPhd: "请选择博士学校",
    entranceYearInfo: "",
    addressValues: ["全部","全部","全部"],
    tEducations: ['专科','本科','硕士','博士','博士后'],
    tEducation: '本科',
    page: 1,
    birthInfo: '请选择出生日期',
    birthValue: '1995-01-01',
    examScoreDisabled: false,
    gradeInfo: "请选择目标年级",
    subjectInfo: "请选择目标科目",
    times:[
      { name: '平时', value: 1},
      { name: '周末', value: 2},
      { name: '假期', value: 4},
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    var identitys = teachers.grades.slice()
    identitys.splice(0, 1)
    that.setData({
      identitys: identitys,
      uProvince: universitys.provinces,
      universitys: universitys.universitys,
      provinceAndUniversitys: [universitys.provinces, universitys.universitys["1"]],
      provinceAndUniversitysMaster: [universitys.provinces, universitys.universitys["1"]],
      provinceAndUniversitysPhd: [universitys.provinces, universitys.universitys["1"]],
      puValue: ["北京", "清华大学"],
      puValueMaster: ["北京", "清华大学"],
      puValuePhd: ["北京", "清华大学"],
      entranceYearInfo: curYear + "年",
      entranceYears: [(curYear-9)+"年", (curYear-8)+"年", (curYear-7)+"年", (curYear-6)+"年", (curYear-5)+"年", (curYear-4)+"年", (curYear-3)+"年", (curYear-2)+"年", (curYear-1)+"年", (curYear)+"年"],
      provinceToId: citys.provinceToId,
      provinces: citys.provinces.slice(),
      citys: citys.citys
    })
    if (options.region != "") {
      that.setData({
        addressValues: options.region.split(","),})
    }
    // prepare grade
    var gradelist = grades.grades[0].name
    for (var i = 1; i < grades.grades.length; i++) {
      gradelist += "+" + grades.grades[i].name
    }
    var subjectList = subjects.subjects[0].name
    for (var i = 1; i < subjects.subjects.length; i++) {
      subjectList += "+" + subjects.subjects[i].name
    }
    that.setData({gradelist:gradelist, subjectList:subjectList})
    wx.setStorageSync("tAim", "")
    wx.setStorageSync("tSubject", "")
    console.log(that.data)
  },
  onShow: function () {
    var gradeInfo = wx.getStorageSync("tAim")
    if (gradeInfo != undefined && gradeInfo != "") {
      // if (gradeInfo > 10) {

      // }
      that.setData({gradeInfo:gradeInfo, error_grade: ""})
    }
    var subjectInfo = wx.getStorageSync("tSubject")
    if (subjectInfo != undefined && subjectInfo != "") {
      // if (subjectInfo > 10) {

      // }
      that.setData({subjectInfo:subjectInfo, error_subject: ""})
    }
  },
  // 输入结束后的检查
  finishTime: function(e) {
    that.setData({error_time: ""})
  },
  finishSName: function(e) {
    if (e.detail.value != "") {
      that.setData({error_name:""})
    }
  },
  finishPhone: function(e) {
    if (e.detail.value.length == 11) {
      that.setData({error_phone:""})
    }
  },
  finishEdu: function(e) {
    if (e.detail.value != "") {
      var idx = parseInt(e.detail.value)
      that.setData({error_edu:"", tEducation:that.data.tEducations[idx]})
    }
  },
  finishGender: function() {
    that.setData({error_gender: ""})
  },
  finishIdentity: function (e) {
    var idx = e.detail.value
    that.setData({
      identityInfo: that.data.identitys[idx].name,
      identityValue: that.data.identitys[idx].id,
      error_identity: "",
    })
    switch (idx) {
      case 2: that.setData({tEducation: "本科"}); break;
      case 3: that.setData({tEducation: "硕士"}); break;
      case 4: that.setData({tEducation: "博士"}); break;
      default: break;
    }
  },
  finishEntranceYear: function (e) {
    var idx = e.detail.value
    that.setData({
      entranceYearInfo: that.data.entranceYears[idx],
    })
  },
  changeUniversityProvince: function (e) {
    if (e.detail.column != 0) {
      return
    }
    var level = parseInt(e.currentTarget.dataset.level)
    var provinceId = that.data.uProvince[e.detail.value].id
    var universityList = universitys.universitys[provinceId]
    console.log(provinceId, universityList)
    if (level == 0) {
      that.setData({provinceAndUniversitys: [universitys.provinces, universityList],})
    }
    else if (level == 1) {
      that.setData({provinceAndUniversitysMaster: [universitys.provinces, universityList],})
    }
    else if (level == 2) {
      that.setData({provinceAndUniversitysPhd: [universitys.provinces, universityList],})
    }
  },
  finishUniversity: function (e) {
    var level = parseInt(e.currentTarget.dataset.level)
    var value = e.detail.value
    if (level == 0) {
      var college = that.data.provinceAndUniversitys[1][value[1]]
      var collegeInfo = college.name
      if (collegeInfo == "其他高校") {
        collegeInfo = that.data.provinceAndUniversitys[0][value[0]].name + collegeInfo
      }
      that.setData({
        error_college: "",
        college: college,
        collegeInfo: collegeInfo,
      })
    } else if (level == 1) {
      var college = that.data.provinceAndUniversitysMaster[1][value[1]]
      var collegeInfo = college.name
      if (collegeInfo == "其他高校") {
        collegeInfo = that.data.provinceAndUniversitysMaster[0][value[0]].name + collegeInfo
      }
      that.setData({
        error_collegeMaster: "",
        collegeMaster: college,
        collegeInfoMaster: collegeInfo,
      })
    } else if (level == 2) {
      var college = that.data.provinceAndUniversitysPhd[1][value[1]]
      var collegeInfo = college.name
      if (collegeInfo == "其他高校") {
        collegeInfo = that.data.provinceAndUniversitysPhd[0][value[0]].name + collegeInfo
      }
      that.setData({
        error_collegePhd: "",
        collegePhd: college,
        collegeInfoPhd: collegeInfo,
      })
    }
  },
  finishAddress: function (e) {
    console.log(e)
    that.setData({
      error_address: "",
      addressValues: e.detail.value,
    })
  },
  finishBirthday: function (e) {
    that.setData({
      error_birthday: "",
      birthInfo: e.detail.value,
      birthValue: e.detail.value,
    })
  },
  finishDirection: function(e) {
    that.setData({error_direction: ""})
  },
  finishCollegeCustom: function(e) {
    if (e.detail.value != "")
      that.setData({error_collegeCustom: ""})
  },
  finishSchool: function(e) {
    if (e.detail.value != "")
      that.setData({error_school: ""})
  },
  finishProgram: function(e) {
    if (e.detail.value != "")
      that.setData({error_program: ""})
  },
  finishStudentId: function(e) {
    if (e.detail.value != "")
      that.setData({error_student_id: ""})
  },
  finishHighSchool: function(e) {
    if (e.detail.value != "")
      that.setData({error_high_school: ""})
  },
  finishExamScore: function(e) {
    if (e.type=="blur" && e.detail.value != "") {
      that.setData({error_exam_score: ""})
    } else if (e.type=="change" && e.detail.value.length != 0) {
      that.setData({error_exam_score: "", examScoreDisabled: true})
    } else if (e.type=="change" && e.detail.value.length == 0) {
      that.setData({examScoreDisabled: false})
    }
  },
  selectGrade: function() {
    wx.navigateTo({
      url: '../selectionlist/selectionlist?name=tAim&list='+that.data.gradelist
    });
  },
  selectSubject: function() {
    wx.navigateTo({
      url: '../selectionlist/selectionlist?name=tSubject&list='+that.data.subjectList
    });
  },
  validateInput: function (data, page) {
    console.log(data)
    var success = true
    if (page >= 1) {
      if (data.tName == "") {
        that.setData({error_name: "error"})
        success = false
      }
      if (data.tSex == invalid) {
        that.setData({error_gender: "error"})
        success = false
      }
      if (that.data.identityValue == invalid) {
        that.setData({error_identity: "error"})
        success = false
      }
      if (data.tEducation == "") {
        that.setData({error_edu: "error"})
        success = false
      }
      if (data.tPhone == "" || data.tPhone.length != 11) {
        that.setData({error_phone: "error"})
        success = false
      }
    } 
    if (page >= 2) {
      if (data.tScore == "" && that.data.examScoreDisabled == false) {
        that.setData({error_exam_score: "error"})
        success = false
      }
      if (data.tHighschool == "") {
        that.setData({error_high_school: "error"})
        success = false
      }
      if (that.data.birthInfo == "请选择出生日期") {
        that.setData({error_birthday: "error"})
        success = false
      }
      if (data.wStudentId == "") {
        that.setData({error_student_id: "error"})
        success = false
      }
      if (data.tMajor == "") {
        that.setData({error_program: "error"})
        success = false
      }
      if (data.wSchool == "") {
        that.setData({error_school: "error"})
        success = false
      }
      if (data.wDirection == "") {
        that.setData({error_direction: "error"})
        success = false
      }
      if (that.data.identityValue >= 2 && that.data.identityValue <= 5 && that.data.collegeInfo == "请选择本科学校") {
        that.setData({error_college: "error"})
        success = false
      }
      if (that.data.identityValue >= 3 && that.data.identityValue <= 5 && that.data.collegeInfoMaster == "请选择硕士学校") {
        that.setData({error_collegeMaster: "error"})
        success = false
      }
      if (that.data.identityValue >= 4 && that.data.identityValue <= 5 && that.data.collegeInfoPhd == "请选择博士学校") {
        that.setData({error_collegePhd: "error"})
        success = false
      }
      if (that.data.identityValue >= 6 && that.data.identityValue <= 7 && data.collegeCustom == "") {
        that.setData({error_collegeCustom: "error"})
        success = false
      }
    }
    if (page >= 3) {
      if (data.tDirection == 0) {
        that.setData({error_time: "error"})
        success = false
      }
      if (that.data.gradeInfo == "请选择目标年级") {
        that.setData({error_grade: "error"})
        success = false
      }
      if (that.data.subjectInfo == "请选择目标科目") {
        that.setData({error_subject: "error"})
        success = false
      }
    }
    return success
  },
  getTimeType: function (wTypes) {
    var wType = 0
    for (var i = 0; i < wTypes.length; i++) {
      wType += parseInt(wTypes[i])
    }
    return wType
  },
  nextStep: function (e) {
    e.detail.value.tType = that.data.identityValue
    e.detail.value.tSex = parseInt(e.detail.value.tSex)
    e.detail.value.tEducation = that.data.tEducation
    if (e.detail.value.tUniversity != undefined && that.data.collegeInfo != "请选择本科学校")
      e.detail.value.tUniversity = "U"+that.data.provinceAndUniversitys[1][e.detail.value.tUniversity[1]].id.toString()
    if (e.detail.value.tGraduate != undefined && that.data.collegeInfoMaster != "请选择硕士学校")
      e.detail.value.tGraduate = "U"+that.data.provinceAndUniversitysMaster[1][e.detail.value.tGraduate[1]].id.toString()
    if (e.detail.value.tDoctoral != undefined && that.data.collegeInfoPhd != "请选择博士学校")
      e.detail.value.tDoctoral = "U"+that.data.provinceAndUniversitysPhd[1][e.detail.value.tDoctoral[1]].id.toString()
    if (that.data.examScoreDisabled == true)
      e.detail.value.tScore = 1000
    e.detail.value.cityId = app.getCityId(that.data.addressValues)
    e.detail.value.tArea = that.data.addressValues[2]
    if (e.detail.value.tDirection != undefined)
      e.detail.value.tDirection = that.getTimeType(e.detail.value.tDirection)
    // e.detail.value.tWxid = wx.getStorageSync('openId')
    e.detail.value.tWxid = app.globalData.openId
    e.detail.value.tAim = wx.getStorageSync('tAim')
    e.detail.value.tSubject = wx.getStorageSync('tSubject')
    var formDataStr = JSON.stringify(e.detail.value)
    console.log('form发生了submit事件，携带数据为：', formDataStr)
    if (that.validateInput(e.detail.value, that.data.page)) {
      if (that.data.page < 4) {
        that.setData({
          page: that.data.page+1
        })
      } else {
        wx.showModal({
          title: '确定提交？',
          content: '提交之后可以在<登记历史>中查看表单信息以及表单状态',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '正在提交...'
              })
              var url = "https://api.zhexiankeji.com/education/teacher/insert"
              wx.request({
                url: url,
                data: formDataStr,
                method: "POST",
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  wx.hideLoading()
                  console.log(res);
                  wx.redirectTo({
                    url: '../histories/histories?update=true'
                  })
                },
                fail: function(res) {
                  wx.hideLoading()
                  console.log("FAIL");
                  wx.showToast({
                    title: '请检查网络连接',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }
          }
        })
      }
    } else {
      wx.showToast({
        title: '请检查必填选项',
        icon: 'none',
        duration: 1500
      })
    }
  },
})