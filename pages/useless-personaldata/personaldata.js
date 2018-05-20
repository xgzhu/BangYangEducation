const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function() {
    that = this
    var personalData = wx.getStorageSync('userCustomerInfo')
    that.setData({
      personalData: personalData,
      enableModify: false
    })
    
    var gender = "未选择"
    var address = "未选择"
    if (personalData != undefined) {
      if (personalData.gender == 'male') {
        gender = "男生"
      } else if (personalData.gender == 'female') {
        gender = "女生"
      }
      if (personalData.region != undefined) {
        address = personalData.region
      } 
      that.setData({
        isMale: personalData.gender == 'male',
        genderInfo: gender
      })
    } 
    that.setData({
      gender: gender,
      address: address,
    })
    console.log(that.data)
  },
  enableModify: function() {
    that.setData({enableModify: true})
  },
  finishGender: function(e) {
    if (e.detail.value == 'male') {
      that.setData({gender: '男生'})
    } else {
      that.setData({gender: '女生'})
    }
  },
  finishArea: function(e) {
    that.setData({address: e.detail.value})
  },
  saveInfomation: function(e) {
    that.setData({enableModify: false})
    var personalData = wx.getStorageSync('userCustomerInfo')
    personalData.gender = e.detail.value.sex
    personalData.region = e.detail.value.region
    personalData.name = e.detail.value.name
    wx.setStorageSync('userCustomerInfo', personalData)
    console.log(e)
    console.log(personalData)
  }
})