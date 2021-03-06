// pages/teacher-form/teacher-form.js
const app = getApp()
const grades = require('../../utils/js/grade.js')
const subjects = require('../../utils/js/subject.js')
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
    teacherGrades: [],
    identityInfo: "请选择当前身份",
    collegeInfo: "请选择本科学校",
    collegeInfoMaster: "请选择硕士学校",
    collegeInfoPhd: "请选择博士学校",
    entranceYearInfo: "",
    addressValues: ["山东省","济南市","槐荫区"],
    tEducations: ['专科','本科','硕士','博士','博士后'],
    tEducation: '本科',
    page: 1,
    birthInfo: '请选择出生日期',
    birthValue: '1995-01-01',
    examScoreDisabled: false,
    gradeInfoReadable: "请选择目标年级",
    subjectInfoReadable: "请选择目标科目",
    times:[
      { name: '平时', value: 1},
      { name: '周末', value: 2},
      { name: '假期', value: 4},
    ],
    images: [null, null, null]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    var teacherGrades = teachers.grades.slice()
    teacherGrades.splice(0, 1)
    that.setData({
      teacherGrades: teacherGrades,
      universitys: universitys.universitys,
      provinceAndUniversitys: [universitys.provinces, universitys.universitys["1"]],
      provinceAndUniversitysMaster: [universitys.provinces, universitys.universitys["1"]],
      provinceAndUniversitysPhd: [universitys.provinces, universitys.universitys["1"]],
      puValue: [0, 0],
      puValueMaster: [0, 0],
      puValuePhd: [0, 0],
      entranceYearInfo: curYear + "年",
      entranceYears: [(curYear-9)+"年", (curYear-8)+"年", (curYear-7)+"年", (curYear-6)+"年", (curYear-5)+"年", (curYear-4)+"年", (curYear-3)+"年", (curYear-2)+"年", (curYear-1)+"年", (curYear)+"年"],
      provinceToId: citys.provinceToId,
      provinces: citys.provinces.slice(),
      citys: citys.citys,
      update: options.update != undefined
    })
    if (options.region != undefined && options.region != "") {
      that.setData({
        addressValues: options.region.split(","),})
    }
    if (options.shouldReturn != undefined) {
      that.setData({shouldReturn: options.shouldReturn})
    }
    wx.setStorageSync('tAim', "")
    wx.setStorageSync('tSubject', "")
    that.checkExisting(options.update == undefined)
  },
  onShow: function () {
    var gradeInfo = wx.getStorageSync('tAim')
    if (gradeInfo != undefined && gradeInfo != "") {
      var gradeInfoReadable = app.getTargetGradeReadable(gradeInfo.split("+"))
      that.setData({gradeInfo:gradeInfo, gradeInfoReadable:gradeInfoReadable, error_grade: ""})
    }
    var subjectInfo = wx.getStorageSync('tSubject')
    if (subjectInfo != undefined && subjectInfo != "") {
      that.setData({subjectInfo:subjectInfo, subjectInfoReadable:subjectInfo.split("+"), error_subject: ""})
    }
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
    var myData = app.globalData.myTeacherRegister
    var teacherGrades = teachers.grades.slice()
    teacherGrades.splice(0, 1)
    that.setData({
      teacherGrades: teacherGrades,
      defaultName: myData.name,
      defaultBoy: myData.gender == 0,
      defaultGirl: myData.gender == 1,
      defaultPhone: myData.tPhone,
      defaultMajor: myData.tMajor,
      birthValue: myData.tBirthday,
      birthInfo: myData.tBirthday,
      defaultHighSchool: myData.tHighschool,
      tDescribe: myData.tDescribe,
      tAddress: myData.tAddress,
      images: [
        "https://api.zhexiankeji.com/education/image/" + myData.tId + "_teacher__0.jpg",
        "https://api.zhexiankeji.com/education/image/" + myData.tId + "_teacher__1.jpg",
        "https://api.zhexiankeji.com/education/image/" + myData.tId + "_teacher__2.jpg"
      ]
    })
    wx.setStorageSync('tAim', myData.tAim)
    wx.setStorageSync('tSubject', myData.tSubject)
    that.finishPhone(that.mockDetailValue(myData.tPhone))
    that.finishIdentity(that.mockDetailValue(myData.tType - 2))
    if (myData.tUniversity != undefined && myData.tUniversity != "") {
      var puValue = that.setUniversity(myData.tUniversity, "0")
      that.setData({puValue: puValue})
    }
    if (myData.tGraduate != undefined && myData.tGraduate != "") {
      that.setUniversity(myData.tGraduate, "1")
      that.setData({puValueMaster: puValue})
    }
    if (myData.tDoctoral != undefined && myData.tDoctoral != "") {
      that.setUniversity(myData.tDoctoral, "2")
      that.setData({puValuePhd: puValue})
    }
    if (myData.tScore == "1000") {
      that.setData({
        bao_song: true,
        examScoreDisabled: true,
        error_exam_score: "greyfont"
      })
    } else {
      that.setData({
        defaultScore: parseInt(myData.tScore)
      })
    }
    if (myData.tSubject != "") {
      that.setData({
        subjectInfoReadable: myData.tSubject.split("+")
      })
    }
    if (myData.targetGradeReadable != "") {
      that.setData({
        gradeInfoReadable: myData.targetGradeReadable
      })
    }
    var times = that.data.times
    times[0].checked = myData.time & 0x01
    times[1].checked = myData.time & 0x02
    times[2].checked = myData.time & 0x04
    that.setData({times: times})
    console.log("prepareForm", that.data)
  },
  setUniversity: function(universityId, level) {
    var provinceIdxAndUniversityIdx = that.getProvinceIdxAndUniversityIdx(universityId)
    if (provinceIdxAndUniversityIdx.provinceIdx != undefined) {
      that.changeUniversityProvince(
        {
          detail: {
            column: 0,
            value: provinceIdxAndUniversityIdx.provinceIdx
          },
          currentTarget: {
            dataset: {level: level}
          }
        })
      that.finishUniversity(
        {
          detail: {
            value: [provinceIdxAndUniversityIdx.provinceIdx, provinceIdxAndUniversityIdx.universityIdx]
          },
          currentTarget: {
            dataset: {level: level}
          }
        })
      return provinceIdxAndUniversityIdx.puValue
    }
    return [0, 0]
  },
  getProvinceIdxAndUniversityIdx: function(universityId) {
    var collegeName = universitys.idToUniversitys[universityId]
    for (var provinceId in universitys.universitys) {
      for (var universityIdx in universitys.universitys[provinceId]) {
        // console.log("university", universitys.universitys[provinceId][university])
        var university = universitys.universitys[provinceId][universityIdx]
        if (university.name == collegeName) {
          console.log("getProvinceIdxAndUniversityIdx", university)
          return {provinceIdx:parseInt(provinceId)-1, 
                  universityIdx:universityIdx,
                  puValue:[parseInt(provinceId)-1, parseInt(universityIdx)]}
        }
      }
    }
    return {}
  },
  mockDetailValue: function(value) {
    var mockDetailValue = {detail:{value:value}}
    return mockDetailValue
  },
  addMockCurrentTarget: function(object, dataset) {
    value.currentTarget.dataset = dataset
    return object
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
    var idx = parseInt(e.detail.value)
    console.log("finishIdentity-idx", idx, that.data)
    that.setData({
      identityInfo: that.data.teacherGrades[idx].name,
      identityValue: that.data.teacherGrades[idx].id,
      error_identity: "",
    })
    switch (idx) {
      case 0: that.setData({tEducation: "本科"}); break;
      case 1: that.setData({tEducation: "硕士"}); break;
      case 2: that.setData({tEducation: "博士"}); break;
      default: break;
    }
    console.log("finishIdentity tEducation", that.data.tEducation, that.data, e)
  },
  finishEntranceYear: function (e) {
    var idx = e.detail.value
    that.setData({
      entranceYearInfo: that.data.entranceYears[idx],
    })
  },
  changeUniversityProvince: function (e) {
    console.log("changeUniversityProvince", e)
    if (e.detail.column != 0) {
      return
    }
    var level = parseInt(e.currentTarget.dataset.level)
    var provinceId = universitys.provinces[e.detail.value].id
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
    console.log("finishUniversity", e)
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
      that.setData({error_exam_score: "greyfont", examScoreDisabled: true})
    } else if (e.type=="change" && e.detail.value.length == 0) {
      that.setData({error_exam_score: "", examScoreDisabled: false})
    }
  },
  finishDetailAddress: function(e) {
    if (e.detail.value != "")
      that.setData({error_detail_address: ""})
  },
  finishDescribe: function(e) {
    if (e.detail.value != "")
      that.setData({error_describe: ""})
  },
  selectGrade: function() {
    var options = {name:'tAim', list:grades.grades, categories: grades.categories}
    that.navToSelectionList(options)
  },
  selectSubject: function() {
    var options = {name:'tSubject', list:subjects.subjects, categories: subjects.categories}
    that.navToSelectionList(options)
  },
  navToSelectionList: function(options) {
    wx.navigateTo({
      url: '../selection-list/selection-list?options='+JSON.stringify(options)
    });
  },
  chooseImageTap: function(e){
    let _this = this;
    var idx = parseInt(e.currentTarget.dataset.idx);
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0){
            _this.chooseWxImage('album', idx)
          } else if(res.tapIndex == 1){
            _this.chooseWxImage('camera', idx)
          }
        }
      }
    })
  },
  chooseWxImage:function(chooseType, imageIdx){
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [chooseType],
      success: function (res) {
        var images = that.data.images
        images[imageIdx] = res.tempFilePaths[0]
        _this.setData({
          images: images,
        })
      }
    })
  },
  validateInput: function (data, page) {
    //return true
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
/*      if (data.wStudentId == "") {
        that.setData({error_student_id: "error"})
        success = false
      }*/
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
      if (that.data.gradeInfoReadable == "请选择目标年级") {
        that.setData({error_grade: "error"})
        success = false
      }
      if (that.data.subjectInfoReadable == "请选择目标科目") {
        that.setData({error_subject: "error"})
        success = false
      }
      if (data.tDescribe == undefined || data.tDescribe == "") {
        that.setData({error_describe: "error"})
        success = false
      }
    }
    if (page >= 4) {
      if (data.tAddress == "") {
        that.setData({error_detail_address: "error"})
        success = false
      }
      if (that.data.images[0] == null) {
        that.setData({error_images_0: "error"})
        success = false
      }
      if (that.data.images[1] == null) {
        that.setData({error_images_1: "error"})
        success = false
      }
      if (that.data.images[2] == null) {
        that.setData({error_images_2: "error"})
        success = false
      }
      console.log(that.data)
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
    e.detail.value.tEducation = teachers.identityToDatabaseId[that.data.tEducation]
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
    console.log("e.detail.value", e.detail.value)
    if (that.validateInput(e.detail.value, that.data.page)) {
    //if (true) {
      if (that.data.page < 4) {
        that.setData({
          page: that.data.page+1
        })
      } else {
        var url = "https://api.zhexiankeji.com/education/teacher/insert"
        if (app.globalData.myTeacherRegister != null) {
          e.detail.value.id = app.globalData.myTeacherRegister.tId
          url = "https://api.zhexiankeji.com/education/teacher/update"
        }
        var formDataStr = JSON.stringify(e.detail.value)
        var content = '提交之后可以在<登记历史>中查看表单信息以及表单状态'
        console.log('form发生了submit事件，携带数据为：', formDataStr, url)
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
                  console.log("res", res);
                  var res_id = res.data.result
                  if (res.statusCode != 200) {
                    wx.showToast({
                      title: '内部错误，请反馈给客服',
                      icon: 'none',
                      duration: 2000
                    })
                    return
                  }
                  if (res_id == undefined && res.data.errCode == undefined) {
                    var obj = JSON.parse(res.data);
                    res_id = obj.result
                    if (res_id == undefined) {
                      wx.showToast({
                        title: '请检查输入信息，或者反馈给客服',
                        icon: 'none',
                        duration: 2000
                      })
                      return
                    }
                  }
                  // res_id is true if we are using update api.
                  if (app.globalData.myTeacherRegister == null) {
                    that.uploadImage(res_id, e.detail.value)
                  } else {
                    that.uploadImage(app.globalData.myTeacherRegister.tId, e.detail.value)
                  }
                  if (that.data.shouldReturn) {
                    wx.showModal({
                      title: '确定预约',
                      content: '是否使用本次填写信息直接预约学生？',
                      success: function(res) {
                        wx.setStorageSync("reserveConfirm", res.confirm)
                        wx.navigateBack()
                      }
                    })
                  } else {
                    // 需要先更新 myTeacherRegister
                    var teacherInfoCallback = function (teacherInfo) {
                      app.globalData.myTeacherHistory = teacherInfo
                      app.globalData.myTeacherRegister = app.selectNewestData(teacherInfo)
                      console.log('myTeacherRegister updated', app.globalData.myTeacherRegister)
                      
                      if (that.data.update) {
                        wx.navigateBack();
                      } else {
                        wx.redirectTo({
                          url: '../card/card?personal=teacher'
                        })
                      }
                    }
                    app.getTeacherInfo({ "tWxid": app.globalData.openId }, teacherInfoCallback)
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
              
            } // end confirm
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
  uploadImage: function(id, metadata) {
    var img_url = "https://api.zhexiankeji.com/education/image/upload"
    console.log("upload img ", { name: id + "_teacher__2" }) // -> ture_teacher__2, problem in id?
    
    // 个人照片
    if (!that.data.images[0].startsWith("https")) {
      wx.uploadFile({
        url: img_url,
        filePath:that.data.images[0],
        formData: {name: id + "_teacher__0"},
        name:"image",
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          console.log("upload image", res)
          var res_id = res.data.result
          if (res.data.errCode == undefined) {
            var obj = JSON.parse(res.data);
            res_id = obj.result
          }
          that.completeImageInfo(res_id, id, 0, metadata)
        }
      })
    }
    
    // 学生证
    if (!that.data.images[1].startsWith("https")) {
      wx.uploadFile({
        url: img_url,
        filePath:that.data.images[1],
        formData: {name: id + "_teacher__1"},
        name:"image",
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          console.log("upload image", res)
          var res_id = res.data.result
          if (res.data.errCode == undefined) {
            var obj = JSON.parse(res.data);
            res_id = obj.result
          }
          that.completeImageInfo(res_id, id, 1, metadata)
        }
      })
    }
    // 校园卡
    if (!that.data.images[2].startsWith("https")) {
      wx.uploadFile({
        url: img_url,
        filePath:that.data.images[2],
        formData: {name: id + "_teacher__2"},
        name:"image",
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          console.log("upload image", res)
          var res_id = res.data.result
          if (res.data.errCode == undefined) {
            var obj = JSON.parse(res.data);
            res_id = obj.result
          }
          that.completeImageInfo(res_id, id, 2, metadata)
        }
      })
    }
  },
  completeImageInfo: function(imageId, applicationId, typeId, metadata) {
    var url = "https://api.zhexiankeji.com/education/picture/insert"
    // pClass:1 教师表
    var data = {cityId: metadata.cityId, pClass: 1, pGroup: typeId, pId: applicationId, pWxid: metadata.tWxid, pPid: imageId}
    var formDataStr = JSON.stringify(data)
    console.log('更新图片信息：', formDataStr)
    wx.request({
      url: url,
      data: formDataStr,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("completeImageInfo", imageId, typeId, res)
      }
    })
  }
})