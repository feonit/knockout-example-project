define(['knockout', 'CatalogViewModel', '_', 'text!catalog-tree.html', 'enterKey', 'escKey'], function(ko, CatalogViewModel, _, template){

    var CatalogComponent = _.defineSubclass(CatalogViewModel, function CatalogComponent(){

        var userID = 1;

        CatalogViewModel.call(this, { userID: userID} );

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

    return { viewModel: CatalogComponent, template: template }
});