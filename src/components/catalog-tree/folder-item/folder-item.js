define([
    '_',
    'knockout',
    'ItemModel',
    'text!components/catalog-tree/folder-item/folder-item.html'
], function(
    _,
    ko,
    ItemModel,
    template
){

    "use strict";

    return { viewModel: _.defineSubclass(ItemModel,

        /**
         * A class for view of folder at tree
         * @class FolderItemModel
         * @constructs FolderItemModel
         * @extends ItemModel
         * */
        function FolderItemModel(attributes){

            this.id = ko.observable();
            this.isEmpty = ko.observable();
            this.ownerName = ko.observable();
            this.title = ko.observable();
            this.secureLevel = ko.observable('PUBLIC');
            this.deleted = ko.observable();
            this.parent = ko.observable();

            this.files = ko.observableArray([]);
            this.folders = ko.observableArray([]);

            this.filesData = ko.observable(attributes.files);
            this.foldersData = ko.observable(attributes.folders);

            ItemModel.apply(this);

            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.isOpened = ko.observable(false);
            /**
             * Папка готова принять элемент
             * */
            this.isTaking = ko.observable(false);
            /**
             * Папка приняла элемент
             * */
            this.isTaken = ko.observable(false);


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

            ko.mapping.fromJS(attributes, {}, this);

            /**
             * @public
             * @param {Function}
             * @return {Boolean}
             * */
            this.isRoot = ko.observable(this.parent() === null);

            /**
             * Специальное поведение
             * если папка выбрана, она не может уже быть приемником, это поведение постоянно (задача - исключить выбранные папки и все дочерние из возможных приемников)
             * если папка максимального уровня вложенности, то она уже не может быть приемником
             * */
            this.mayTake = ko.computed(function(){
                return !this.isSelected();
            }, this);

        },

        /** @lends FolderItemModel.prototype */
        {
            /**
             * По клику на пустую папку
             * */
            onClickAtEmptyFolder: function(model, event){
                event.stopPropagation();
            },
            /**
             * Gets the number of elements in the tree
             * */
            getTotalItemsCount: function(){
                return this.folders().length + this.files().length;
            },
            /**
             * Gets the number of the selected elements in the tree
             * */
            getSelectedItemsCount: function(){
                var count = 0;
                ko.utils.arrayForEach(this.folders(), function(children){
                    children.isSelected() && count++;
                }, this);

                ko.utils.arrayForEach(this.files(), function(file){
                    file.isSelected() && count++;
                }, this);
                return count;
            },
            /**
             * Include all elements of the state as the selected
             * @public
             * */
            selectAll: function(){
                this._setSelectedState(true);
            },
            /**
             * Disable all selected elements
             * @public
             * */
            unselectAll: function(){
                this._setSelectedState(false);
            },
            /**
             * Sets the state selected
             * @param {boolean} boolean - is selected or no
             * @private
             * */
            _setSelectedState: function(boolean){
                ko.utils.arrayForEach(this.folders(), function(children){
                    children.isSelected(boolean);
                    children._setSelectedState(boolean); // рекурсивно
                }, this);

                ko.utils.arrayForEach(this.files(), function(file){
                    file.isSelected(boolean);
                }, this);
            },
            /**
             * Loads the data and opens the folder
             * @public
             * */
            open : function(){
                this.isOpened(true);
            },
            /**
             * Close the folder
             * @public
             * */
            close : function(){
                this.isOpened(false);
            },
            /**
             * Opens or closes the folder
             * @param {object} model
             * @param {event} event
             * */
            toggleIsOpenedState : function(model, event){
                var switched = !this.isOpened();
                switched ? this.open() : this.close();
                event.stopPropagation();
            },
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

            createRequest : function () {
                var xhr = new XMLHttpRequest();

                setTimeout(function(){
                    // xhr.done(); todo
                }, 200);
                return xhr;
            }
        }

    ), template: template }
});