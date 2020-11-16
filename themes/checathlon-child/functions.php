<?php
/**
 * Checathlon child theme functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Checathlon
 */


/*
 * Dequeue parent scripts, use wp_print_scripts instead of dequeue as that didn't work
 */

function dequeue_checathlon_scripts() {
	wp_dequeue_script('checathlon-scripts');
	wp_deregister_script('checathlon-scripts');
	wp_dequeue_style('checathlon-scripts');
}

add_action( 'wp_print_scripts', 'dequeue_checathlon_scripts', 100);


/*
 * Enqueue chlid theme styles and scripts
 */

function enqueue_checathlon_child(){
	  //wp_enqueue_style('checathlon-css', '/wp-content/themes/checathlon/style.css' );
	  //wp_enqueue_style('checathlon-child-css', '/wp-content/themes/checathlon-child/style.css');
	  wp_enqueue_script('checathlon-child', '/wp-content/themes/checathlon-child/js/scripts.js', array( ), '1.0', true );
	  wp_enqueue_script('checathlon-child-submenus', '/wp-content/themes/checathlon-child/js/submenus.js', array( ), '1.0', true );
}

add_action( 'wp_enqueue_scripts', 'enqueue_checathlon_child', 100);



 /*
 * Add Version Number to Child Theme assets to Prevent Browser Cache
 * https://wpexplorer-themes.com/total/snippets/child-theme-style-version/ 
 */

 function enqueue_parent_styles() {
	wp_enqueue_style( 'parent-style', get_template_directory_uri().'/style.css' );
 }

 add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );


?>
