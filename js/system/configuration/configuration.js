/**
 * @module configuration
 * */
define([], function() {

    require([

        /** if not support ES5 */
        './js/system/configuration/javascript/ES5.js',

        /** if not support ES6 */
        './js/system/configuration/javascript/ES6.js',

        /** common */
        './js/system/configuration/software/jqueryConfiguration.js',
        './js/system/configuration/software/knockoutConfiguration.js'
    ], function(){

    })

});