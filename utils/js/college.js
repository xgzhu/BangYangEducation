var colleges = [
  { name: "非985／211大学", id: 0 },
  { name: "安徽大学", id: 1 },
  { name: "北京中医药大学", id: 2 },
  { name: "北京交通大学", id: 3 },
  { name: "北京体育大学", id: 4 },
  { name: "北京化工大学", id: 5 },
  { name: "北京外国语大学", id: 6 },
  { name: "北京大学", id: 7 },
  { name: "北京工业大学", id: 8 },
  { name: "北京师范大学", id: 9 },
  { name: "北京林业大学", id: 10 },
  { name: "北京理工大学", id: 11 },
  { name: "北京科技大学", id: 12 },
  { name: "北京航空航天大学", id: 13 },
  { name: "北京邮电大学", id: 14 },
  { name: "长安大学", id: 15 },
  { name: "重庆大学", id: 16 },
  { name: "东北农业大学", id: 17 },
  { name: "东北大学", id: 18 },
  { name: "东北师范大学", id: 19 },
  { name: "东北林业大学", id: 20 },
  { name: "第二军医大学", id: 21 },
  { name: "东华大学", id: 22 },
  { name: "大连海事大学", id: 23 },
  { name: "大连理工大学", id: 24 },
  { name: "东南大学", id: 25 },
  { name: "第四军医大学", id: 26 },
  { name: "对外经济贸易大学", id: 27 },
  { name: "电子科技大学", id: 28 },
  { name: "复旦大学", id: 29 },
  { name: "福州大学", id: 30 },
  { name: "国防科学技术大学", id: 31 },
  { name: "广西大学", id: 32 },
  { name: "贵州大学", id: 33 },
  { name: "华北电力大学(保定)", id: 34 },
  { name: "华北电力大学(北京)", id: 35 },
  { name: "河北工业大学", id: 36 },
  { name: "华东师范大学", id: 37 },
  { name: "华东理工大学", id: 38 },
  { name: "哈尔滨工业大学", id: 39 },
  { name: "哈尔滨工程大学", id: 40 },
  { name: "合肥工业大学", id: 41 },
  { name: "河海大学", id: 42 },
  { name: "华南师范大学", id: 43 },
  { name: "华南理工大学", id: 44 },
  { name: "海南大学", id: 45 },
  { name: "湖南大学", id: 46 },
  { name: "湖南师范大学", id: 47 },
  { name: "华中农业大学", id: 48 },
  { name: "华中师范大学", id: 49 },
  { name: "华中科技大学", id: 50 },
  { name: "吉林大学", id: 51 },
  { name: "暨南大学", id: 52 },
  { name: "江南大学", id: 53 },
  { name: "辽宁大学", id: 54 },
  { name: "兰州大学", id: 55 },
  { name: "南昌大学", id: 56 },
  { name: "南京农业大学", id: 57 },
  { name: "南京大学", id: 58 },
  { name: "南京师范大学", id: 59 },
  { name: "南京理工大学", id: 60 },
  { name: "南京航空航天大学", id: 61 },
  { name: "南开大学", id: 62 },
  { name: "内蒙古大学", id: 63 },
  { name: "宁夏大学", id: 64 },
  { name: "清华大学", id: 65 },
  { name: "青海大学", id: 66 },
  { name: "四川农业大学", id: 67 },
  { name: "四川大学", id: 68 },
  { name: "山东大学", id: 69 },
  { name: "上海交通大学", id: 70 },
  { name: "上海外国语大学", id: 71 },
  { name: "上海大学", id: 72 },
  { name: "上海财经大学", id: 73 },
  { name: "石河子大学", id: 74 },
  { name: "陕西师范大学", id: 75 },
  { name: "苏州大学", id: 76 },
  { name: "同济大学", id: 77 },
  { name: "天津医科大学", id: 78 },
  { name: "天津大学", id: 79 },
  { name: "太原理工大学", id: 80 },
  { name: "武汉大学", id: 81 },
  { name: "武汉理工大学", id: 82 },
  { name: "西安交通大学", id: 83 },
  { name: "西安电子科技大学", id: 84 },
  { name: "西北农林科技大学", id: 85 },
  { name: "西北大学", id: 86 },
  { name: "西北工业大学", id: 87 },
  { name: "新疆大学", id: 88 },
  { name: "厦门大学", id: 89 },
  { name: "西南交通大学", id: 90 },
  { name: "西南大学", id: 91 },
  { name: "西南财经大学", id: 92 },
  { name: "西藏大学", id: 93 },
  { name: "延边大学", id: 94 },
  { name: "云南大学", id: 95 },
  { name: "中国人民大学", id: 96 },
  { name: "中国传媒大学", id: 97 },
  { name: "中国农业大学", id: 98 },
  { name: "中国地质大学(北京)", id: 99 },
  { name: "中国地质大学(武汉)", id: 100 },
  { name: "中国政法大学", id: 101 },
  { name: "中国海洋大学", id: 102 },
  { name: "中国石油大学(北京)", id: 103 },
  { name: "中国石油大学(华东)", id: 104 },
  { name: "中国矿业大学(北京)", id: 105 },
  { name: "中国矿业大学(徐州)", id: 106 },
  { name: "中国科学技术大学", id: 107 },
  { name: "中国药科大学", id: 108 },
  { name: "浙江大学", id: 109 },
  { name: "中南大学", id: 110 },
  { name: "中南财经政法大学", id: 111 },
  { name: "中山大学", id: 112 },
  { name: "中央民族大学", id: 113 },
  { name: "中央财经大学", id: 114 },
  { name: "中央音乐学院", id: 115 },
  { name: "郑州大学", id: 116 },
]

module.exports = {
  colleges
}