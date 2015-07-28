/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FilesCollection', 'ItemCatalogViewModel', 'FolderModel'], function(
    _, ko, DragAndDropModel, FilesCollection, ItemCatalogViewModel, FolderModel){



    /**
     * @constructor FileTreeViewModel
     * @extends FolderModel
     * @mixes DragAndDropModel
     * @mixes ItemCatalogViewModel
     * */
    var FolderTreeViewModel = _.defineSubclass(FolderModel, function FolderTreeViewModel(options){

            FolderModel.call(this, options.data);
            DragAndDropModel.apply(this);
            ItemCatalogViewModel.apply(this);

            this.isOpened = ko.observable(false);
            this.renamed = ko.observable(false);
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
            this.parent = ko.observable(options.data.parent);
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
            this.isRoot = ko.observable(this.nestingLevel() === 1);

            if (!this.isRoot()){
                /** that param from {DragAndDrop} */
                this.isSelected(this.parent().isSelected());
            }
        },

        // Instance methods: copied to prototype

        {
            toggleIsOpenedState : function(model, event){
                var switched = !this.isOpened();
                switched ? this.open() : this.close();
                event.stopPropagation();
            },

            getTotalItemsCount: function(){
                return this.childrens().length + this.files().models().length;
            },

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

            selectAll: function(){
                this._setSelectedState(true);
            },

            unselectAll: function(){
                this._setSelectedState(false);
            },

            syncRecursivelyChildrensItemsChosen: function(){
                this.isSelected() ? this.selectAll() : this.unselectAll();
            },

            /**
             * @this {FolderDnDModel}
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

            _setSelectedState: function(boolean){
                ko.utils.arrayForEach(this.childrens(), function(children){
                    children.isSelected(boolean);
                    children._setSelectedState(boolean); // рекурсивно
                }, this);

                ko.utils.arrayForEach(this.files().models(), function(file){
                    file.isSelected(boolean);
                }, this);
            },

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

            close : function(){
                this.isOpened(false);
            }
        }
    );

    _.mix(FolderTreeViewModel.prototype, ItemCatalogViewModel.prototype);
    _.mix(FolderTreeViewModel.prototype, DragAndDropModel.prototype);

    return FolderTreeViewModel;
});