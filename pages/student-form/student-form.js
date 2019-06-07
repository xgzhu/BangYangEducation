// pages/student-form/student-form.js
const app = getApp()
const grades = require('../../utils/js/grade.js')
const subjects = require('../../utils/js/subject.js')
const teachers = require('../../utils/js/teacher.js')
const citys = require('../../utils/js/city.js')
var that

const invalid = 100

Page({
  /**
   * 页面的初始数据
   */
  data: {
    gradeInfo: "请选择当前年级",
    areaValues: ["山东省", "济南市", ""],
    areaInfo: "请选择上课地点",
    subjectValues: [],
    //characterValue: invalid,
    teacherValue: ["", ""],
    //characterInfo: "请选择性格类型",
    teacherInfo: "请选择教员要求",
    teacherGenderValue: 2,  // 性别不限
    teacherGradeValue: 1, // 学历不限
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
    that.checkExisting(options.update == undefined)
    that.setData({
      grades: grades.grades.slice(),
      subjects: subjects.subjects.slice(),
      points: subjects.points.slice(),
      //characters: characters.characters.slice(),
      subjectAndPoints: [subjects.subjects.slice(), subjects.points.slice()],
      teacherRequirements: [teachers.grades.slice(), teachers.genders.slice()],
      provinceToId: citys.provinceToId,
      provinces: citys.provinces.slice(),
      citys: citys.citys
    })
    if (options.region != undefined && options.region != "") {
      that.setData({
        areaInfo: options.region,
        areaValues: options.region.split(","),
      })
    }
    if (options.shouldReturn != undefined) {
      that.setData({shouldReturn: options.shouldReturn})
    }
    console.log(that.data)
  },
  checkExisting: function (query) {
    if (query == false) {
      that.prepareForm()
      return
    }
    if (app.globalData.myStudentRegister == null) {
      return
    }
    wx.showModal({
      title: '注册信息已存在',
      content: '后台显示你已经注册过信息，是否要重新填写？',
      success: function(res) {
        if (!res.confirm)
          wx.navigateBack()
        else
          that.prepareForm()
      },
      fail: function(res) {
        console.log("checkExisting fail")
      },
    })
  },
  // prepare existing info.
  prepareForm: function() {
    var myData = app.globalData.myStudentRegister
    var work_time = that.data.times
    if (myData.time&0x01)
      work_time[0].checked = true
    if (myData.time&0x02)
      work_time[1].checked = true
    if (myData.time&0x04)
      work_time[2].checked = true
    that.setData({
      defaultName: myData.name,
      defaultBoy: myData.gender == 0,
      defaultGirl: myData.gender == 1,
      defaultAddress: myData.address,
      defaultPhone: myData.pPhone,
      defaultStudentPhone: myData.sPhone,
      defaultQq: myData.sQq,
      gradeInfo: myData.grade,
      defaultParent: myData.parent,
      times: work_time,
      wen_ke: myData.sDirection == 1,
      li_ke: myData.sDirection == 2,
      defaultMajor: myData.sMajor,
      teacherGenderValue: myData.wSex,
      teacherGradeValue: myData.wTtype,
      teacherInfo: myData.teacherRequirement,
    })

    if (myData.hourly_pay > 0) {
      that.setData({DefaultPrice: myData.hourly_pay})
    }

    if (myData.description != "未填写描述") {
      that.setData({
        defaultDescription: myData.description
      })
    }

    var subjectValues = []
    for (var i = 0; i < myData.subjectsList.length; i++) {
      var subject = myData.subjectsList[0]
      console.log("subject", subject)
      var subjectValue = {
        subject: {name: subject.name}, 
        point: {name: subject.point},
        string: subject.name + "," + subject.point
      }
    }
    subjectValues.push(subjectValue)
    that.setData({
      subjectValues: subjectValues,
    })
    that.subjectDeduplication()
    //console.log("subjectValues", that.data)
  },

  // 输入结束后的检查
  finishSName: function(e) {
    if (e.detail.value != "") {
      that.setData({error_name:""})
    }
  },
  finishPName: function(e) {
    if (e.detail.value != "") {
      that.setData({error_pName:""})
    }
  },
  finishPhone: function(e) {
    if (e.detail.value.length == 11) {
      that.setData({error_phone:""})
    }
  },
  finishGender: function() {
    that.setData({error_gender: ""})
  },
  finishGrade: function(e) {
    that.setData({
      gradeInfo: grades.grades[e.detail.value].name,
      error_grade: "",
    })
  },
  finishArea: function(e) {
    that.setData({
      areaValues: e.detail.value,
      areaInfo: e.detail.value.toString()
    })
  },
  finishAddSubject: function(e) {
    var idxs = e.detail.value
    var subjectValue = {
      subject: that.data.subjectAndPoints[0][idxs[0]], 
      point: that.data.points[idxs[1]],
      string: that.data.subjectAndPoints[0][idxs[0]].name + "," + that.data.points[idxs[1]].name
    }
    var subjectValues = that.data.subjectValues
    subjectValues.push(subjectValue)
    that.setData({
      subjectValues: subjectValues,
      error_subject: ""
    })
    console.log(that.data)
    that.subjectDeduplication()
  },
  finishTime: function(e) {
    that.setData({error_time: ""})
  },
  // finishCharacter: function(e) {
  //   var idx = e.detail.value
  //   that.setData({
  //     characterInfo: that.data.characters[idx].name,
  //     characterValue: that.data.characters[idx].id,
  //   })
  // },
  finishTeacher: function(e) {
    var idxs = e.detail.value
    var teacherGrade = that.data.teacherRequirements[0][idxs[0]]
    var teacherGender = that.data.teacherRequirements[1][idxs[1]]
    that.setData({
      teacherGradeValue: teacherGrade.id,
      teacherGenderValue: teacherGender.id,
      teacherInfo: teacherGrade.name+", "+teacherGender.name
    })
  },
  removeSubject: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var subjectValues = that.data.subjectValues.slice()
    subjectValues.splice(index, 1)
    that.setData({
      subjectValues: subjectValues,
    })
    that.subjectDeduplication()
  },
  subjectDeduplication: function() {
    var newSubjects = []
    for (var idx in that.data.subjects) {
      var subject = that.data.subjects[idx]
      var exist = false
      for (var idy in that.data.subjectValues) {
        if (that.data.subjectValues[idy].subject.name == subject.name) {
          exist = true
        }
      }
      if (!exist) {
        newSubjects.push(subject)
      }
    }
    that.setData({subjectAndPoints:[newSubjects, that.data.points]})
  },
  validateInput: function (val) {
    var success = true
    var style_name = ""
    var style_gender = ""
    var style_grade = ""
    var style_subject = ""
    var style_address = ""
    var style_pName = ""
    var style_phone = ""
    var style_time = ""
    if (val.sName == "") {
      success = false
      style_name = "error"
    }
    if (val.sSex == "") {
      success = false
      style_gender = "error"
    }
    if (val.wGrade == "请选择当前年级") {
      success = false
      style_grade = "error"
    }
    if (val.wAddress == "") {
      success = false
      style_address = "error"
    }
    if (val.pName == "") {
      success = false
      style_pName = "error"
    }
    if (val.pPhone.length != 11) {
      success = false
      style_phone = "error"
    }
    if (val.wSubject.length == 0) {
      success = false
      style_subject = "error"
    }
    if (val.wType.length == 0) {
      success = false
      style_time = "error"
    }

    that.setData({
      error_name: style_name,
      error_gender: style_gender,
      error_grade: style_grade,
      error_subject: style_subject,
      error_address: style_address,
      error_pName: style_pName,
      error_phone: style_phone,
      error_time: style_time,
    })
    return success
  },
  getTimeType: function (wTypes) {
    var wType = 0
    for (var i = 0; i < wTypes.length; i++) {
      wType += parseInt(wTypes[i])
    }
    return wType
  },
  formSubmit: function (e) {
    e.detail.value.wGrade = that.data.gradeInfo
    e.detail.value.wSubject = that.data.subjectValues
    e.detail.value.sProvince = that.data.areaValues[0]
    e.detail.value.sCity = that.data.areaValues[1]
    e.detail.value.sArea = that.data.areaValues[2]
    //e.detail.value.sCharacter = that.data.character
    e.detail.value.sLevel = that.data.point
    e.detail.value.wSex = that.data.teacherGenderValue
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (that.validateInput(e.detail.value)) {
      var formData = {}
      formData.sName = e.detail.value.sName
      formData.sSex = parseInt(e.detail.value.sSex)
      // formData.sWxid = wx.getStorageSync('openId')
      formData.sWxid = app.globalData.openId
      // formData.wGrade = "G"+e.detail.value.wGrade.toString()
      formData.wGrade = e.detail.value.wGrade
      formData.cityId = app.getCityId(that.data.areaValues)
      formData.pName = e.detail.value.pName
      formData.pPhone = e.detail.value.pPhone
      formData.sPhone = e.detail.value.pPhone
      formData.wType = that.getTimeType(e.detail.value.wType)
      formData.wSubject = e.detail.value.wSubject[0].string
      formData.sArea = e.detail.value.sArea
      for (var i = 1; i < e.detail.value.wSubject.length; i++) {
        var subj = e.detail.value.wSubject[i]
        formData.wSubject += "+" + subj.string
      }
      if (e.detail.value.sPhone != undefined && e.detail.value.sPhone != "")
        formData.sPhone = e.detail.value.sPhone
      else
        formData.sPhone = e.detail.value.pPhone
      if (e.detail.value.sQq != "")
        formData.sQq = e.detail.value.sQq
      if (e.detail.value.wAddress != "")
        formData.wAddress = e.detail.value.wAddress
      if (e.detail.value.sDirection != "")
        formData.sDirection = e.detail.value.sDirection
      if (e.detail.value.sMajor != "")
        formData.sMajor = e.detail.value.sMajor
      if (e.detail.value.sDescribe != "")
        formData.sDescribe = e.detail.value.sDescribe
      if (e.detail.value.wPrice != "")
        formData.wPrice = parseInt(e.detail.value.wPrice)
      // if (that.data.characterInfo != "请选择性格类型")
      //   formData.sDescribe = e.detail.value.sDescribe + " ("+that.data.characterInfo+")"
      formData.wTtype = that.data.teacherGradeValue.toString()
      formData.wSex = that.data.teacherGenderValue
      var url = "https://api.zhexiankeji.com/education/student/insert"
      if (app.globalData.myStudentRegister != null) {
        formData.id = app.globalData.myStudentRegister.sId
        url = "https://api.zhexiankeji.com/education/student/update"
      }
      
      var formDataStr = JSON.stringify(formData)
      console.log(formDataStr)
      var content = '提交之后可以在<登记历史>中查看表单信息以及表单状态'
      wx.showModal({
        title: '确定提交',
        content: content,
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在提交...'
            })
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
                if (that.data.shouldReturn) {
                  wx.showModal({
                    title: '确定预约',
                    content: '是否使用本次填写信息直接预约家教？',
                    success: function(res) {
                      wx.setStorageSync("reserveConfirm", res.confirm)
                      wx.navigateBack()
                    }
                  })
                } else {
                  var studentInfoCallback = function(studentInfo) {
                    var myStudentHistory = studentInfo
                    app.globalData.myStudentRegister = app.selectNewestData(studentInfo)
                    wx.redirectTo({
                      url: '../card/card?personal=student'
                    })
                  }
                  app.getMyStudentInfo({"sWxid":app.globalData.openId}, studentInfoCallback)
                }
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
    } else  {
      wx.showToast({
        title: '请检查必填选项',
        icon: 'none',
        duration: 1500
      })
    }
  },

  submitMore: function () {
    that.setData({
      submitMore: true,
    })
  }
})