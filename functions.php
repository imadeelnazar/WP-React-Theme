<?php


function wpscience_scripts() {
    $page_on_front = get_post(get_option( 'page_on_front' ));
    if(isset($page_on_front) && $page_on_front <> ''){
        $page_on_front_slug = $page_on_front->post_name;
        $page_on_front_ID = $page_on_front->ID;
    }else{
        $page_on_front_slug = '';
        $page_on_front_ID = '';
    }
    $menu_name = 'main_menu';
    $main_menu_responsive = 'main_menu_responsive';

    wp_enqueue_script( 'wp-trigger-bundle', get_template_directory_uri() . '/dist/bundle.js', array(), '1.0.0', true );
    wp_localize_script( 'wp-trigger-bundle', 'wpScienceTheme', [
        'apiUrl' => home_url( '/wp-json' ),
        'homeURL' => home_url( '/' ),
        'show_on_front' => get_option( 'show_on_front' ),
        'page_on_front_slug' => $page_on_front_slug,
        'page_on_front_ID' => $page_on_front_ID,
        'main_navi' => wp_get_nav_menu_object( get_nav_menu_locations( $menu_name )[ $menu_name ] )->term_id,
        'top_navi' => wp_get_nav_menu_object( get_nav_menu_locations( $main_menu_responsive )[ $main_menu_responsive ] )->term_id,
        'footer_navi' => wp_get_nav_menu_object( get_nav_menu_locations( $main_menu_responsive )[ $main_menu_responsive ] )->term_id,
        'themeURL' => get_template_directory_uri(),
        'nonce' => wp_create_nonce( 'wp_rest' ),
    ] );
}
add_action( 'wp_enqueue_scripts', 'wpscience_scripts' );

function mytheme_customizer_live_preview()
{
	wp_enqueue_script(
		  'mytheme-themecustomizer',			//Give the script an ID
		  get_template_directory_uri().'/assets/customizer.js',//Point to file
		  array( 'jquery','customize-preview','wp-api' ),	//Define dependencies
		  '',						//Define a version (optional)
		  false						//Put script in footer?
	);
}
add_action( 'customize_preview_init', 'mytheme_customizer_live_preview' );
// add_action( 'wp_enqueue_scripts', 'mytheme_customizer_live_preview' );


function wpscience_styles() {
    wp_enqueue_style( 'style', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'wpscience_styles' );

// Individual menus
add_action( 'rest_api_init', 'wpscience_trigger_simple_func');
function wpscience_trigger_simple_func(){
    register_rest_route( 'v1/navigation', '/menu/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'wpscience_menu_single',
        'permission_callback' => '__return_true'
    ));
}

function wpscience_menu_single($data) {
    // $data = 'main_menu';
    $menuID = $data['id']; // Get the menu from the ID
    // $menuLocations = get_nav_menu_locations(); // Get our nav locations (set in our theme, usually functions.php)
    // $menuID = $menuLocations[$data]; // Get the *primary* menu ID
    // $menuID = $data['id']; // Get the menu from the ID
    $primaryNav = wp_get_nav_menu_items($menuID); // Get the array of wp objects, the nav items for our queried location.
    return $primaryNav;
}


// Individual menus
add_action( 'rest_api_init', 'wpscience_get_testimonial_api_data');
function wpscience_get_testimonial_api_data(){
    register_rest_route( 'v1/tesimonials', '/id/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'wpscience_get_testimonial',
        'permission_callback' => '__return_true'
    ));
}

function wpscience_get_testimonial($data) {
    $args = array(
        'post_type'   => 'testimonials'
    );
    $get_testi = get_posts($args);

   return $get_testi;

}

// Individual menus
add_action( 'rest_api_init', 'wpscience_get_testimonial_image_by_id');
function wpscience_get_testimonial_image_by_id(){
    register_rest_route( 'v3/fimage', '/id/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'wpscience_get_testimonial_media_func',
        'permission_callback' => '__return_true'
    ));
}

