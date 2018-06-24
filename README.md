# 基于NodeJs和MongoDB搭建的音乐网站
## 网页显示效果
### 1.首页
![](https://github.com/geizsoft/music/raw/master/image/1.png)
![](https://github.com/geizsoft/music/raw/master/image/2.png)
### 2.详情页面
![](https://github.com/geizsoft/music/raw/master/image/3.png)
![](https://github.com/geizsoft/music/raw/master/image/4.png)
### 3.登录注册页面
![](https://github.com/geizsoft/music/raw/master/image/5.png)
![](https://github.com/geizsoft/music/raw/master/image/6.png)
### 4.目录页面
![](https://github.com/geizsoft/music/raw/master/image/7.png)
### 5.个人页面
![](https://github.com/geizsoft/music/raw/master/image/8.png)
![](https://github.com/geizsoft/music/raw/master/image/9.png)
### 6.录入页面
![](https://github.com/geizsoft/music/raw/master/image/10.png)

## 简介
### 1.后端搭建
  * 使用NodeJs的express框架并且使用了部分的es6完成网站后端的搭建;
  * 使用mongodb数据库完成对数据存储，通过mongoose模块完成对mongodb数据的模块化构建;
  * 使用jade模板引擎完成页面的创建和渲染;
  * 使用Moment.js格式化从数据库取出的存储时间以及本地时间;
### 2.项目前端的搭建
  * 使用jQuery和bootstrap完成对网站前端JS脚本和样式的处理
  * 前后端数据请求交互通过Ajax完成
### 3.本地开发环境搭建
  * 使用grunt对JS语法检查、更新代码时自动重启服务器等功能，使用mocha完成用户注册等步骤简单的单元测试等
### 4.一些功能模块
  * 具有用户注册登录
  * 具有用户个人页面（用户听过记录、上传记录、收藏记录、修改头像等功能）
  * 具有管理员系统，有删除修改用户、音乐等功能
  * 首页（实现最近更新、热门点击、根据用户喜好推荐歌曲、搜索等功能）
  * 音乐详情页面
  * 用户评论、回复评论、点赞功能，可以自己删除自己的评论
  * 所有音乐界面可以根据分类获取不同音乐（数据来源后台）
  * 音乐分类添加以及删除
  * 可以从本地上传音乐海报
  * 用户可以自行上传音乐
  * 分页处理
 ## 项目的一些页面
 #### 前台页面
  * 首页：localhost:3010
  * 所有音乐：localhost:3010/all
  * 音乐详情页面：localhost:3010/music/:id
  * 搜索结果页面：localhost:3010/results
  * 歌手详情页面：localhost:3010/music/singer/:singer
#### 用户后台页
   * 用户注册：localhost:3010/user/sign
   * 用户登录：localhost:3010/user/loginPage
   * 用户个人页面：localhost:3010/user/userPage
   * 修改头像：localhost:3010/user/update/img
   * 修改密码：localhost:3010/user/update/pws
#### 音乐后台页
   * 后台录入页：localhost:3010/upload/music
   * 更新页：localhost:3010/music/update/:id
#### 管理员页面
   * 登录：localhost:3010/admin/userlogin
   * 用户列表：localhost:3010/admin/userlist
   * 音乐列表页：localhost:3010/admin/list
   * 分类列表：localhost:3010/admin/categoriesList
