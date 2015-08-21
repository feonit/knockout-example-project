define(['_', 'Model', 'FilesCollection'], function(_, Model, FilesCollection){

    "use strict";

    return _.defineSubclass(Model,
        /**
         * Represents a folder
         * @class FolderModel
         * @constructor FolderModel
         * @extends Model
         * * */
        function FolderModel(attributes){

            this.id = ko.observable();
            this.ownerName = ko.observable();
            this.title = ko.observable();
            this.secureLevel = ko.observable('PUBLIC');
            this.deleted = ko.observable();

            this.parent_id = ko.observable();
            this.files = ko.observable(new FilesCollection({ parent : this }));
            this.childrens = ko.observableArray([]);

            Model.apply(this, arguments);
        } ,
        /** @lends FileModel.prototype */
        {
            read : function () {

            },

            update : function () {

            },

            delete: function(){

            }
        }
    );
});