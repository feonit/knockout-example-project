define(['knockout', 'FileUploadZoneViewModel', '_', 'text!fileload-zone.html'], function(ko, FileUploadZoneViewModel, _, template){

    var FileZoneComponent = _.defineSubclass(FileUploadZoneViewModel, function FileZoneComponent(){

        FileUploadZoneViewModel.call(this);
        this.prototype = {};
        _.mix(this.prototype, FileUploadZoneViewModel.prototype);
        window.ROOT.fileZoneViewModel(this);

    } , {
        dispose: function(){
            window.ROOT().fileZoneViewModel('');
        }
    });

    return { viewModel: FileZoneComponent, template: template }
});