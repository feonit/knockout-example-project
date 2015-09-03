/**
 * @module infrastructure
 * @requires knockout @see
 * @requires knockout.mapping
 * */
define(['knockout','knockout.mapping', 'text', 'mustache', 'json'], function(knockout, mapping) {

	/** @global */
	var ko = window.ko = knockout;

	ko.mapping = mapping;

	define('translation', {
		newFolder : 'Новая папка'
	});

});