function wpscience_get_testimonial_media_func($data) {
    $menuID = $data['id'];
    $image_src = wp_get_attachment_image_src(get_post_thumbnail_id($menuID), 'full');

    return $image_src;

}


// Sidebar
add_action( 'rest_api_init', 'wpscience_rest_sidebar');
function wpscience_rest_sidebar(){
    register_rest_route( 'v3/sidebar', '/(?P<slug>[a-zA-Z]+)', array(
        'methods' => 'GET',
        'callback' => 'wpscience_get_sidebar',
        'permission_callback' => '__return_true'
    ));
}

function wpscience_get_sidebar($data) {
    $slug = $data['slug'];
    ob_start();
    dynamic_sidebar($slug);
    $response_body = ob_get_clean();
    return $response_body;

}

// Sidebar
/**
 * Add the customizer field to the REST API.
 */
function register_customizer_field() {
  register_rest_route( 'ultimate/v1', '/customizer/(?P<slug>[a-zA-Z0-9_-]+)', array(
    'methods' => WP_REST_Server::READABLE,
    'callback' => 'get_customizer_field_value',
    'permission_callback' => '__return_true',
  ) );
}
add_action( 'rest_api_init', 'register_customizer_field' );

/**
 * Get the value of a customizer field from the REST API.
 */
function get_customizer_field_value( $request ) {
  $slug = $request->get_param( 'slug' );
  $value = get_theme_mod( $slug, '' );
  return is_string( $value ) ? $value : '';

//   return rest_ensure_response( $value );
}

// Individual menus
// add_action( 'rest_api_init', 'get_acf_custom_field_api');
// function get_acf_custom_field_api(){
//     register_rest_route( 'v2/wpacf/', '/field/(?P<id>\d+)', array(
//         'methods' => 'GET',
//         'callback' => 'wp_get_acf_field',
//         'permission_callback' => '__return_true'
//     ));
// }

// function wp_get_acf_field($data) {
//     get_field();
//     return $primaryNav;
// }

// function create_ACF_meta_in_REST() {
//     $postypes_to_exclude = ['acf-field-group','acf-field'];
//     $extra_postypes_to_include = ["page"];
//     $post_types = array_diff(get_post_types(["_builtin" => false], 'names'),$postypes_to_exclude);

//     array_push($post_types, $extra_postypes_to_include);

//     foreach ($post_types as $post_type) {
//         register_rest_field( $post_type, 'ACF', [
//             'get_callback'    => 'expose_ACF_fields',
//             'schema'          => null,
//        ]
//      );
//     }

// }

// function expose_ACF_fields( $object ) {
//     $ID = $object['id'];
//     return get_fields($ID);
// }

// add_action( 'rest_api_init', 'create_ACF_meta_in_REST' );



