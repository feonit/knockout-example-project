/**
 * Created by Feonit on 23.07.15.
 */
define(['_', 'knockout', 'FileModel', 'ItemCatalogViewModel'], function(_, ko, FileModel, ItemCatalogViewModel){


    var FileViewModel = _.defineSubclass(FileModel,

        /**
         * @constructor FileViewModel
         * @extends FileModel
         * @mixes ItemCatalogViewModel
         * */
        function FileViewModel(){

            FileModel.apply(this, arguments);
            ItemCatalogViewModel.apply(this, arguments);

            this.errorMsg = ko.observable("Произошла ошибка при загрузке файла, возможно, файл уже был загружен");
            this.isCanceled = ko.observable(false);
            this.process = ko.observable(false);
            this.search_type = ko.observable(); // 'user' or 'global'

        },
        /** @lends FileViewModel.prototype */
        {

            getDocTypeClass : function () {

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

    _.mix(FileViewModel.prototype, ItemCatalogViewModel.prototype);

    return FileViewModel;
});