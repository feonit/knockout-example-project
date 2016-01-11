/**
 * @module Application
 * @requires infrastructure
 * */
define(['infrastructure', 'configurationSystem'], function(){

    var Application = (function(window, document, ko){

        /**
         * @class A class for instance of application
         * @constructs Application
         * @param {Object} options — Optional Object with extra parameters (see below)
         * @return {Application}
         * */
        function Application(options){
            options = options || {};

            /** @arg*/
            this.version = options.version || '1.0.0';
            this.started = false;
        }

        Application.prototype = {
            /** @lends Application.prototype */

            constructor: Application,

            /**
             * Method for start the application
             * @public
             * @return {Boolean}
             * */
            start : function(){
                if (this.started) return false;

                this._initialize();

                this.started = true;
                return true;
            },

            /**
             * Method for stop the application
             * @public
             * @return {Boolean}
             * */
            stop : function(){
                if (!this.started) return false;

                this._destroy();
                this.started = false;
                return true;
            },

            /**
             * Method for restart the application
             * @public
             * @return {Boolean}
             * */
            restart: function(){
                if (!this.started) return false;

                this.stop();
                return this.start();
            },

            /**
             * Init
             * @private
             * @return {Boolean}
             * */
            _initialize: function(){
                window.ROOT = {
                    catalogViewModel : ko.observable(''),
                    playerViewModel : ko.observable(''),
                    fileZoneViewModel : ko.observable('')
                };

                ko.applyBindings(window.ROOT);
            },
            /**
             * Destroy
             * @private
             * @return {Boolean}
             * */
            _destroy: function(){
                ko.cleanNode(document.body);
            }
        };

        return Application;

    }(window, document, ko));

    return Application;
});