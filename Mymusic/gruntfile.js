module.exports = function(grunt){
	grunt.initConfig({
		watch:{
			jade:{
				//传递监听的视图文件
				files:['views/**'],
				options:{
					nospawn: true,
					interrupt: false,
					debounceDelay: 250
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				// tasks:['jshint'],
				// tasks:['livereload'],
				options:{
					nospawn: true,
          			interrupt: false,
          			debounceDelay: 250
				}
			}
		},
		nodemon:{
			dev:{
				script:'app.js',
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['READMD.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,
					dalayTime:1,
					env:{
						PORT:3010
					},
					cwd:__dirname
				}
			}
		},
		mochaTest:{
			options:{
				reporter: 'spec'
			},
			src:['test/**/*.js']
		},
		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	});

	//加载安装的插件
	//只要有文件删改就会重新加载
	grunt.loadNpmTasks('grunt-contrib-watch');
	//监听入口文件app.js,如果有改动，就会重启app.js
	grunt.loadNpmTasks('grunt-nodemon');
	//针对慢任务开发的插件
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.option('force',true);
	grunt.registerTask('default',['concurrent']);
	grunt.registerTask('test',['mochaTest']);
}