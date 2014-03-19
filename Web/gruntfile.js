var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		
        // CSS
        less: {
            options: {
                strictMath: true,
                strictUnits: true,
                sourceMap: false // We're going to be post-processing the compiled output
            },
            css: {
                src: 'css/rohbot.less',
                dest: 'build/css/rohbot.css'
            }
        },
        myth: {
            css: {
                src: 'build/css/rohbot.css',
                dest: 'build/style.css'
            }
        },

        // JavaScript
        typescript: {
            js: {
                src: ['js/RohStore.ts', 'js/**/*.ts'],
                dest: 'build/js/rohbot-typescript.js'
            }
        },
        concat: {
            js: {
                src: ['build/js/rohbot-typescript.js', 'build/js/init.js'],
                dest: 'build/rohbot.js'
            },
            jslib: {
                src: 'jslib/*.min.js',
                dest: 'build/jslibs.min.js'
            }
        },
		uglify: {
		    js: {
		        files: {
		            'dist/rohbot.js': ['build/rohbot.js']
		        }
		    }
		},

        // HTML (including Templates)
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            index: {
                src: 'dist/index.htm',
                dest: 'dist/index.htm'
            },
            templates: {
                src: 'templates/*',
                dest: 'build/',
                expand: true
            },
        },
        hogan: {
            templates: {
                templates: 'build/templates/*.mustache',
                output: 'build/templates.js',
                binderName: 'hulk'
            }
        },
		
        // Other
        copy: {
            js: {
                src: 'js/*.js',
                dest: 'build/js/',
                expand: true,
                flatten: true
            },
            img: {
                src: 'img/*',
                dest: 'dist/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            index: {
                src: 'index.htm',
                dest: 'build/'
            },
            dist: {
                src: 'build/*',
                dest: 'dist/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        },
        clean: {
            dist: 'dist',
            build: 'build'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-myth');
    grunt.loadNpmTasks('grunt-hogan');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('default', [
        'setup',
        'clean:dist',
        'css',
        'js',
        'html',
        'img',
        'dist'
    ]);

    grunt.registerTask('setup', function() {
        if (!fs.existsSync('build'))
            fs.mkdirSync('build');

        if (!fs.existsSync('build/jslibs.min.js'))
            grunt.task.run('concat:jslib');
    });

    grunt.registerTask('css', [
        'less:css',
        'myth:css'
    ]);

    grunt.registerTask('js', [
        'typescript:js',
        'copy:js',
        'concat:js'
    ]);

    grunt.registerTask('html', [
        'copy:index',
        'htmlmin:templates',
        'hogan:templates'
    ]);

    grunt.registerTask('img', [
        'copy:img'
    ]);

    grunt.registerTask('dist', [
        'copy:dist',
        'htmlmin:index',
        'uglify:js'
    ]);
};