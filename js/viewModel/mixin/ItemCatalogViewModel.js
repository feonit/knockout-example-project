/**
 * Created by Feonit on 24.07.15.
 */
define(['knockout'], function(ko){

    /**
     * This provides methods used for event handling.
     *
     * @mixin
     * */
    function ItemCatalogViewModel(){
        this.renamed = ko.observable(false);

        /** validation */
        this.newTitle = ko.observable("").extend({
            validate: {
                rules: [
                    {
                        type: "required",
                        message: "Поле не заполнено"
                    }
                ]
            }
        });
    }

    ItemCatalogViewModel.prototype = {

        constructor: ItemCatalogViewModel,

        /**
         * @public method
         * */
        getAccessClass : function () {
            switch (this.secureLevel()) {
                case "PUBLIC":
                    return 'public_access';
                    break;
                case "SUBSCRIBERS":
                    return 'colleagues_access';
                    break;
                case "OWNER":
                    return 'owner_access';
                    break;
            }
        }

    };

    return ItemCatalogViewModel;
});