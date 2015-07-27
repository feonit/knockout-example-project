/**
 * Created by Feonit on 13.07.15.
 */
define(['knockout'], function(ko){

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

    /**
     * @class DirectoryTree
     * */
    function DirectoryTreeModel(){
        var MAX_LEVEL_NESTING = 3;

        this.rootFolder = ko.observable();
    }

    /**
     * @public method
     * */
    DirectoryTreeModel.prototype.fetch = function(){
        this.parse(directoryTreeData);
    };

    /**
     * @public method
     * */
    DirectoryTreeModel.prototype.parse = function(directoryTreeData){
        // todo перенести в прослойку ajax отсюда
        //if (!response || !response.result || !response.result.data || !Array.isArray(response.result.data)) { return false; throw Error('not found data at response') }

        var rootFolder = DirectoryTreeModel._createRootFolder(directoryTreeData);

        this.rootFolder( rootFolder );
    };

    /**
     * @privat method
     * */
    DirectoryTreeModel._createRootFolder = function(folderRootData){
        folderRootData.id = 1;
        folderRootData.title = 'Root';
        folderRootData.parent = null;

        var rootFolder = API_VirtualFileSystem.createFolder({
            data : folderRootData
        });

        DirectoryTreeModel._createFoldersReqursive(rootFolder, folderRootData);

        return rootFolder;
    };

    /**
     * @privat method
     * */
    DirectoryTreeModel._createFoldersReqursive = function (parentFolder, parentFolderData){

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
    };

    return DirectoryTreeModel;
});