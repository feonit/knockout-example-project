define(['_', 'knockout', 'Model', 'FilesCollection'], function(_, ko, Model, FilesCollection){

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
            this.isEmpty = ko.observable();
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
            createRequest : function () {
                var xhr = new XMLHttpRequest();

                setTimeout(function(){
                    // xhr.done(); todo
                }, 200);
                return xhr;
            },

            update : function () {

            },

            delete: function(){

            }
        }
    );
});