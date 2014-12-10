'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var config = {
    app: 'app',
    dist: 'dist'
  };
  
  var path = require('path');
  grunt.initConfig({
    
    config: config,
    
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      chrome: {
        options: {
            open: false,
            base: [
                '<%= config.app %>'
            ]
        }
      },
      test: {
        options: {
          open: false,
          base: [
              'test',
              '<%= config.app %>'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: ['**']
        }]
      }
    },

    compress: {
      dist: {
        options: {
          archive: function() {
            var manifest = grunt.file.readJSON('app/manifest.json');
            return 'package/my-hatebu-search-' + manifest.version + '.zip';
          }
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: ''
        }]
      }
    },

    qunit: {
      files: ['test/index.html']
    },

    // http://yosuke-furukawa.hatenablog.com/entry/2013/06/04/085537
    // https://github.com/yatskevich/grunt-bower-task
    bower: {
      install: {
        options: {
          targetDir: './app/bower',
          //layout: "byComponent",
          layout: function(type, component, source) {
            return path.join(type);
          },
          install: true,
          verbose: true,
          cleanTargetDir: true,
          cleanBowerDir: false,
          bowerOptions: {
            production: false
          }
        }
      }
    }
  });

  grunt.registerTask('init', [
    'bower:install'
  ]);

  grunt.registerTask('test', [
    'connect:test',
    'qunit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy',
    'compress'
  ]);

};