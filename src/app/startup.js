define(['knockout', 'Application'], function(ko, Application){
    // Components can be packaged as AMD modules, such as the following:
    ko.components.register('catalog-tree', { require: 'components/catalog-tree/catalog-tree' });
    ko.components.register('fileload-zone', { require: 'components/fileload-zone/fileload-zone' });
    ko.components.register('media-player', { require: 'components/media-player/media-player' });

    /**
     * Start the application
     * @global
     */
    var app = window.app = new Application();

    app.start();
});