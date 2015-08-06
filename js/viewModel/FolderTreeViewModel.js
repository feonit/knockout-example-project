/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FilesCollection', 'ItemCatalogViewModel', 'FolderModel'], function(
    _, ko, DragAndDropModel, FilesCollection, ItemCatalogViewModel, FolderModel){

    "use strict";

    var FolderTreeViewModel = _.defineSubclass(FolderModel,

        /**
         * A class for view of folder at tree
         * @constructs FolderTreeViewModel
         * @param {Object} options
         * @extends FolderModel
         * @extends DragAndDropModel
         * @extends ItemCatalogViewModel
         * */
        function FolderTreeViewModel(options){

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
             * @return {FolderTreeViewModel}
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

            if (!this.isRoot()){
                /** that param from {DragAndDrop} */
                this.isSelected(this.parent().isSelected());
            }
        },

        /** @lends FolderTreeViewModel.prototype */
        {
            /**
             * Opens or closes the folder
             * @this FolderTreeViewModel
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
             * @this FolderTreeViewModel
             * */
            getTotalItemsCount: function(){
                return this.childrens().length + this.files().models().length;
            },

            /**
             * Gets the number of the selected elements in the tree
             * @this FolderTreeViewModel
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
             * @this FolderTreeViewModel
             * @public
             * */
            selectAll: function(){
                this._setSelectedState(true);
            },

            /**
             * Disable all selected elements
             * @this FolderTreeViewModel
             * @public
             * */
            unselectAll: function(){
                this._setSelectedState(false);
            },

            /**
             * Enable or disable the selection status of all child elements, depending on the state of the current folder
             * @this FolderTreeViewModel
             * @public
             * */
            syncRecursivelyChildrensItemsChosen: function(){
                this.isSelected() ? this.selectAll() : this.unselectAll();
            },

            /**
             *
             * @this FolderTreeViewModel
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
             * @this FolderTreeViewModel
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
             * @this FolderTreeViewModel
             * @param {object} options - options.callback
             * @public
             * */
            open : function(options){
                options = options || {};

                if(!this.files() || !this.files().isFetched()){
                    this.files().fetch({
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
             * @this FolderTreeViewModel
             * @public
             * */
            close : function(){
                this.isOpened(false);
            }
        }
    );

    _.mix(FolderTreeViewModel.prototype, ItemCatalogViewModel.prototype);
    _.mix(FolderTreeViewModel.prototype, DragAndDropModel.prototype);

    return FolderTreeViewModel;
});