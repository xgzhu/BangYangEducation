// pages/apply/apply.js
var address = require('../../utils/city.js')
var colleges = require('../../utils/college.js')
var subjects = require('../../utils/subject.js')
var animation
var that

const bigMonths = new Set([1, 3, 5, 7, 8, 10, 12]);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},

    collegeValues: [-1, -1, -1],
    colleges: [],
    collegeInfo: "请点击选择学校",
    collegeMasterInfo: "请点击选择学校",
    collegePhdInfo: "请点击选择学校",

    provinces: [],
    citys: [],
    addressType: 0,

    home: [],
    homeValue: [0, 0],
    homeInfo: "请点击选择籍贯",

    birthdayValues: [1990, 1, 1],
    birthdayInfo: "请点击选择生日",

    subjectValues: [],
    subjects: [],
    subject: '',
    subjectInfo: "请点击选择科目",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this

    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    that.animation = animation

    // 默认联动显示山东
    var aid = address.provinces[0].id
    that.setData({
      provinces: address.provinces,
      subjects: subjects.subjects,
      citys: address.citys[aid],
    })


    // var today = new Date()
    // var dd = today.getDate()
    // var mm = today.getMonth()+1 //January is 0!
    var yearss = []
    for (var i = 1980; i <= 2010; i++) {
      yearss.push(i)
    }
    var monthss = [1,2,3,4,5,6,7,8,9,10,11,12]
    var dayss = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]

    // 其他设置
    that.setData({
      infomation: options,
      identity: parseInt(options.identity),
      colleges: colleges.colleges,
      years: yearss,
      months: monthss,
      days: dayss,
      birthdayData: [0, 0, 0]
    })
  },


  finishGender: function() {
    that.setData({error_gender: ""})
  },
  finishName: function(e) {
    if (e.detail.value != "") {
      that.setData({error_name:""})
    }
  },
  finishPhone: function(e) {
    if (e.detail.value.length == 11) {
      that.setData({error_phone:""})
    }
  },

  selectAddress: function (e) {
    if (that.data.addressMenuIsShow) {
      return
    }
    var type = parseInt(e.target.dataset.type)
    switch (type) {
      case 0: that.setData({
        addressValue: that.data.homeValue,
        addressType: type
      })
    }
    that.startAnimation(true, 0)
  },
  addressCancel: function (e) {
    that.startAnimation(false, 0)
  },
  addressSure: function (e) {
    var addressValue = that.data.addressValue
    var province = that.data.provinces[addressValue[0]].name
    var city = that.data.citys[addressValue[1]].name
    var addressType = that.data.addressType
    that.startAnimation(false, 0)
    // 将选择的城市信息显示到输入框
    var areaInfoStr = province + ' ' + city
    switch (addressType) {
      case 0: that.setData({
                home: [province, city],
                homeInfo: areaInfoStr,
                error_address: "",
              })
    }
    
  },
  addressChange: function (e) {
    console.log(e)
    console.log(that.data)
    var addressValue = e.detail.value
    var provinces = that.data.provinces
    var citys = that.data.citys
    var provinceNum = addressValue[0]
    var cityNum = addressValue[1]
    if (that.data.addressValue[0] != provinceNum) {
      var id = provinces[provinceNum].id
      that.setData({
        addressValue: [provinceNum, 0],
        citys: address.citys[id],
      })
    } else {
      that.setData({
        addressValue: [provinceNum, cityNum]
      })
    }
  },
  hideAddressSelected: function (e) {
    that.startAnimation(false, 0)
  },

  selectCollege: function (e) {
    if (that.data.collegeMenuIsShow) {
      return
    }
    that.startAnimation(true, 2)
    that.setData({
      collegeLevel: parseInt(e.target.dataset.level)
    })
  },
  collegeCancel: function (e) {
    that.startAnimation(false, 2)
  },
  collegeSure: function (e) {
    var collegeLevel = that.data.collegeLevel
    var collegeValue = that.data.collegeValues[collegeLevel]

    that.startAnimation(false, 2)
    if (collegeValue == -1) {
      var collegeValueNew = that.data.collegeValues
      collegeValueNew.splice(collegeLevel, 1, 0)
      that.setData({
        collegeValues: collegeValueNew,
      })
      collegeValue = 0
    }

    console.log(that.data)

    var collegeInfoStr = that.data.colleges[collegeValue].name
    that.setData({
      error_college: "",
    })

    switch (collegeLevel) {
      case 0: that.setData({collegeInfo: collegeInfoStr}); break
      case 1: that.setData({collegeMasterInfo: collegeInfoStr}); break
      case 2: that.setData({collegePhdInfo: collegeInfoStr}); break
    }
  },
  collegeChange: function (e) {
    var collegeNum = e.detail.value[0]
    var collegeValueNew = that.data.collegeValues
    var collegeLevel = that.data.collegeLevel
    collegeValueNew.splice(collegeLevel, 1, collegeNum)
    that.setData({
      collegeValues: collegeValueNew,
    })
  },
  hideCollegeSelected: function (e) {
    that.startAnimation(false, 2)
  },

  selectBirthday: function (e) {
    if (that.data.birthdayMenuIsShow) {
      return
    }
    that.startAnimation(true, 1)
    that.setData({
      birthdayLevel: parseInt(e.target.dataset.level)
    })
  },
  birthdayCancel: function (e) {
    that.startAnimation(false, 1)
  },
  birthdaySure: function (e) {
    var birthdayData = that.data.birthdayData
    var birthdayValuess = [that.data.years[birthdayData[0]], that.data.months[birthdayData[1]], that.data.days[birthdayData[2]]]
    that.setData({
      birthdayValues: birthdayValuess,
      birthdayInfo: birthdayValuess[0] + " 年 " + birthdayValuess[1] + " 月 " + birthdayValuess[2] + " 日"
    })
    that.startAnimation(false, 1)
  },
  birthdayChange: function (e) {
    var month = e.detail.value[1]+1
    if (bigMonths.has(month)) {
      if (that.data.days.length != 31) {
        that.setData({
          days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
        })
      }
    } else if (month != 2) {
      if (that.data.days.length != 30) {
        that.setData({
          days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
        })
      }
    } else {
      var year = that.data.years[e.detail.value[0]]
      if ((year%4==0 && year%100!=0) || year%400==0) { //run nian
        if (that.data.days.length != 29) {
          that.setData({
            days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
          })
        }
      } else {
        if (that.data.days.length != 28) {
          that.setData({
            days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
          })
        }
      }
    }
    that.setData({
      birthdayData: e.detail.value
    })
  },
  hideBirthdaySelected: function (e) {
    that.startAnimation(false, 1)
  },

  selectSubject: function (e) {
    if (that.data.subjectMenuIsShow) {
      return
    }
    var index
    var newEntry
    var newCurrentSubjectValue
    console.log(e)
    if (e.currentTarget.dataset.index == undefined) {
      console.log("this is new!")
      index = that.data.subjectValues.length
      newEntry = true
      newCurrentSubjectValue = {subjectValue: 0}
    } else {
      index = e.currentTarget.dataset.index
      newEntry = false
      newCurrentSubjectValue = that.data.subjectValues[index]
    }
    that.setData({
      addNewEntry: newEntry,
      currentIndex: index,
      currentSubjectValue: newCurrentSubjectValue,
    })
    that.startAnimation(true, 3)
  },
  subjectCancel: function (e) {
    that.startAnimation(false, 3)
    if (!that.data.addNewEntry) {
      var newSubjectValues = that.data.timeValues
      newSubjectValues.splice(that.data.currentIndex, 1)
      that.setData({subjectValues: newSubjectValues})
    }
  },
  hideSubjectSelected: function (e) {
    that.startAnimation(false, 3)
  },
  subjectSure: function (e) {
    var newCurrentSubjectValue = that.data.currentSubjectValue.subjectValue
    var newSubjectValues = that.data.subjectValues
    var newSubject = that.data.subjects[newCurrentSubjectValue]
    newSubjectValues.splice(that.data.currentIndex, 1, 
      {subjectValue: newCurrentSubjectValue, subject: newSubject})
    that.setData({
      error_subject: "",
      subjectValues: newSubjectValues,
    })
    that.startAnimation(false, 3)
    console.log(that.data)
  },
  subjectChange: function (e) {
    console.log(e)
    var subjectValue = e.detail.value
    var subjectNum = subjectValue[0]
    var newCurrentTimeValue = {subjectValue: subjectNum}
    that.setData({
      currentSubjectValue: newCurrentTimeValue,
    })
    console.log(that.data.subject)
  },

  startAnimation: function (isShow, picker_id) {
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    if (picker_id == 0) {
      that.setData({
        addressAnimationMenu: that.animation.export(),
        addressMenuIsShow: isShow,
      })
    } else if (picker_id == 1) {
      that.setData({
        birthdayAnimationMenu: that.animation.export(),
        birthdayMenuIsShow: isShow,
      })
    } else if (picker_id == 2) {
      that.setData({
        collegeAnimationMenu: that.animation.export(),
        collegeMenuIsShow: isShow,
      })
    } else if (picker_id == 3) {
      that.setData({
        subjectAnimationMenu: that.animation.export(),
        subjectMenuIsShow: isShow,
      })
    } 
  },

  chooseImageTap: function(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0){
            _this.chooseWxImage('album')
          } else if(res.tapIndex == 1){
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage:function(type){
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          avatar: res.tempFilePaths[0],
        })
      }
    })
  },

  validateInput: function (val) {
    var success = true
    var style_birthday = ""
    var style_high_school = ""
    var style_school = ""
    var style_college = ""
    var style_program = ""
    var style_student_id = ""
    var style_home = ""
    if (val.birthday == "") {
      success = false
      style_birthday = "error"
    }
    if (val.school == "") {
      success = false
      style_school = "error"
    }
    if (val.high_school == "") {
      success = false
      style_high_school = "error"
    }
    if (val.college == undefined) {
      success = false
      style_college = "error"
    }
    if (val.program == "") {
      success = false
      style_program = "error"
    }
    if (val.student_id == "") {
      success = false
      style_student_id = "error"
    }
    if (val.home.length == 0) {
      success = false
      style_home = "error"
    }

    that.setData({
      error_birthday: style_birthday,
      error_high_school: style_high_school,
      error_school: style_school,
      error_program: style_program,
      error_college: style_college,
      error_student_id: style_student_id,
      error_home: style_home,
    })

    return success
  },

  formSubmit: function (e) {
    console.log(that.data)
    e.detail.value.college = that.data.college
    e.detail.value.home = that.data.home
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (that.validateInput(e.detail.value)) {
      wx.navigateTo({
        url: '../apply_more/apply_more'
      })
    } else  {
      wx.showToast({
        title: '请填写全部选项',
        icon: 'none',
        duration: 1500
      })
    }
  },
})