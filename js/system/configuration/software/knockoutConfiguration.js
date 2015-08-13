/**
 * @requires knockout @see
 * */
define(['knockout'], function( ko) {

    ko.observableArray.fn.pushAll = function(valuesToPush) {
        var underlyingArray = this();
        this.valueWillMutate();
        ko.utils.arrayPushAll(underlyingArray, valuesToPush);
        this.valueHasMutated();
        return this;  //optional
    };
    ko.observableArray.fn.unshiftAll = function(valuesToPush) {
        var underlyingArray = this();
        this.valueWillMutate();

        while (valuesToPush.length){
            underlyingArray.unshift(valuesToPush.splice(valuesToPush.length - 1, 1)[0])
        }

        this.valueHasMutated();
        return this;  //optional
    };

});