/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FileViewModel'], function(
    _, ko, DragAndDropModel, FileViewModel){

    var FileTreeViewModel = _.defineSubclass(FileViewModel,

        /**
         * A constructor for file view
         * @class FileTreeViewModel
         * @constructs FileTreeViewModel
         * @param {Object} options — Optional Object with extra parameters (see below)
         * @param {Object} options.data — This component's attributes for extend of FileModel
         * @param {Object} options.parent — This link to parent of current folder instance
         * @extends FileViewModel
         * @extends DragAndDropModel
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