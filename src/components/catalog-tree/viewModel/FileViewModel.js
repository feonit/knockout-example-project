/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FileModel', 'ItemCatalogViewModel'], function(
    _, ko, DragAndDropModel, FileModel, ItemCatalogViewModel){

    var FileViewModel = _.defineSubclass(FileModel,

        /**
         * A constructor for file view
         * @class FileViewModel
         * @constructs FileViewModel
         * @param {Object} options — Optional Object with extra parameters (see below)
         * @param {Object} options.data — This component's attributes for extend of FileModel
         * @param {Object} options.parent — This link to parent of current folder instance
         * @extends FileModel
         * @extends DragAndDropModel
         * @extends ItemCatalogViewModel
         * */
        function FileViewModel(options){
            options = options || {};
            options.data = options.data || {};
            options.parent = options.parent || {};

            FileModel.call(this, options.data);
            DragAndDropModel.apply(this);

            this.errorMsg = ko.observable("Произошла ошибка при загрузке файла, возможно, файл уже был загружен");
            this.isCanceled = ko.observable(false);
            this.process = ko.observable(false);
            this.search_type = ko.observable(); // 'user' or 'global'

            ItemCatalogViewModel.apply(this, arguments);

            /**
             * The parent for that folder
             * @param {Function}
             * @return {FileViewModel}
             * */
            this.parent = ko.observable(options.parent);

            // from DragAndDropModel (set state)
            this.isSelected(this.parent().isSelected());
        } ,

        /** @lends FileViewModel.prototype */
        {
            getDocTypeClass : function () {
                return 'glyphicon-camera'
            },

            addError : function (msg) {

            },

            cancel : function () {

            },

            onClickCopyToMyLibrary: function(model, event){

            },

            onClickDownload :  function () {
            },

            onClickOpenPreview : function (model, event) {

            },

            _removeFile : function() {

            }
        }
    );

    _.mix(FileViewModel.prototype, DragAndDropModel.prototype);
    _.mix(FileViewModel.prototype, ItemCatalogViewModel.prototype);

    return FileViewModel;
});