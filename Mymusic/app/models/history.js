//引入mongoose的建模工具模块
var mongoose = require('mongoose');
//引入comment文件导出的CommentSchema文件
var HistorySchema = require('../schemas/history');
//编译生成Comment模块，传入模型名字和模式
var History = mongoose.model('History',HistorySchema);
//将构造函数导出
module.exports = History;