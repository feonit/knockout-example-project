/**
 * @author Feonit feonitu@yandex.ru
 */
define(['knockout', 'knockout.mapping'], function(ko){

    /**
     * @class Model
     * @constructs Model
     * @param {Object} attributes - The attributes for an instance
     * @return {Model}
     * */
    function Model(attributes){
        this.setAttributes(attributes);
    }

    Model.prototype = {
        constructor: Model,
        /**
         * Sets the attributes for an instance
         * @public
         * @param {Object} attributes - The attributes for an instance
         * */
        setAttributes: function(attributes){
            ko.mapping.fromJS(attributes, {}, this);
        },
        /**
         * Method for load data
         * @abstract
         * @return {boolean}
         * */
        fetch : function(){
            throw new Error('must be implemented by subclass!');
        },
        /**
         * Method for parse data and set attributes
         * @abstract
         * @return {boolean}
         * */
        parse : function(){
            throw new Error('must be implemented by subclass!');
        }
    };
    return Model;
});