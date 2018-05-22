//引入mongoose的建模工具模块
var mongoose = require('mongoose');
//引入music文件导出的musicSchema模块 
var MusicSchema = require('../schemas/music');
//编译生成Music模块，传入模型名字和模式
var Music = mongoose.model('Music',MusicSchema);

//将构造函数导出
module.exports = Music;