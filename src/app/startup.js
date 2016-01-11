define(['knockout', 'Application'], function(ko, Application){
    // Components can be packaged as AMD modules, such as the following:
    ko.components.register('catalog-tree', { require: 'components/catalog-tree/catalog-tree' });

    ko.components.register('file-item', { require: 'components/catalog-tree/file-item/file-item' });
    ko.components.register('folder-item', { require: 'components/catalog-tree/folder-item/folder-item' });

    ko.components.register('fileload-zone', { require: 'components/fileload-zone/fileload-zone' });
    ko.components.register('media-player', { require: 'components/media-player/media-player' });

    /**
     * Start the application
     * @global
     */
    var app = window.app = new Application();

    app.start();
});