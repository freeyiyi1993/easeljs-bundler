module.exports = function (grunt) {
  // 项目配置 测试用
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
            'src/createjs/events/Event.js',
            'src/createjs/utils/extend.js',
            'src/createjs/utils/indexOf.js',
            'src/createjs/utils/promote.js',
            'src/easeljs/display/Graphics.js',
            'src/easeljs/geom/Matrix2D.js',
            'src/easeljs/geom/Point.js',
            'src/easeljs/geom/Rectangle.js',
            'src/easeljs/utils/UID.js',
            'src/createjs/events/EventDispatcher.js',
            'src/easeljs/events/MouseEvent.js',
            'src/easeljs/geom/DisplayProps.js',
            'src/easeljs/display/DisplayObject.js',
            'src/easeljs/display/Container.js',
            'src/easeljs/display/Shape.js',
            'src/easeljs/display/Stage.js'
        ],
        dest: 'dest/bundler.js'
      }
    },
    copy: {// src dir to copy dir
      main: {
        files: [
        // flattens results to a single level
        {expand: true, flatten: true, src: ['src/**'], dest: 'copy/', filter: 'isFile'}
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // 默认任务
  grunt.registerTask('default', ['concat']);
}