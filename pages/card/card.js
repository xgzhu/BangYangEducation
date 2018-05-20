const app = getApp()
var that

Page({
  data: {
  },
  onLoad: function(e) {
    that = this
    console.log(e)
    e.subjects = JSON.parse(e.subjects);
    that.setData(e)
  }
})