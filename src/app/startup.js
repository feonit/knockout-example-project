define(['knockout', 'Application'], function(ko, Application){
    // Components can be packaged as AMD modules, such as the following:
    ko.components.register('catalog-tree', { require: 'components/catalog-tree/catalog-tree' });

    /**
     * Start the application
     * @global
     */
    var app = window.app = new Application();

    app.start();
});