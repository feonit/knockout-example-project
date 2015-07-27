/**
 * Created by Feonit on 13.07.15.
 */
define(['knockout', 'DirectoryTreeModel', 'FolderTreeViewModel', 'FileTreeViewModel'], function(ko, DirectoryTreeModel, FolderTreeViewModel, FileTreeViewModel){

    /**
     * {VirtualFileSystem} class
     * Файловая система связывает носитель информации с одной стороны и API для доступа к файлам — с другой
     * Работа над множеством состоящем из файлов и папок
     * */
    function VirtualFileSystemModel(options){
        options = options || {};

        this.MAX_SIZE_OF_FILE_NAMES = 255;
        this.directoryTreeModel = ko.observable(new DirectoryTreeModel());
        this.owner_id = ko.observable(options.id);

        API_VirtualFileSystem = this;

        this.getSelectedTotalItemsLength = ko.computed(function(){
            return this.getSelectedFolders().length + this.getSelectedFiles().length;
        }, this);

        this.getSelectedTotalItems = ko.computed(function(){
            return (this.getSelectedFiles()).concat(this.getSelectedFolders())
        }, this);
    }

    VirtualFileSystemModel.prototype = {
        constructor: VirtualFileSystemModel,

        createFile : function(options){
            if (!options || !options.data || !options.parent){
                throw TypeError();
            }
            var file = new FileTreeViewModel(options);

            file.isSelected.subscribe(VirtualFileSystemModel._behaviorOnSelectChange, file);

            return file;
        },

        createFolder: function(options){
            if (!options || !options.data){
                throw TypeError();
            }

            var folder = new FolderTreeViewModel(options);

            folder.isSelected.subscribe(VirtualFileSystemModel._behaviorOnSelectChange, folder);
            folder.isOpened.subscribe(VirtualFileSystemModel._behaviorOnOpenChange, folder);

            return folder;
        },

        getNewEmptyFolder: function(){
            return new FolderTreeViewModel({
                data: {
                    id: Math.round(Math.random()*10000000000), // random
                    title: 'Новая папка', // todo translation
                    ownerName: 'me', // todo
                    parent: this.directoryTreeModel().rootFolder()
                }

            });
        },

        onClickCreateNewFolder: function(){
            var folder = this.getNewEmptyFolder();

            this.directoryTreeModel().rootFolder().childrens.unshift(folder);

            folder.openRenameForm();
        },

        getSelectedFiles : function(){
            var root = this.directoryTreeModel().rootFolder(),
                selected = [],
                isSelected,
                containsInFolder;

            if (!root) return selected;

            function filter(files){
                ko.utils.arrayForEach(files.models(), function (file){

                    isSelected = file.isSelected();
                    containsInFolder = file.containsInSelectedFolder();

                    if (isSelected && !containsInFolder){
                        selected.push(file);
                    }
                });
            }

            function reqursiveFolder(folder){
                filter(folder.files());

                ko.utils.arrayForEach(folder.childrens(), function(children){
                    reqursiveFolder(children);
                });
            }

            reqursiveFolder(root);


            return selected;
        },

        getSelectedFolders : function(){
            var root = this.directoryTreeModel().rootFolder(),
                selected = [],
                isSelected,
                containsInFolder;

            if (!root) return selected;

            function requirsive(childrens){
                ko.utils.arrayForEach(childrens, function (children){

                    isSelected = children.isSelected();
                    containsInFolder = children.containsInSelectedFolder();

                    if (isSelected && !containsInFolder){
                        selected.push(children);
                    }

                    if ( children instanceof FolderTreeViewModel){
                        requirsive(children.childrens())
                    }
                });
            }

            requirsive(root.childrens());

            return selected;
        },

        getDataOfMovingItems : function(){
            var files_ids = (this.getSelectedFiles()).map(function(item){
                return item.id();
            }, this);

            var folder_ids = (this.getSelectedFolders()).map(function(item){
                return item.id();
            }, this);

            return {
                files: files_ids,
                folders: folder_ids
            };
        },

        setIsMovedAllSelectedItemsState : function(boolean){
            /** method */

            ko.utils.arrayForEach(this.getSelectedTotalItems(), function(composite){ // and others
                composite.isMoved(boolean);
            }, this);
        },

        unselectAll: function(){
            this.getSelectedTotalItems().forEach(function(item){
                item.isSelected(false);
            }, this);
        },

        setIsMovingAllSelectedItemsState : function(boolean){
            /** method */

            ko.utils.arrayForEach(this.getSelectedTotalItems(), function(item){
                item.isMoving(boolean);
            }, this);

        },

        moveSelectedToFolder : function(folder){
            /**
             * @this {VirtualFileSystemModel}
             * @param {FolderTreeViewModel} folder
             * */
            var folders = this.getSelectedFolders();
            var files = this.getSelectedFiles();

            folders.forEach(function(item){
                item.parent().childrens.remove(item);
                item.parent(folder);
            });

            files.forEach(function(item){
                item.parent().files().models.remove(item);
                item.parent(folder);
            });

            folder.childrens.pushAll(folders);
            folder.files().models.pushAll(files);
        },

        //getFileIcon = function(){};
    };

    VirtualFileSystemModel._inprocess = false;

    /**
     * @this {FileTreeViewModel} or {FolderTreeViewModel}
     * */
    VirtualFileSystemModel._behaviorOnSelectChange = function(){
        if (VirtualFileSystemModel._inprocess) return;

        VirtualFileSystemModel._inprocess = true;

        this.parent().syncRecursivelyParentsFoldersChosen();

        // контроль дочерних элементов
        if (this instanceof FolderTreeViewModel){
            this.syncRecursivelyChildrensItemsChosen();
        }

        VirtualFileSystemModel._inprocess = false;
    };

    VirtualFileSystemModel._behaviorOnOpenChange = function(){
        if (VirtualFileSystemModel._inprocess) return;

        VirtualFileSystemModel._inprocess = true;

        // контроль дочерних элементов
        if (this instanceof FolderTreeViewModel){
            this.syncRecursivelyChildrensItemsChosen();
        }

        VirtualFileSystemModel._inprocess = false;
    };

    return VirtualFileSystemModel;
});