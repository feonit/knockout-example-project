define([
    '_',
    'knockout',
    'ItemModel',
    'text!components/catalog-tree/file-item/file-item.html'
], function(
    _,
    ko,
    ItemModel,
    template
){

    "use strict";

    return { viewModel: _.defineSubclass(ItemModel,

        /**
         * A constructor for file view
         * @class FileItemModel
         * @constructs FileItemModel
         * @extends ItemModel
         * */
        function FileItemModel(attributes){

            ItemModel.apply(this, arguments);

            this.id = ko.observable();
            this.ownerName = ko.observable();
            this.title = ko.observable();
            this.type = ko.observable();
            this.src = ko.observable();

            /**
             * The parent for that folder
             * @param {Function}
             * @return {FileItemModel}
             * */
            this.parent = ko.observable();

            ko.mapping.fromJS(attributes, {}, this);
        } ,

        /** @lends FileItemModel.prototype */
        {
            onClickOpenPreview: function(){
                var src = this.src();
                var type = this.type();
                API_MediaPlayer.open({
                    src: src,
                    type: type
                })
            }
        }

    ), template: template }
});