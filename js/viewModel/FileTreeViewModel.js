/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FileViewModel'], function(
    _, ko, DragAndDropModel, FileViewModel){

    var FileTreeViewModel = _.defineSubclass(FileViewModel,

        /**
         * A constructor for file view
         * @constructs FileTreeViewModel
         * @param {Object} options
         * @extends FileViewModel
         * @mixes DragAndDropModel
         * */
        function FileTreeViewModel(options){
            options = options || {};
            options.data = options.data || {};
            options.parent = options.parent || {};

            FileViewModel.call(this, options.data);
            DragAndDropModel.apply(this);

            /**
             * The parent for that folder
             * @param {Function}
             * @return {FileTreeViewModel}
             * */
            this.parent = ko.observable(options.parent);

            // from DragAndDropModel (set state)
            this.isSelected(this.parent().isSelected());
        }
    );

    _.mix(FileTreeViewModel.prototype, DragAndDropModel.prototype);

    return FileTreeViewModel;
});