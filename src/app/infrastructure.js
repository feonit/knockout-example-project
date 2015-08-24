/**
 * @module infrastructure
 * @requires jquery @see
 * @requires knockout @see
 * @requires knockout.mapping
 * */
define(['jquery','knockout','knockout.mapping', 'text', 'mustache'], function(jquery, knockout, mapping) {

	/** @global */
	var $ = window.$ = jquery;
	/** @global */
	var ko = window.ko = knockout;

	ko.mapping = mapping;

});