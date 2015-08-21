/**
 * @module configuration
 * */
define([], function() {

    require([

        /** if not support ES5 */
        './src/systems/configuration/javascript/ES5.js',

        /** if not support ES6 */
        './src/systems/configuration/javascript/ES6.js',

        /** common */
        './src/systems/configuration/software/jqueryConfiguration.js',
        './src/systems/configuration/software/knockoutConfiguration.js'
    ], function(){

    })

});