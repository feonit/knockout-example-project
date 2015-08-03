define(['_', 'Model', 'knockout'], function(_, Model, ko){

	"use strict";

	var FileModel = _.defineSubclass(Model,
		/**
		 * Represents a file
		 * @constructor FileModel
		 * @extends Model
		 * @param {object} attributes - The data of the file
		 * */
		function FileModel( attributes ) {
			this.id = ko.observable();
			this.ownerName = ko.observable();
			this.title = ko.observable();
			this.type = ko.observable();
			Model.apply(this, arguments);
		} ,
		/** @lends FileModel.prototype */
		{
			someMethod: function(){}
		}
	);

	return FileModel;
});