/**
 * Created by Feonit on 24.07.15.
 */
define(['knockout'], function(ko){

    "use strict";

    /**
     * This provides methods used for event handling.
     * @class ItemCatalogViewModel
     * @constructor ItemCatalogViewModel
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
        /** @lends ItemCatalogViewModel.prototype */

        constructor: ItemCatalogViewModel,

        /**
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