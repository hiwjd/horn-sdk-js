module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    author: {
      name: "hiwjd",
      email: "self@hiwjd.com"
    },
    concat: {
      options: {
        separator: '\n'
      },
      horn: {
        src: [
            //'src/zepto.min.js',
            'src/jquery-3.1.1.js',
            'src/cookies.js',
            'src/polyfill.js',
            'src/fingerprint2.min.js',
            'src/utils.js',
            'src/config.js',
            'src/http.js',
            'src/protocol.js',
            'src/conn.js',
            'src/api.js',
            'src/horn.js'
        ],
        dest: '../horn-www/dst/horn.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n',
        preserveComments: 'some'
      },
      chat: {
        src: '../horn-www/dst/horn.js',
        dest: '../horn-www/dst/horn.min.js'
      }
    },
    watch: {
        files: ['src/*.js', 'src/**/*.js', 'vender/*.js'],
        tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'uglify']);
}
