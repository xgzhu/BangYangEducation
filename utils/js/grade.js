// DO NOT CHANGE NAMES.
// OR please change index.js also.
var grades = [
  // {
  //   name: "学龄前",
  //   id: 0
  // }, 
  {
    name: "小学一年级",
    id: 1
  }, {
    name: "小学二年级",
    id: 2
  }, {
    name: "小学三年级",
    id: 3
  }, {
    name: "小学四年级",
    id: 4
  }, {
    name: "小学五年级",
    id: 5
  }, {
    name: "小学六年级",
    id: 6
  }, {
    name: "初中一年级",
    id: 7
  }, {
    name: "初中二年级",
    id: 8
  }, {
    name: "初中三年级",
    id: 9
  }, {
    name: "高中一年级",
    id: 10
  }, {
    name: "高中二年级",
    id: 11
  }, {
    name: "高中三年级",
    id: 12
  }, {
    name: "高中复读",
    id: 13
  },
]

var idToGrades = {
//  "G0" : "学龄前兴趣班",
  "G1" : "小学一年级",
  "G2" : "小学二年级",
  "G3" : "小学三年级",
  "G4" : "小学四年级",
  "G5" : "小学五年级",
  "G6" : "小学六年级",
  "G7" : "初中一年级",
  "G8" : "初中二年级",
  "G9" : "初中三年级",
  "G10" : "高中一年级",
  "G11" : "高中二年级",
  "G12" : "高中三年级",
  "G13" : "高中复读"
}

var gradesToId = {
//  "学龄前兴趣班" : "G0" ,
  "小学一年级" : "G1" ,
  "小学二年级" : "G2" ,
  "小学三年级" : "G3" ,
  "小学四年级" : "G4" ,
  "小学五年级" : "G5" ,
  "小学六年级" : "G6" ,
  "初中一年级" : "G7" ,
  "初中二年级" : "G8" ,
  "初中三年级" : "G9" ,
  "高中一年级" : "G10",
  "高中二年级" : "G11",
  "高中三年级" : "G12",
  "高中复读" : "G13"
}

// For selection list
var categories = [
  { name: "小学", range: [1, 6]},
  { name: "初中", range: [7, 9]},
  { name: "高中", range: [10, 12]},
]

module.exports = {
  grades,
  idToGrades,
  gradesToId,
  categories
}