function custom_theme_customize_register( $wp_customize ) {
    // Register a custom panel
    $wp_customize->add_panel( 'ultimateSEO_panel', array(
        'title' => __( 'Ultimate TF', 'my_theme' ),
        'description' => __( 'Ultimate SEO Options.', 'my_theme' ),
        'priority' => 10,
    ) );

    // Register a custom section within the panel
    $wp_customize->add_section( 'ultimateSEO_section', array(
        'title' => __( 'Logo', 'my_theme' ),
        'description' => __( 'Website Identity Settings', 'my_theme' ),
        'panel' => 'ultimateSEO_panel',
        'priority' => 10,
    ) );

    // Register a custom setting and field within the section
    $wp_customize->add_setting( 'ultimateSEO_setting', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    // Add an image upload field to the section
    $wp_customize->add_setting( 'ultimate_logo', array(
        'default' => '',
        'transport' => 'websocket',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'ultimate_logo', array(
        'label' => __( 'Logo', 'mytheme' ),
        'section' => 'ultimateSEO_section',
        'settings' => 'ultimateSEO_setting',
        'settings' => 'ultimate_logo',
    ) ) );


    $wp_customize->add_control( 'ultimateSEO_paddingLeft', array(
        'label' => __( 'Logo Padding Left', 'my_theme' ),
        'type' => 'text',
        'description' => __( 'Add "px" at the end', 'my_theme' ),
        'section' => 'ultimateSEO_section',
        'settings' => 'ultimateSEO_setting',
        'priority' => 10,
    ) );

    $wp_customize->add_control( 'ultimateSEO_paddingRight', array(
        'label' => __( 'Logo Padding Right', 'my_theme' ),
        'type' => 'text',
        'description' => __( 'Add "px" at the end', 'my_theme' ),
        'section' => 'ultimateSEO_section',
        'settings' => 'ultimateSEO_setting',
        'priority' => 10,
    ) );

    $wp_customize->add_control( 'ultimateSEO_paddingTop', array(
        'label' => __( 'Logo Padding Top', 'my_theme' ),
        'type' => 'text',
        'description' => __( 'Add "px" at the end', 'my_theme' ),
        'section' => 'ultimateSEO_section',
        'settings' => 'ultimateSEO_setting',
        'priority' => 10,
    ) );

    $wp_customize->add_control( 'ultimateSEO_paddingBottom', array(
        'label' => __( 'Logo Padding Bottom', 'my_theme' ),
        'type' => 'text',
        'description' => __( 'Add "px" at the end', 'my_theme' ),
        'section' => 'ultimateSEO_section',
        'settings' => 'ultimateSEO_setting',
        'priority' => 10,
    ) );

    // Register a custom section within the panel
    $wp_customize->add_section( 'ultimateSEO_sectionFooter', array(
        'title' => __( 'Footer', 'my_theme' ),
        'description' => __( 'Footer Settings', 'my_theme' ),
        'panel' => 'ultimateSEO_panel',
        'priority' => 10,
    ) );

    // Register a custom setting and field within the section
    $wp_customize->add_setting( 'ultimateSEO_settingFooter', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );


    // Add an image upload field to the section
    $wp_customize->add_setting( 'ultimate_logo_footer', array(
        'default' => '',
        'transport' => 'websocket',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'ultimate_logo_footer', array(
        'label' => __( 'Footer Logo', 'mytheme' ),
        'section' => 'ultimateSEO_sectionFooter',
        'settings' => 'ultimateSEO_settingFooter',
        'settings' => 'ultimate_logo_footer',
    ) ) );



    // Register a custom section within the panel
    $wp_customize->add_section( 'ultimateSEO_sectionSubHeader', array(
        'title' => __( 'Sub Header', 'my_theme' ),
        'description' => __( 'Sub Header Settings', 'my_theme' ),
        'panel' => 'ultimateSEO_panel',
        'priority' => 10,
    ) );

    // Register a custom setting and field within the section
    $wp_customize->add_setting( 'ultimateSEO_settingSubHeader', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );


    // Add an image upload field to the section
    $wp_customize->add_setting( 'ultimate_subheader_BG', array(
        'default' => '',
        'transport' => 'websocket',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'ultimate_logo_footer', array(
        'label' => __( 'Sub Header BG', 'mytheme' ),
        'section' => 'ultimateSEO_sectionSubHeader',
        'settings' => 'ultimateSEO_settingSubHeader',
        'settings' => 'ultimate_subheader_BG',
    ) ) );
}
add_action( 'customize_register', 'custom_theme_customize_register' );



function modify_search_form_action( $form ) {
    $form = str_replace( 'action="' . home_url( '/' ) . '"', 'action="' . home_url( '/search/' ) . '"', $form );
    return $form;
}
add_filter( 'get_search_form', 'modify_search_form_action' );

function modify_search_query( $query ) {
    if ( $query->is_search() && ! empty( $_GET['s'] ) ) {
        wp_redirect( home_url( '/search/?s=' . urlencode( get_query_var( 's' ) ) ) );
        exit();
    }
}
add_filter( 'pre_get_posts', 'modify_search_query' );


// action to require the necessary wordpress function
add_action( 'after_setup_theme', 'wpscience_theme_setup' );
if( !function_exists('wpscience_theme_setup') ){
    function wpscience_theme_setup(){

        register_nav_menus( array(
            'main_menu'=> esc_html__( 'Main Navigation', 'islamic-center' ),
            'main_menu_responsive'=> esc_html__( 'Main Navigation Responsive', 'islamic-center' )
        ));

        // adds RSS feed links to <head> for posts and comments.
        add_theme_support( 'automatic-feed-links' );

        //WooCommerce Support
        add_theme_support( 'woocommerce' );

        //title tags
        add_theme_support( 'title-tag' );

        // Post Thumbnails
        add_theme_support( 'post-thumbnails' );

        // Search Form
        add_theme_support( 'html5', array( 'search-form' ) );

        // This theme supports a variety of post formats.
        add_theme_support( 'post-formats', array( 'aside', 'gallery', 'link', 'image', 'quote', 'video', 'audio' ) );
    }
}




if (function_exists('register_sidebar')){
    function kode_sidebar_creation(){
        // default sidebar array
        $sidebar_attr = array(
            'name' => '',
            'description' => '',
            'before_widget' => '<div class="widget sidebar-recent-post sidebar_section %2$s">',
            'after_widget' => '</div>',
            'before_title' => '<h3>',
            'after_title' => '</h3>'
        );
        $item_class = 'col-md-4';
        $item_class_mega = 'col-md-4';
        $item_class_mega = 'col-md-6';
        $kode_sidebar = array("Footer");

        foreach( $kode_sidebar as $sidebar_name ){
            $sidebar_attr['name'] = $sidebar_name;
            $sidebar_slug = strtolower(str_replace(' ','-',$sidebar_name));
            $sidebar_attr['id'] = 'sidebar-' . $sidebar_slug ;
            $sidebar_attr['before_widget'] = '<div id="%1$s" class="'.esc_attr($item_class).' widget %2$s kode-widget">' ;
            $sidebar_attr['after_widget'] = '</div>' ;
            $sidebar_attr['before_title'] = '<h3 class="widget-title">';
            $sidebar_attr['after_title'] = '</h3><div class="clear"></div>' ;
            $sidebar_attr['show_in_rest'] = true;
            $sidebar_attr['show_instance_in_rest'] = true;
            $sidebar_attr['description'] = 'Please place '.esc_attr(strtolower($sidebar_name)).' widget here' ;
            register_sidebar($sidebar_attr);
        }

        $item_class = 'col-md-3';
        $kode_sidebar = array("Left Footer");
        foreach( $kode_sidebar as $sidebar_name ){
            $sidebar_attr['name'] = $sidebar_name;
            $sidebar_slug = strtolower(str_replace(' ','-',$sidebar_name));
            $sidebar_attr['id'] = 'sidebar-' . $sidebar_slug ;
            $sidebar_attr['before_widget'] = '<div id="%1$s" class="'.esc_attr($item_class).' widget %2$s kode-widget kode-widget-bg-footer">' ;
            $sidebar_attr['after_widget'] = '</div>' ;
            $sidebar_attr['show_in_rest'] = true;
            $sidebar_attr['show_instance_in_rest'] = true;
            $sidebar_attr['before_title'] = '<h3 class="widget-title">';
            $sidebar_attr['after_title'] = '</h3><div class="clear"></div>' ;
            $sidebar_attr['description'] = 'Please place '.esc_attr(strtolower($sidebar_name)).' widget here' ;
            register_sidebar($sidebar_attr);
        }

    }
    add_action('widgets_init','kode_sidebar_creation');
}
