var grades = [{
    name: "学历不限",
    id: 1
}, {
    name: "本科生",
    id: 2
}, {
    name: "研究生",
    id: 3
}, {
    name: "博士生",
    id: 4
}, {
    name: "在职教师",
    id: 5
}, {
    name: "外籍教师",
    id: 6
}, {
    name: "海归人员",
    id: 7
}
]

var genders = [{
    name: "性别不限",
    id: 2
}, {
    name: "男导员",
    id: 0
}, {
    name: "女导员",
    id: 1
}
]

var reversedGrade = [
    "未知身份", "未知身份",
    "本科生", "研究生",
    "博士生", "在职教师",
    "外籍教师", "海归人员",
]

module.exports = {
  grades,
  genders,
  reversedGrade
}