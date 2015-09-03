/**
 * Created by Feonit on 13.07.15.
 */
define([
    'knockout', '_', 'translation', 'FolderViewModel', 'FileViewModel', 'CatalogModel'
], function(ko, _, translation, FolderViewModel, FileViewModel, CatalogModel){

    var CatalogViewModel = _.defineSubclass(CatalogModel,
        /**
         * A constructor for Catalog Tree view
         * @class CatalogViewModel
         * @constructs CatalogViewModel
         * @extends Model
         * @param {Object} options — Optional Object with extra parameters (see below)
         * */
        function CatalogViewModel(options){
            CatalogModel.apply(this, arguments);

            /**
             * Получить идентификатор владелеца каталога
             * @arg
             * @function
             * @return {number}
             * */
            this.userID = options.userID;

            /**
             * @param {Function} root folder
             * @public
             * */
            this.rootFolder = ko.observable();

            this.countOfAllFiles = ko.observable();

            API_VirtualFileSystem = this;

            this.isEnabledProcessTransfer = ko.observable(false);

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
             * Method for parse data and create the tree
             * @param {Object} response
             * @public
             * */
            parse : function(response){
                this.rootFolder( this._createRootFolder(response.data) );
                this.countOfAllFiles(response.count);
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

                options.userID = this.userID;

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
                return new FolderViewModel({
                    data: {
                        id: undefined,
                        title: translation.newFolder,
                        ownerName: 'me',
                        parent: this.rootFolder(),
                        deleted: false
                    }
                });
            },
            /**
             * Обработчик события пользовательского интерфейса на создание новой папки в каталоге
             * @public
             * */
            onClickCreateNewFolder: function(){
                var folder = this.getNewEmptyFolder();
                var that = this;

                var xhr = folder.createRequest();

                xhr.done(function(){
                    that.rootFolder().childrens.unshift(folder);
                    folder.openRenameForm();
                });
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

                folder.childrens.unshiftAll(folders);
                folder.files().models.unshiftAll(files);
            },
            /**
             * Method for create root folder
             * @param {Object} folderRootData
             * @private
             * */
            _createRootFolder : function(folderRootData){
                folderRootData.id = 0;
                folderRootData.title = 'Корневая директория';
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

                    data.parent = parentFolder;
                    data.parent_id = parentFolderData.id;

                    var childFolder = this.createFolder({
                        data : data
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
             * @this {FileViewModel} or {FolderViewModel}
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