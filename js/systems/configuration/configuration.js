/**
 * @module configuration
 * */
define([], function() {

    require([

        /** if not support ES5 */
        './js/systems/configuration/javascript/ES5.js',

        /** if not support ES6 */
        './js/systems/configuration/javascript/ES6.js',

        /** common */
        './js/systems/configuration/software/jqueryConfiguration.js',
        './js/systems/configuration/software/knockoutConfiguration.js'
    ], function(){

    })

});