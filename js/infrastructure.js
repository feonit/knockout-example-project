/**
 * @module infrastructure
 * @requires jquery @see
 * @requires knockout @see
 * @requires knockout.mapping
 * */
define([
	'jquery',
	'knockout',
	'knockout.mapping'
], function(jquery, knockout, mapping) {

	(function(){

		/** @global */
		var $ = this.$ = jquery;
		/** @global */
		var ko = this.ko = knockout;

		ko.mapping = mapping;

		jquery.event.props.push('dataTransfer');
		jquery.event.props.push('pageX');
		jquery.event.props.push('pageY');

	}).call(window);
});