module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'//添加banner
            },
            buildCustomJs: {
                options: {
                    mangle: true, //混淆变量名
                    report: "min",//输出压缩率，可选的值有 false(不输出信息)，gzip
                    preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: [{
                    expand:true,
                    cwd:'es5',//js目录下
                    src:'**/*.js',//所有js文件
                    dest: 'dist/javascripts'//输出到此目录下
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
                    cwd: 'public/stylesheets/page',//压缩那个文件夹里的文件
                    src:['**/*.css', '!*.min.css','!assets/*'],//压缩那个文件
                    dest: 'dist/stylesheets'//输出到此目录下
                }]
            }
        },
        htmlmin:{
            options: {
                removeComments: true, //移除注释
                removeCommentsFromCDATA: true,//移除来自字符数据的注释
                collapseWhitespace: true,//无用空格
                collapseBooleanAttributes: true,//失败的布尔属性
                removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
                removeRedundantAttributes: true,//移除多余的属性
                useShortDoctype: true,//使用短的跟元素
                removeEmptyAttributes: true,//移除空的属性
                removeOptionalTags: true//移除可选附加标签
            },
            buildViews:{
                expand: true,
                cwd: 'views',//压缩那个文件夹里的文件
                src:'**/*.html',//压缩那个文件
                dest: 'dist/views'//输出到此目录下
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
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 默认任务 少了一个js的压缩 因为js压缩要用babel转化一次
    grunt.registerTask('default', ['uglify','cssmin' , 'htmlmin','imagemin'  ]);

    grunt.registerTask('js', ['uglify:buildCustomJs']);
    grunt.registerTask('css', ['cssmin:buildCss']);
    grunt.registerTask('html', ['htmlmin:buildViews']);
    grunt.registerTask('image', ['imagemin:buildImages']);
};