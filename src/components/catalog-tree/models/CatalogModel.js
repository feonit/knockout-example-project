define(['knockout', '_', 'Model', 'json!./../responses/foldersTree.json'], function(ko, _, Model, foldersTree){

    var directoryTreeData = foldersTree;

    var CatalogModel = _.defineSubclass(Model, function(){

        Model.apply(this, arguments);

        this.loading = ko.observable(true);

    }, {

        /**
         * Method for load data
         * @public
         * */
        readRequest : function(){
            this.parse(directoryTreeData);
        },

        /**
         * save changes
         * */
        updateRequest: function(folder, callback){
            var data = API_VirtualFileSystem.getDataOfMovingItems();

            data = {
                move: {
                    files_id: data.files,
                    folders_id: data.folders
                },
                to: folder.id()
            };

            fetch('some_url_for_save_change', {
                method: 'post',
                body: data
            }).then( function(){ console.log('Request succeeded with JSON response', data);
                callback();
            }).catch( function(error) { console.log('Request failed', error);
                callback();
            });
        }

    });

    return CatalogModel;

});