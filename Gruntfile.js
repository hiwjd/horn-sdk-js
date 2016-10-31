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
            'src/http.js',
            'src/protocol.js',
            'src/conn.js',
            'src/horn.js',
            'src/api.js'
        ],
        dest: '../../src/horn/bin/demo/assets/horn.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n',
        preserveComments: 'some'
      },
      chat: {
        src: '../../src/horn/bin/demo/assets/horn.js',
        dest: '../../src/horn/bin/demo/assets/horn.min.js'
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
