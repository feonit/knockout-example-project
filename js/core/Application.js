/**
 * @module Application
 * @requires infrastructure
 * */
define(['infrastructure'], function(){

    var Application = (function(window, document, $, ko){

        /**
         * A constructor for Application
         * @class Application
         * @constructs Application
         * @param {Object} options - The options for an instance
         * @return {Application}
         * */
        function Application(options){
            options = options || {};

            /** @param */
            this.version = '1.0.0';
        }

        Application.prototype = {
            /** @lends Application.prototype */

            constructor: Application,

            /**
             * Method for start the application
             * @public
             * */
            start : function(){

                require(['VirtualFileSystemModel'], function(VirtualFileSystemModel){

                    $(document).ready(function(){

                        window.ROOT = ko.observable({
                            virtualFileSystemModel : ko.observable(new VirtualFileSystemModel())
                        });

                        window.ROOT().virtualFileSystemModel().directoryTreeModel().fetch();
                        window.ROOT().virtualFileSystemModel().directoryTreeModel().rootFolder().open();

                        ko.applyBindings(window.ROOT);

                    });

                });
            },

            /**
             * Method for stop the application
             * @public
             * */
            stop : function(){

            }
        };

        return Application;

    }(window, document, $, ko));

    return Application;
});