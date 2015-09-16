/**
 * Created by Feonit on 14.07.15.
 */
define(['knockout', 'json!./../responses/folderFiles.json'], function(ko, filesData){

    function FileCollcetions(options){
        options = options || {};

        this.models = ko.observableArray([]);
        this.isFetched = ko.observable(false);
        this.isFetching = ko.observable(false);
        this.parent = ko.observable(options.parent);

    }

    FileCollcetions.prototype = {
        constructor: FileCollcetions,

        readRequest : function(options){

            options = options || {};

            this.isFetching(true);

            setTimeout((function(){
                this.parse(filesData);
                this.isFetched(true);
                this.isFetching(false);

                options.callback && options.callback();

            }).bind(this), 200);
        },

        parse : function(filesData){
            var files = filesData.data.map(function(fileData){

                return ROOT.catalogViewModel().createFile({
                    data : fileData,
                    parent: this.parent()
                });

            }, this);

            this.models(files);
        }
    };

    return FileCollcetions;
});