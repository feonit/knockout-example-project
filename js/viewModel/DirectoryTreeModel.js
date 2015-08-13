/**
 * Created by Feonit on 13.07.15.
 */
define(['knockout', '_', 'Model'], function(ko, _, Model){

    var directoryTreeData = {
        id: 1,
        title: 'Root',
        childrens: [
            {
                id: Math.round(Math.random()*100000),
                title: 'Folder 1',
                parent: Math.round(Math.random()*100000),
                childrens: []
            },
            {
                id: Math.round(Math.random()*100000),
                title: 'Folder 2',
                childrens: [
                    {
                        id: Math.round(Math.random()*100000),
                        parent: Math.round(Math.random()*100000),
                        title: 'My Job',
                        childrens: []
                    }
                ]
            },
            {
                id: Math.round(Math.random()*100000),
                title: 'Folder 3',
                childrens: [
                    {
                        id: Math.round(Math.random()*100000),
                        title: 'Folder 4',
                        parent: Math.round(Math.random()*100000),
                        childrens: [
                            {
                                id: Math.round(Math.random()*100000),
                                title: 'Folder 5',
                                parent: Math.round(Math.random()*100000),
                                childrens: []
                            }
                        ]
                    }
                ]
            }
        ],
        parent: null
    };

    var DirectoryTreeModel = _.defineSubclass(Model,
        /**
         * A constructor for Directory Tree view
         * @class DirectoryTreeModel
         * @constructs DirectoryTreeModel
         * @extends Model
         * */
        function DirectoryTreeModel(){
            /**
             * @const
             * @private
             * */
            var MAX_LEVEL_NESTING = 3;

            /**
             * @param {Function} root folder
             * @public
             * */
            this.rootFolder = ko.observable();
        },
        /** @lends DirectoryTreeModel.prototype */
        {
            /**
             * Method for load data
             * @public
             * */
            readRequest : function(){
                this.parse(directoryTreeData);
            },
            /**
             * Method for parse data and create the tree
             * @param {Object} directoryTreeData
             * @public
             * */
            parse : function(directoryTreeData){
                var rootFolder = DirectoryTreeModel._createRootFolder(directoryTreeData);

                this.rootFolder( rootFolder );
            }
        },
        /** @lends DirectoryTreeModel */
        {
            /**
             * Method for create root folder
             * @param {Object} folderRootData
             * @private
             * */
            _createRootFolder : function(folderRootData){
                folderRootData.id = 1;
                folderRootData.title = 'Root';
                folderRootData.parent = null;

                var rootFolder = API_VirtualFileSystem.createFolder({
                    data : folderRootData
                });

                DirectoryTreeModel._createFoldersReqursive(rootFolder, folderRootData);

                return rootFolder;
            },
            /**
             * Method for generate the folders of tree based on the received data
             * @param {FolderTreeViewModel} parentFolder
             * @param {Object} parentFolderData
             * @private
             * @return {FolderTreeViewModel}
             * */
            _createFoldersReqursive : function (parentFolder, parentFolderData){

                if (parentFolderData.childrens.length === 0) return parentFolder;

                var collectionChildrens = parentFolderData.childrens.map(function(data){

                    var childFolder = API_VirtualFileSystem.createFolder({
                        data : {
                            id : data.id,
                            title : data.title,
                            parent: parentFolder,
                            parent_id: parentFolderData.id
                        }
                    });

                    DirectoryTreeModel._createFoldersReqursive(childFolder, data);

                    return childFolder;
                }, this);

                parentFolder.childrens(collectionChildrens);

                return parentFolder;
            }
        }
    );
    return DirectoryTreeModel;
});