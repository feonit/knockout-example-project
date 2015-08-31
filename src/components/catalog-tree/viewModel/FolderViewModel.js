/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FilesCollection', 'ItemCatalogViewModel', 'FolderModel'], function(
    _, ko, DragAndDropModel, FilesCollection, ItemCatalogViewModel, FolderModel){

    "use strict";

    var FolderViewModel = _.defineSubclass(FolderModel,

        /**
         * A class for view of folder at tree
         * @class FolderViewModel
         * @constructs FolderViewModel
         * @param {Object} options — Optional Object with extra parameters (see below)
         * @extends FolderModel
         * @extends DragAndDropModel
         * @extends ItemCatalogViewModel
         * */
        function FolderViewModel(options){

            FolderModel.call(this, options.data);
            DragAndDropModel.apply(this);
            ItemCatalogViewModel.apply(this);

            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.isOpened = ko.observable(false);
            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.renamed = ko.observable(false);
            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.isEmpty = ko.computed(function(){
                return !this.getTotalItemsCount()
            }, this);

            this.isSelected.subscribe(function(boolean){

                function reqursive(folder){
                    folder.files().models().forEach(function(item){
                        item.containsInSelectedFolder(boolean);
                    }, this);

                    folder.childrens().forEach(function(item){
                        item.containsInSelectedFolder(boolean);
                        reqursive(item);
                    }, this);
                }

                reqursive(this)

            }, this);
            /**
             * @public
             * @param {Function}
             * @return {?FolderViewModel}
             * */
            this.parent = ko.observable(options.data.parent);
            /**
             * @public
             * @param {Number}
             * */
            this.nestingLevel = ko.computed(function(){
                var level = 1;

                function reqursive(folder){
                    var parent = folder.parent();

                    if (parent !== null){
                        level += 1;
                        reqursive(parent);
                    }
                }

                reqursive(this);

                return level;

            }, this);
            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.isRoot = ko.observable(this.nestingLevel() === 1);

            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.isEditing = ko.observable(false);

            /**
             * @public
             * @param {Function}
             * @return {String}
             * */
            this.newTitle = ko.observable('');

            if (!this.isRoot()){
                /** that param from {DragAndDrop} */
                this.isSelected(this.parent().isSelected());
            }
        },

        /** @lends FolderViewModel.prototype */
        {
            /**
             * Редактировать название
             * @public
             * */
            onClickEditTitle: function(model, event){
                event.stopPropagation();
                this.isEditing(true);
            },
            /**
             * Отменить редактирование имени
             * @public
             * */
            onClickResetTitle : function(model, event){
                event.stopPropagation();
                this._resetForm();
            },
            /**
             * Сохранить новое имя
             * @public
             * */
            onClickSaveTitle : function(model, event){
                event.stopPropagation();
                this._confirmForm();
            },
            /**
             * Обработчик клавиши Enter
             * @public
             * */
            onEnterKeyDown: function(model, event){
                event.stopPropagation();
                this._confirmForm();
            },
            /**
             * Обработчик клавиши Esc
             * @public
             * */
            onEscKey: function(model, event){
                event.stopPropagation();
                this._resetForm();
            },
            /**
             * @private
             * */
            _confirmForm: function(){
                this._saveTitle();
                this._resetForm();
            },
            /**
             * @private
             * */
            _saveTitle: function(){
                var newTitle = this.newTitle();

                if(newTitle !== ''){
                    this.title(newTitle);
                }
            },
            /**
             * @private
             * */
            _resetForm : function(){
                this.newTitle('');
                this.isEditing(false);
            },
            /**
             * Opens or closes the folder
             * @this FolderViewModel
             * @param {object} model
             * @param {event} event
             * */
            toggleIsOpenedState : function(model, event){
                var switched = !this.isOpened();
                switched ? this.open() : this.close();
                event.stopPropagation();
            },
            /**
             * Gets the number of elements in the tree
             * @this FolderViewModel
             * */
            getTotalItemsCount: function(){
                return this.childrens().length + this.files().models().length;
            },

            /**
             * Gets the number of the selected elements in the tree
             * @this FolderViewModel
             * */
            getSelectedItemsCount: function(){
                var count = 0;
                ko.utils.arrayForEach(this.childrens(), function(children){
                    children.isSelected() && count++;
                }, this);

                ko.utils.arrayForEach(this.files().models(), function(file){
                    file.isSelected() && count++;
                }, this);
                return count;
            },
            /**
             * Include all elements of the state as the selected
             * @this FolderViewModel
             * @public
             * */
            selectAll: function(){
                this._setSelectedState(true);
            },
            /**
             * Disable all selected elements
             * @this FolderViewModel
             * @public
             * */
            unselectAll: function(){
                this._setSelectedState(false);
            },
            /**
             * Enable or disable the selection status of all child elements, depending on the state of the current folder
             * @this FolderViewModel
             * @public
             * */
            syncRecursivelyChildrensItemsChosen: function(){
                this.isSelected() ? this.selectAll() : this.unselectAll();
            },
            /**
             *
             * @this FolderViewModel
             * @public
             * */
            syncRecursivelyParentsFoldersChosen: function(){
                var folder = this;

                var controlParentFolder = function(folder){
                    // контроль родительской папки
                    var totalItems = folder.getTotalItemsCount(),
                        selectedItems = folder.getSelectedItemsCount();
                    /**  property of the class {DragAndDropModel} */
                    folder.isSelected(totalItems === selectedItems);

                    // рекурсивно остальных родителей
                    if (folder.parent()){
                        controlParentFolder(folder.parent());
                    }
                };

                // начать рекурсию
                controlParentFolder(folder);
            },
            /**
             * Sets the state selected
             * @this FolderViewModel
             * @param {boolean} boolean - is selected or no
             * @private
             * */
            _setSelectedState: function(boolean){
                ko.utils.arrayForEach(this.childrens(), function(children){
                    children.isSelected(boolean);
                    children._setSelectedState(boolean); // рекурсивно
                }, this);

                ko.utils.arrayForEach(this.files().models(), function(file){
                    file.isSelected(boolean);
                }, this);
            },
            /**
             * Loads the data and opens the folder
             * @this FolderViewModel
             * @param {object} options - options.callback
             * @public
             * */
            open : function(options){
                options = options || {};

                if(!this.files() || !this.files().isFetched()){
                    this.files().readRequest({
                        callback: (function(){
                            this.isOpened(true);
                            options.callback && options.callback();
                        }).bind(this)
                    });
                } else {
                    this.isOpened(true);
                    options.callback && options.callback();
                }
            },
            /**
             * Close the folder
             * @this FolderViewModel
             * @public
             * */
            close : function(){
                this.isOpened(false);
            }
        }
    );

    _.mix(FolderViewModel.prototype, ItemCatalogViewModel.prototype);
    _.mix(FolderViewModel.prototype, DragAndDropModel.prototype);

    return FolderViewModel;
});