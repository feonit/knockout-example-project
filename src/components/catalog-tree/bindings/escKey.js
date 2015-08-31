define(['knockout'], function(ko){

    ko.bindingHandlers.escKey = {
        init: function(element, valueAccessor, allBindings, vm) {
            ko.utils.registerEventHandler(element, "keyup", function(event) {
                if (event.keyCode === 27) {
                    valueAccessor().call(vm, vm, event); //set "this" to the data and also pass it as first arg, in case function has "this" bound
                }
                return true;
            });
        }
    };

});