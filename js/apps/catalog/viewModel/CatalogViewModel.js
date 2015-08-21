/**
 * Created by Feonit on 13.07.15.
 */
define(['knockout', '_', 'Model', 'FileViewModel', 'FolderViewModel'], function(ko, _, Model, FileViewModel, FolderViewModel){

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

    var CatalogViewModel = _.defineSubclass(Model,
        /**
         * A constructor for Directory Tree view
         * @class CatalogViewModel
         * @constructs CatalogViewModel
         * @extends Model
         * @param {Object} options — Optional Object with extra parameters (see below)
         * */
        function CatalogViewModel(options){
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

            /**
             * Получить идентификатор владелеца каталога
             * @arg
             * @function
             * @return {number}
             * */
            this.owner_id = ko.observable(options.owner_id);

            // поведение
            this.getSelectedTotalItemsLength = ko.pureComputed(function(){
                return this.getSelectedFolders().length + this.getSelectedFiles().length;
            }, this);

            // поведение
            this.getSelectedTotalItems = ko.pureComputed(function(){
                return (this.getSelectedFiles()).concat(this.getSelectedFolders())
            }, this);
        },
        /** @lends CatalogViewModel.prototype */
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
                var rootFolder = this._createRootFolder(directoryTreeData);

                this.rootFolder( rootFolder );
            },
            /**
             * Способ создания файла с предустановленным поведением
             * @param {object} options — Опции
             * @property {object} options.data — Данные для файла
             * @property {FolderModel} options.parent — Ссылка на родителя
             * @public
             * @return {FileViewModel} Созданный экземпляр файла
             * */
            createFile : function(options){
                if (!options || !options.data || !options.parent){
                    throw TypeError();
                }
                var file = new FileViewModel(options);

                file.isSelected.subscribe(this._behaviorOnSelectChange, file);

                return file;
            },
            /**
             * Способ создания папки с предустановленным поведением
             * @param {object} options — Опции
             * @property {object} options.data — Данные для папки
             * @public
             * @return {FolderViewModel} Созданный экземпляр папки
             * */
            createFolder: function(options){
                if (!options || !options.data){
                    throw TypeError();
                }

                var folder = new FolderViewModel(options);

                folder.isSelected.subscribe(this._behaviorOnSelectChange, folder);
                folder.isOpened.subscribe(this._behaviorOnOpenChange, folder);

                return folder;
            },
            /**
             * Способ создания новой папки с дефолтными аргументами
             * @public
             * @return {FolderViewModel} Созданный экземпляр папки
             * */
            getNewEmptyFolder: function(){
                var defaults = {
                    id: Math.round(Math.random()*10000000000), // random
                    title: 'Новая папка',
                    ownerName: 'me',
                    parent: this.rootFolder()
                };
                return new FolderViewModel({
                    data: defaults
                });
            },
            /**
             * Обработчик события пользовательского интерфейса на создание новой папки в каталоге
             * @public
             * */
            onClickCreateNewFolder: function(){
                var folder = this.getNewEmptyFolder();
                this.rootFolder().childrens.unshift(folder);
                folder.openRenameForm();
            },
            /**
             * Получение экземпляров всех выбранных файлов
             * @public
             * @return {Array} Список выбранных файлов
             * */
            getSelectedFiles : function(){
                var root = this.rootFolder(),
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
                var root = this.rootFolder(),
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

                        if ( children instanceof FolderViewModel){
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
             * @param {FolderViewModel} folder Папка назначения
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
            },
            /**
             * Method for create root folder
             * @param {Object} folderRootData
             * @private
             * */
            _createRootFolder : function(folderRootData){
                folderRootData.id = 1;
                folderRootData.title = 'Root';
                folderRootData.parent = null;

                var rootFolder = this.createFolder({
                    data : folderRootData
                });

                this._createFoldersReqursive(rootFolder, folderRootData);

                return rootFolder;
            },
            /**
             * Method for generate the folders of tree based on the received data
             * @param {FolderViewModel} parentFolder
             * @param {Object} parentFolderData
             * @private
             * @return {FolderViewModel}
             * */
            _createFoldersReqursive : function (parentFolder, parentFolderData){

                if (parentFolderData.childrens.length === 0) return parentFolder;

                var collectionChildrens = parentFolderData.childrens.map(function(data){

                    var childFolder = this.createFolder({
                        data : {
                            id : data.id,
                            title : data.title,
                            parent: parentFolder,
                            parent_id: parentFolderData.id
                        }
                    });

                    this._createFoldersReqursive(childFolder, data);

                    return childFolder;
                }, this);

                parentFolder.childrens(collectionChildrens);

                return parentFolder;
            },
            /**
             * Флаг контролирования процессов
             * @memberof FileSystem
             * @type Boolean
             */
            _inprocess : false,
            /**
             * Поведение для только что выбранного элемента
             * @memberof FileSystem
             * @this {FolderViewModel}
             * */
            _behaviorOnSelectChange : function(){
                if (this._inprocess) return;

                this._inprocess = true;

                this.parent().syncRecursivelyParentsFoldersChosen();

                // контроль дочерних элементов
                if (this instanceof FolderViewModel){
                    this.syncRecursivelyChildrensItemsChosen();
                }

                this._inprocess = false;
            },
            /**
             * Поведение для только что открытой папки
             * @memberof FileSystem
             * */
            _behaviorOnOpenChange : function(){
                if (this._inprocess) return;

                this._inprocess = true;

                // контроль дочерних элементов
                if (this instanceof FolderViewModel){
                    this.syncRecursivelyChildrensItemsChosen();
                }

                this._inprocess = false;
            }
        },
        /** @lends CatalogViewModel */
        {

        }
    );
    return CatalogViewModel;
});