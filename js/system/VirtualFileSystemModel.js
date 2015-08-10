/**
 * Created by Feonit on 13.07.15.
 */
define(['knockout', 'DirectoryTreeModel', 'FolderTreeViewModel', 'FileTreeViewModel'], function(ko, DirectoryTreeModel, FolderTreeViewModel, FileTreeViewModel){

    /**
     * Файловая система связывает носитель информации с одной стороны и API для доступа к файлам — с другой
     * Работа над множеством состоящем из файлов и папок
     * @class VirtualFileSystem
     * @constructs VirtualFileSystem
     * @param {Object} options — Optional Object with extra parameters (see below)
     * */
    function VirtualFileSystemModel(options){
        options = options || {};

        /**
         * Получить экземпляр каталога
         * @function
         * @return {DirectoryTreeModel}
         * */
        this.directoryTreeModel = ko.observable(new DirectoryTreeModel());
        /**
         * Получить идентификатор владелеца каталога
         * @arg
         * @function
         * @return {number}
         * */
        this.owner_id = ko.observable(options.id);

        /**
         * Глобальный доступ к файловой системе
         * @global
         * */
        API_VirtualFileSystem = this;

        // поведение
        this.getSelectedTotalItemsLength = ko.computed(function(){
            return this.getSelectedFolders().length + this.getSelectedFiles().length;
        }, this);

        // поведение
        this.getSelectedTotalItems = ko.computed(function(){
            return (this.getSelectedFiles()).concat(this.getSelectedFolders())
        }, this);
    }

    VirtualFileSystemModel.prototype = {
        /** @lends VirtualFileSystemModel.prototype */

        constructor: VirtualFileSystemModel,

        /**
         * Способ создания файла с предустановленным поведением
         * @param {object} options — Опции
         * @property {object} options.data — Данные для файла
         * @property {FolderModel} options.parent — Ссылка на родителя
         * @public
         * @return {FileTreeViewModel} Созданный экземпляр файла
         * */
        createFile : function(options){
            if (!options || !options.data || !options.parent){
                throw TypeError();
            }
            var file = new FileTreeViewModel(options);

            file.isSelected.subscribe(VirtualFileSystemModel._behaviorOnSelectChange, file);

            return file;
        },
        /**
         * Способ создания папки с предустановленным поведением
         * @param {object} options — Опции
         * @property {object} options.data — Данные для папки
         * @public
         * @return {FolderTreeViewModel} Созданный экземпляр файла
         * */
        createFolder: function(options){
            if (!options || !options.data){
                throw TypeError();
            }

            var folder = new FolderTreeViewModel(options);

            folder.isSelected.subscribe(VirtualFileSystemModel._behaviorOnSelectChange, folder);
            folder.isOpened.subscribe(VirtualFileSystemModel._behaviorOnOpenChange, folder);

            return folder;
        },
        /**
         * Способ создания новой папки с дефолтными аргументами
         * @public
         * @return {FolderTreeViewModel} Созданный экземпляр файла
         * */
        getNewEmptyFolder: function(){
            var defaults = {
                id: Math.round(Math.random()*10000000000), // random
                title: 'Новая папка',
                ownerName: 'me',
                parent: this.directoryTreeModel().rootFolder()
            };
            return new FolderTreeViewModel({
                data: defaults
            });
        },
        /**
         * Обработчик события пользовательского интерфейса на создание новой папки в каталоге
         * @public
         * */
        onClickCreateNewFolder: function(){
            var folder = this.getNewEmptyFolder();
            this.directoryTreeModel().rootFolder().childrens.unshift(folder);
            folder.openRenameForm();
        },
        /**
         * Получение экземпляров всех выбранных файлов
         * @public
         * @return {Array} Список выбранных файлов
         * */
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
        /**
         * Получение экземпляров всех выбранных папок
         * @public
         * @return {Array} Список выбранных папок
         * */
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
        /**
         * Получение перечьня из двух списков идентификаторов выбранных файлов и папок
         * @public
         * @returns {{files: {FileModel[]}, folders: {FolderModel[]}}}
         * */
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
        /**
         * Установка значения свойства isMoved для всех выбранных элементов каталога
         * @public
         * */
        setIsMovedAllSelectedItemsState : function(boolean){
            ko.utils.arrayForEach(this.getSelectedTotalItems(), function(composite){ // and others
                composite.isMoved(boolean);
            }, this);
        },
        /**
         * Сброс активности для всех элементов каталога
         * @public
         * */
        unselectAll: function(){
            this.getSelectedTotalItems().forEach(function(item){
                item.isSelected(false);
            }, this);
        },
        /**
         * Установка значения свойства isMoving для всех выбранных элементов каталога
         * @public
         * */
        setIsMovingAllSelectedItemsState : function(boolean){
            ko.utils.arrayForEach(this.getSelectedTotalItems(), function(item){
                item.isMoving(boolean);
            }, this);
        },
        /**
         * Способ перемещения всех выбранных элементов в папку
         * @this {VirtualFileSystemModel}
         * @param {FolderTreeViewModel} folder Папка назначения
         * */
        moveSelectedToFolder : function(folder){
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
        }
    };

    /**
     * Флаг контролирования процессов
     * @memberof VirtualFileSystemModel
     * @type Boolean
     */
    VirtualFileSystemModel._inprocess = false;

    /**
     * Поведение для только что выбранного элемента
     * @memberof VirtualFileSystemModel
     * @this {FileTreeViewModel|FolderTreeViewModel}
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
    /**
     * Поведение для только что открытой папки
     * @memberof VirtualFileSystemModel
     * */
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