//引入mongoose的建模工具模块
var mongoose = require('mongoose');
//引入comment文件导出的CommentSchema文件
var CommentSchema = require('../schemas/comment');
//编译生成Comment模块，传入模型名字和模式
var Comment = mongoose.model('Comment',CommentSchema);
//将构造函数导出
module.exports = Comment;
