<?php
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');
function theme_enqueue_scripts(){

	wp_register_script('modernizr', get_bloginfo('template_url') . '/js/modernizr.js');
	wp_enqueue_script('modernizr');

	if( WP_ENV == 'local') {

		// README If using require.js uncomment following lines
		// wp_register_script('require', get_bloginfo('template_url') . '/js/vendor/requirejs/require.js', array(), false, true);
		// wp_register_script('global', get_bloginfo('template_url') . '/js/global.js', array('require'), false, true);

		wp_register_script('livereload', site_url( ':35729/livereload.js?snipver=1' ), null, false, true);
		
		wp_register_script(
			'main', 
			get_bloginfo('template_url') . '/js/main.js', 
			null, 
			array('jquery'), 
			true
		);

		wp_enqueue_script('livereload');
	}

	if( WP_ENV == 'staging') {
		//staging stuff here

		// README If using require.js uncomment following lines
		// wp_register_script('global', get_bloginfo('template_url') . '/js/optimized.min.js', array(), false, true);

		wp_register_script(
			'main', 
			get_bloginfo('template_url') . '/js/main.min.js', 
			null, 
			array('jquery'), 
			true
		);
	}

	if( WP_ENV == 'production') { 
		//production stuff here

		// README If using require.js uncomment following lines
		// wp_register_script('global', get_bloginfo('template_url') . '/js/optimized.min.js', array(), false, true);
		wp_register_script(
			'main', 
			get_bloginfo('template_url') . '/js/main.min.js', 
			null, 
			array('jquery'), 
			true
		);
	}

	// README If using require.js uncomment following lines
	// wp_enqueue_script('global');

	wp_enqueue_script('main');

	wp_enqueue_style('global', get_bloginfo('template_url') . '/css/global.css');
}

//Add Featured Image Support
add_theme_support('post-thumbnails');

// Clean up the <head>
function removeHeadLinks() {
	remove_action('wp_head', 'rsd_link');
	remove_action('wp_head', 'wlwmanifest_link');
}
add_action('init', 'removeHeadLinks');
remove_action('wp_head', 'wp_generator');

function register_menus() {
	register_nav_menus(
		array(
			'main-nav' => 'Main Navigation',
			'secondary-nav' => 'Secondary Navigation',
			'sidebar-menu' => 'Sidebar Menu'
		)
	);
}
add_action( 'init', 'register_menus' );

function register_widgets(){

	register_sidebar( array(
		'name' => __( 'Sidebar' ),
		'id' => 'main-sidebar',
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

}//end register_widgets()
add_action( 'widgets_init', 'register_widgets' );
