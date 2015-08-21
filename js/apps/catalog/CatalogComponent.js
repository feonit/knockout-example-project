define(['knockout', 'CatalogViewModel', '_'], function(ko, CatalogViewModel, _){


    var CatalogComponent = _.defineSubclass(CatalogViewModel, function CatalogComponent(params){

        var owner_id = 1;

        CatalogViewModel.call(this, { owner_id: owner_id} );

        this.prototype = {}; // ko build instance of component with undefined proto?

        _.mix(this.prototype, CatalogViewModel.prototype);

        window.ROOT.catalogViewModel(this);

        this.readRequest();
        this.rootFolder().open();

    } , {

        dispose: function(){
            window.ROOT().catalogViewModel('');
        }

    });


    ko.components.register('catalog-component', (function(){
        return {
            viewModel: CatalogComponent,
            template: { require: 'text!apps/catalog/templates/catalog-component.html' }
        }
    }()));
});