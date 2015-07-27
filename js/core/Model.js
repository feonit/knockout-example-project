/**
 * Created by Feonit on 23.07.15.
 */
define(['knockout', 'knockout.mapping'], function(ko){

    function Model(attributes, options){

        this.setAttributes(attributes);

    }

    Model.prototype = {

        constructor: Model,

        setAttributes: function(attributes){
            ko.mapping.fromJS(attributes, {}, this);
        }

    };

    return Model;

});