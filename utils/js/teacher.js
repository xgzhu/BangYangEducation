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
    "未知身份", "学历不限",
    "本科生", "研究生",
    "博士生", "在职教师",
    "外籍教师", "海归人员",
]

var reversedGender = [
    "男导员", "女导员",
    "性别不限"
]

// 最高学历
var identityToDatabaseId = {
    "专科" : "1001",
    "本科" : "1002",
    "硕士" : "1003",
    "博士" : "1004",
    "博士后" : "1005"
}
var databaseIdToIdentity = {
    "1001" : "专科" ,
    "1002" : "本科" ,
    "1003" : "硕士" ,
    "1004" : "博士" ,
    "1005" : "博士后"
}

module.exports = {
  grades,
  genders,
  reversedGrade,
  reversedGender,
  identityToDatabaseId,
  databaseIdToIdentity
}