module.exports = function(grunt){

	// 项目配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			options: {
				sourceMap: false,
				presets: ['babel-preset-es2015']
			},
			buildJs: {
				files: [{
					expand: true,
					cwd:'public/javascripts-es6',//js目录下
					src:'**/*.js',//所有js文件
					dest: 'public/javascripts'//输出到此目录下
				}]
			}
		},
		uglify: {
			options: {
				mangle: true, //混淆变量名
				report: "min",//输出压缩率，可选的值有 false(不输出信息)，gzip
				preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'//添加banner
			},
			buildCustomJs: {
				options: {
					footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
				},
				files: [{
					expand:true,
					cwd:'public/javascripts',//js目录下
					src:'**/*.js',//所有js文件
					dest: 'public/javascripts'//输出到此目录下
				}]
			},
			buildCustomhtml: {
				options: {
					mangle: true, //混淆变量名
					report: "min",//输出压缩率，可选的值有 false(不输出信息)，gzip
					preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
					footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
				},
				files: [{
					expand:true,
					cwd:'public/javascripts',//js目录下
					src:'**/*.html',//所有js文件
					dest: 'dist/views'//输出到此目录下
				}]
			}
			// ,
			// release: {//任务四：合并压缩a.js和b.js
			//     files: {
			//         'dist/js/index.min.js': ['config/apiApplication.js', 'config/startPort.js']
			//     }
			// }
		},
		cssmin:{
			options: {
				stripBanners:true, //合并时允许输出头部信息
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'//添加banner
			},
			buildCss:{
				options:{
					mangle:false,
					report: "min",//输出压缩率，可选的值有 false(不输出信息)，gzip
					preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
					footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
				},
				files: [{
					expand: true,
					cwd: 'public/stylesheets-all/',//压缩那个文件夹里的文件
					src:['**/*.css', '!*.min.css','!assets/*'],//压缩那个文件
					dest: 'public/stylesheets'//输出到此目录下
				}]
			}
		},
		htmlmin:{
			options: {
				tplSelector: 'script[type="text/babel"]', //设置script的类型
				removeComments: true, //移除注释
				removeCommentsFromCDATA: true,//移除来自字符数据的注释
				collapseWhitespace: true,//无用空格
				collapseBooleanAttributes: true,//失败的布尔属性
				// removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
				// removeRedundantAttributes: true,//移除多余的属性
				useShortDoctype: true,//使用短的根元素
				removeEmptyAttributes: true,//移除空的属性
				// removeOptionalTags: true,//移除可选附加标签
				minifyJS: true, //压缩html内的js
				minifyCSS:true

			},
			buildViews:{
				expand: true,
				cwd: 'views-es6',//压缩那个文件夹里的文件
				src:'**/*.html',//压缩那个文件
				dest: 'views'//输出到此目录下
			}
		},//压缩图片
		imagemin: {
			buildImages: {
				options: {
					optimizationLevel: 7,
					pngquant: true
				},
				files: [
					{
						expand: true,
						cwd: 'public',
						src: ['**/*.{png,jpg,jpeg,gif,ico}','!generic/**','!stylesheets/assets/**'],
						dest: 'dist/images'
					}
				]
			}
		},
		replace: {
			example: {
				src: ['views/*.html'],             // source files array (supports minimatch)
				overwrite: true,                 // overwrite matched source files
				replacements: [{
					from: /\/\*[\s\S]*?\*\//g,      //移除所有注释
					to: ''
				}]
			}
		},
		watch:{
			html:{
				files: ['views-es6/*.html'],
				tasks: ['htmlmin:buildViews','replace:example']
			},
			css:{
				files: ['public/stylesheets-all/**/*.css', '!public/stylesheets-all/*.min.css','!public/stylesheets-all/assets/*'],
				tasks: ['cssmin:buildCss']
			},
			js :{
				files:['public/javascripts-es6/*.js'],
				tasks: ['babel:buildJs','uglify:buildCustomJs']
			}
		}
	});

	// 加载提供"uglify"任务的插件
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('ali-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-babel');

	// 默认任务 少了一个js的压缩 因为js压缩要用babel转化一次
	grunt.registerTask('default', ['uglify','cssmin' , 'htmlmin','imagemin'  ]);

	grunt.registerTask('babelJs', ['babel:buildJs']);
	grunt.registerTask("clearCode", ['replace:example']);
	grunt.registerTask('js', ['uglify:buildCustomJs']);
	grunt.registerTask('css', ['cssmin:buildCss']);
	grunt.registerTask('html', ['htmlmin:buildViews','replace:example']);
	grunt.registerTask('image', ['imagemin:buildImages']);


};