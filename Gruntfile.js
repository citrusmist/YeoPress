module.exports = function(grunt) {

	// To support SASS/SCSS, Stylus, Compass or RequireJS just install
	// the appropriate grunt package and it will be automatically included
	// in the build process, Sass is included by default:
	//
	// * for SASS/SCSS support,  run `npm install --save-dev grunt-contrib-sass`
	// * for Stylus/Nib support, run `npm install --save-dev grunt-contrib-stylus`
	// * for Compass support,    run `npm install --save-dev grunt-contrib-compass`
	// * for RequireJS support,  run `npm install --save-dev grunt-contrib-requirejs`
	// *                     and run `npm install --save-dev grunt-bower-requirejs`

	var npmDependencies = require('./package.json').devDependencies;
	var hasRequireJs = npmDependencies['grunt-contrib-requirejs'] !== undefined;
	var hasSass      = npmDependencies['grunt-contrib-sass'] !== undefined;
	var hasCompass   = npmDependencies['grunt-contrib-compass'] !== undefined;
	var hasStylus    = npmDependencies['grunt-contrib-stylus'] !== undefined;

	grunt.initConfig({

		// Watches for changes and runs tasks
		watch : {
			sass : {
				files : ['scss/**/*.scss'],
				tasks : (hasSass) ? ['sass:dev'] : null,
				options : {
					livereload : true
				}
			},
			compass: {
        files: ['scss/{,*/}*.{scss,sass}'],
        tasks: (hasCompass) ? ['compass:server'] : null,
        options : {
					livereload : true
				}
      },
			stylus : {
				files : ['stylus/**/*.styl'],
				tasks : (hasStylus) ? ['stylus:dev'] : null,
				options: {
					livereload : true
				}
			},
			js : {
				files : ['js/*.js', 'js/bespoke/**/*.js', '!js/*.min.js'],
				tasks : ['jshint', 'uglify'],
				options : {
					livereload : true
				}
			},
			bower : {
				files : ['js/vendor/**/*.js'],
				tasks : ['bower_concat'],
			},
			php : {
				files : ['**/*.php'],
				options : {
					livereload : true
				}
			}
		},

		// JsHint your javascript
		jshint : {
			all : ['js/*.js', '!js/modernizr.js', '!js/*.min.js', '!js/_bower.js', '!js/vendor/**/*.js'],
			options : {
				browser: true,
				curly: false,
				eqeqeq: false,
				eqnull: true,
				expr: true,
				immed: true,
				newcap: true,
				noarg: true,
				smarttabs: true,
				sub: true,
				undef: false
			}
		},

		// Dev and production build for sass
		sass : {
			production : {
				files : [
					{
						src : ['**/*.scss', '!**/_*.scss'],
						cwd : 'scss',
						dest : 'css',
						ext : '.css',
						expand : true
					}
				],
				options : {
					style : 'compressed'
				}
			},
			dev : {
				files : [
					{
						src : ['**/*.scss', '!**/_*.scss'],
						cwd : 'scss',
						dest : 'css',
						ext : '.css',
						expand : true
					}
				],
				options : {
					style : 'expanded'
				}
			}
		},

		compass: {
      options: {
        sassDir: 'scss',
        cssDir: 'css',
        generatedImagesDir: 'images/generated',
        imagesDir: 'images',
        javascriptsDir: 'js',
        fontsDir: 'css/fonts',
        importPath: 'js/vendor',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/css/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    concurrent: {
      server: [
        'compass:server'
      ],
    },

		// Dev and production build for stylus
		stylus : {
			production : {
				files : [
					{
						src : ['**/*.styl', '!**/_*.styl'],
						cwd : 'stylus',
						dest : 'css',
						ext: '.css',
						expand : true
					}
				],
				options : {
					compress : true
				}
			},
			dev : {
				files : [
					{
						src : ['**/*.styl', '!**/_*.styl'],
						cwd : 'stylus',
						dest : 'css',
						ext: '.css',
						expand : true
					}
				],
				options : {
					compress : false
				}
			},
		},

		// Bower task sets up require config
		bower : {
			all : {
				rjsConfig : 'js/global.js'
			}
		},

		bower_concat : {
			all : {
				dest: 'js/_bower.js',
				bowerOptions: {
		      relative: false
		    }
		  }
		},

		// Require config
		requirejs : {
			production : {
				options : {
					name : 'global',
					baseUrl : 'js',
					mainConfigFile : 'js/global.js',
					out : 'js/optimized.min.js'
				}
			}
		},

		uglify: {
			options: {
				mangle: false
			},
			production: {
				files: {
					'js/main.min.js': ['js/_bower.js', 'js/bespoke/**/*.js', 'js/main.js']
				}
			}
		},

		// Image min
		imagemin : {
			production : {
				files : [
					{
						expand: true,
						cwd: 'images',
						src: '**/*.{png,jpg,jpeg}',
						dest: 'images'
					}
				]
			}
		},

		// SVG min
		svgmin: {
			production : {
				files: [
					{
						expand: true,
						cwd: 'images',
						src: '**/*.svg',
						dest: 'images'
					}
				]
			}
		}


	});

	// Default task
	grunt.registerTask('default', ['concurrent:server', 'watch']);

	// Build task
	grunt.registerTask('build', function() {
		var arr = ['jshint'];

		if (hasCompass) {
			arr.push('compass:dist');
		}

		if (hasSass) {
			arr.push('sass:production');
		}

		if (hasStylus) {
			arr.push('stylus:production');
		}

		arr.push('imagemin:production', 'svgmin:production');

		if (hasRequireJs) {
			arr.push('requirejs:production');	
		}

		return arr;
	});

	// Template Setup Task
	grunt.registerTask('setup', function() {
		var arr = [];

		if(hasCompass) {
			arr.push('compass:server');
		}

		if (hasSass) {
			arr.push('sass:dev');
		}

		if (hasStylus) {
			arr.push('stylus:dev');
		}

		arr.push('bower-install');
	});

	// Load up tasks
	if (hasCompass) {
		grunt.loadNpmTasks('grunt-concurrent');
		grunt.loadNpmTasks('grunt-contrib-compass');
	}

	// Load up tasks
	if (hasSass) {
		grunt.loadNpmTasks('grunt-contrib-sass');
	}

	if (hasStylus) {
		grunt.loadNpmTasks('grunt-contrib-stylus');
	}
	
	if(hasRequireJs) {
		grunt.loadNpmTasks('grunt-bower-requirejs');
		grunt.loadNpmTasks('grunt-contrib-requirejs');
	}

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-svgmin');

	// Run bower install
	grunt.registerTask('bower-install', function() {
		var done = this.async();
		var bower = require('bower').commands;
		bower.install().on('end', function(data) {
			done();
		}).on('data', function(data) {
			console.log(data);
		}).on('error', function(err) {
			console.error(err);
			done();
		});
	});

};
