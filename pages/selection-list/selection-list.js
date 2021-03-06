var that

const invalid = 100

Page({
  data: {},
  onLoad: function (e) {
    that = this
    var options = JSON.parse(e.options)
    console.log(options)
    var list = options.list
    var name = options.name
    var selected = wx.getStorageSync(name)
    if (selected == undefined) {
      selected = ""
    }
    var listInUse = []
    var selectedCnt = 0
    var selectAllBtn = "选择全部"
    for (var i = 0; i < list.length; i++) {
      var item = list[i]
      var checked = selected.includes(item.name)
      selectedCnt += checked ? 1 : 0
      item.checked = checked
      listInUse.push(item)
    }
    if (selectedCnt == list.length) {
      selectAllBtn = "清空选择"
    }
    that.setData({input: options.list, list: listInUse, name: name, selected:selected, selectAllBtn: selectAllBtn})
    console.log(that.data)
  },
  saveAndReturn: function(e) {
    console.log(e)
    if (e.detail.value.checkedItem.length == 0) {
      wx.showToast({
        title: '请先选择',
        duration: 1000
      })
    } else {
      var output = e.detail.value.checkedItem[0]
      for (var i = 1; i < e.detail.value.checkedItem.length; i++) {
        output += "+" + e.detail.value.checkedItem[i]
      }
      console.log(output)
      wx.setStorageSync(that.data.name, output)
      wx.navigateBack();
    }
  },
  selectAll: function() {
    var list = that.data.list
    if (that.data.selectAllBtn == "选择全部") {
      for (var i = 0; i < list.length; i++) {
        list[i].checked = true
      }
      that.setData({list: list, selectAllBtn: "清空选择"})
    } else {
      for (var i = 0; i < list.length; i++) {
        list[i].checked = false
      }
      that.setData({list: list, selectAllBtn: "选择全部"})
    }
  }
})