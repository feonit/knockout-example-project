define(['_', 'Model', 'knockout'], function(_, Model, ko){

	"use strict";

	/**
	 * @constructor FileModel
	 * */
	return _.defineSubclass(Model, function FileModel( data ) {

		this.id = ko.observable();
		this.ownerName = ko.observable();
		this.title = ko.observable();
		this.type = ko.observable();

		Model.apply(this, arguments); // after defined attributes

	});
});