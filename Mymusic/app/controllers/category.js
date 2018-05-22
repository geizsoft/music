var Category = require('../models/category');

//admin post movie
exports.save = function(req,res){
	var _category = req.body.category;
	var category = new Category({
		name:_category.name
	});
	// console.log(category);

	category.save(function(err,cate){
		if(err){
			console.log(err)
		}

		res.redirect('/admin/categoriesList');
	})
	
}
exports.page = function(req,res){
	res.render('admin/category_admin',{
		title:'分类'
	});
}
exports.list = function(req,res){
	var count = 9;
	var page = parseInt(req.query.p,10) || 0;
	var index = page * count;
	var p = req.query.p;
	if(p == undefined){
		Category.fetch(function(err,categories){
				if(err){
					console.log(err);
				}
				var results = categories.slice(index,index + count);
				res.render("admin/category_list",{
					title:'分类列表',
					currentPage:(page + 1),
					totalPage:Math.ceil(categories.length / count),
					categories:results
				});
			});
	}else{
		Category.find({})
			.limit(count)
			.skip(index)
			.sort('meta.updateAt')
			.exec(function(err,categories){
				res.json({categories:categories});
			});
	}
	
}

exports.delete = function(req,res){
	var id = req.query.id;
	if(id){
		Category.remove({_id:id},function(err,category){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}

		});
	}
}