define([
    'knockout',
    '_',
    'translation',
    'Model',
    'text!catalog-tree.html',
    'json!./../../../responses/foldersTree.json',
    'enterKey',
    'escKey'
], function(
    ko,
    _,
    translation,
    Model,
    template,
    foldersTree
){

    var component = _.defineSubclass(Model, function CatalogTreeComponent(){

        /**
         * @param {Function} root folder
         * @public
         * */
        this.rootFolder = ko.observable();

        API_VirtualFileSystem = this;

        this.rootFolderData = ko.observable();

        this.afterRender();
    } ,
        /** @lends CatalogTreeComponent.prototype */
    {
        getSelectedTotalItemsLength: function(){
            return this.getSelectedFolders().length + this.getSelectedFiles().length;
        },

        getSelectedTotalItems: function(){
            return (this.getSelectedFiles()).concat(this.getSelectedFolders());
        },

        /**
         * Method for parse data and create the tree
         * @param {Object} response
         * @public
         * */
        parse : function(response){

            this.rootFolderData(response.rootFolder);

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
                that.rootFolder().folders.unshift(folder);
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
                ko.utils.arrayForEach(files(), function (file){

                    isSelected = file.isSelected();

                    if (isSelected && !containsInFolder){
                        selected.push(file);
                    }
                });
            }

            function reqursiveFolder(folder){
                filter(folder.files());

                ko.utils.arrayForEach(folder.folders(), function(children){
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

            function requirsive(folders){
                ko.utils.arrayForEach(folders, function (folder){

                    isSelected = folder.isSelected();

                    if (isSelected && !containsInFolder){
                        selected.push(folder);
                    }

                    if ( folder instanceof FolderViewModel){
                        requirsive(folder.folders())
                    }
                });
            }

            requirsive(root.folders());

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
                item.parent().folders.remove(item);
                item.parent(folder);
            });

            files.forEach(function(item){
                item.parent().files.remove(item);
                item.parent(folder);
            });

            folder.folders.unshiftAll(folders);
            folder.files.unshiftAll(files);
        },
        /**
         * Method for load data
         * @public
         * */
        readRequest : function(){
            this.parse(foldersTree);
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
        },

        afterRender: function(){
            this.readRequest();
            //this.rootFolder().open();
        }
    });

    return { viewModel: component, template: template }
});