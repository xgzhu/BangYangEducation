基本信息
------------
本路径为谪仙科技下榜样教育微信小程序代码。该程序设计为允许中小学生及其家长联系大学生家教所用。家长可以发布请家教信息，大学生可以发布做家教信息。此外，相应合作的教育机构可以发布找实习信息给大学生，允许大学生到教育机构进行实习行授课。

版权属于**谪仙科技**。未经允许，请勿转载。


当前进度
------------
[已完成]
- 请家教表格申请与数据库联网
- 做家教基本信息表格申请与数据库联网
- 资源库根据城市寻找以及本地缓存（根据科目性别学校过滤）
- 个人历史查询
- 做家教上传图片（图片名称有待改进）

[未完成]
- 审核做家教信息
- 在个人历史中看到自己上传的图片
- 查看发布的实习
- 请家教／做家教点进去之后要看到已有信息
- 我的：系统消息（待定），法律声明，联系我们
- 【后台】一键预约

[待改进]
- 登入界面有点丑
- card见面有点丑
- 资源库信息排序（求个pm建议）
- 大概有很多bug


更新历史
------------

2018.05.28
- 做家教上传图片信息（个人照片，学生证，校园卡）


2018.05.24
- 发现setStorageSync在手机端工作极其不正常，所以暂时使用globalData代替，这样有一个问题就是之前用户的信息不能被储存，所以我们大概需要server端来存储用户customInfo。
- 初步联通server，已经初步可以用了


2018.05.20
- 初始还不能用的版本，因为还没有完成: 做家教上传图片, 查看发布的实习, 请家教／做家教点进去之后要看到已有信息, 我的消息，一键预约