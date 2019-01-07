var subjects = [
//基础学科
  { name: "语文", id: 1 },
  { name: "数学", id: 2 },
  { name: "英语", id: 3 },
  { name: "物理", id: 4 },
  { name: "化学", id: 5 },
  { name: "生物", id: 6 },
  { name: "地理", id: 7 },
  { name: "历史", id: 8 },
  { name: "政治", id: 9 },
  { name: "作文", id: 10 },
  { name: "奥数", id: 11 },
  { name: "计算机", id: 12 },
//艺术专项
  { name: "艺术", id: 13 },
  { name: "美术", id: 14 },
  { name: "乐器", id: 15 },
  { name: "钢琴", id: 16 },
  { name: "电子琴", id: 17 },
  { name: "古筝", id: 18 },
  { name: "舞蹈", id: 19 },
  { name: "书法", id: 20 },
//体育专项
  { name: "棋牌", id: 21 },
  { name: "体育", id: 22 },
  { name: "田径", id: 23 },
  { name: "足球", id: 24 },
  { name: "篮球", id: 25 },
  { name: "排球", id: 26 },
  { name: "网球", id: 27 },
  { name: "乒乓球", id: 28 },
  { name: "羽毛球", id: 29 },
  { name: "武术", id: 30 },
//语言专项
  { name: "英语口语", id: 31 },
  { name: "雅思", id: 32 },
  { name: "托福", id: 33 },
  { name: "德语", id: 34 },
  { name: "俄语", id: 35 },
  { name: "法语", id: 36 },
  { name: "韩语", id: 37 },
  { name: "日语", id: 38 },
  { name: "西班牙语", id: 39 },
  { name: "意大利语", id: 40 },
  { name: "GRE", id: 41 },
  { name: "普通话", id: 42 },
//其他
  { name: "国学", id: 43 },
  { name: "陪读", id: 44 },
]

var points = [
  { name: "无评分", id: 0 },
  { name: "优秀", id: 1 },
  { name: "良好", id: 2 },
  { name: "一般", id: 3 },
  { name: "及格", id: 4 },
  { name: "不及格", id: 5 }
]

// For selection list
var categories = [
  { name: "基础学科", range: [1, 12]},
  { name: "艺术专项", range: [13, 20]},
  { name: "体育专项", range: [21, 30]},
  { name: "语言专项", range: [31, 42]},
  { name: "其他", range: [43, 44]},
]

module.exports = {
  subjects,
  points,
  categories
}
