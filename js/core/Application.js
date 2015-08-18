/**
 * @module Application
 * @requires infrastructure
 * */
define(['infrastructure', 'configurationSystem', 'templateSystem'], function(){

    var Application = (function(window, document, $, ko){

        /**
         * @class A class for instance of application
         * @constructs Application
         * @param {Object} options — Optional Object with extra parameters (see below)
         * @return {Application}
         * */
        function Application(options){
            options = options || {};

            /** @arg*/
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

                require(['FileSystem'], function(FileSystem){

                    $(document).ready(function(){

                        window.ROOT = ko.observable({
                            fileSystem : ko.observable(new FileSystem())
                        });

                        window.ROOT().fileSystem().directoryTreeModel().readRequest();
                        window.ROOT().fileSystem().directoryTreeModel().rootFolder().open();

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