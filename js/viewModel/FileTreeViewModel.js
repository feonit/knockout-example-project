/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout', 'DragAndDropModel', 'FileViewModel'], function(
    _, ko, DragAndDropModel, FileViewModel){

    /**
     * @constructor FileTreeViewModel
     * @extends FileViewModel
     * @mixes DragAndDropModel
     * */

    var FileTreeViewModel = _.defineSubclass(FileViewModel, function FileTreeViewModel(options){
        options = options || {};
        options.data = options.data || {};
        options.parent = options.parent || {};

        FileViewModel.call(this, options.data);
        DragAndDropModel.apply(this);

        /** @instance FileTreeViewModel */
        this.parent = ko.observable(options.parent);

        // from DragAndDropModel
        this.isSelected(this.parent().isSelected());
    });

    _.mix(FileTreeViewModel.prototype, DragAndDropModel.prototype);

    return FileTreeViewModel;
});