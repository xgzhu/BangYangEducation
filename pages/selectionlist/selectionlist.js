var that

const invalid = 100

Page({
  data: {},
  onLoad: function (options) {
    that = this
    var list = options.list.split("+")
    var name = options.name
    var selected = wx.getStorageSync(name)
    if (selected == undefined) {
      selected = ""
    }
    var listInUse = []
    for (var i = 0; i < list.length; i++) {
      var itemName = list[i]
      listInUse.push({name:itemName, checked:selected.includes(itemName)})
    }
    that.setData({input: options.list, list: listInUse, name: name, selected:selected})
    console.log(that.data)
  },
  saveAndReturn: function(e) {
    console.log(e)
    if (e.detail.value.checkedItem.length == 0) {
      wx.showModal({
        title: '全不选代表无限制。确定？',
        success: function () {
          wx.setStorageSync(that.data.name, that.data.input)
          wx.navigateBack();
        }
      })
    } else {
      wx.showModal({
        title: '点击确定保存。',
        success: function () {
          var output = e.detail.value.checkedItem[0]
          for (var i = 1; i < e.detail.value.checkedItem.length; i++) {
            output += "+" + e.detail.value.checkedItem[i]
          }
          console.log(output)
          wx.setStorageSync(that.data.name, output)
          wx.navigateBack();
        }
      })
    }
  }
})