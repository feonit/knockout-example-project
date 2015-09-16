define(['knockout'], function(ko){

    var PlayerViewModel = function(){

        this.curSrcUrl = ko.observable();
        this.curSrcTypeName = ko.observable();

        this.isOpened = ko.observable();
    };

    PlayerViewModel.prototype = {

        constructor: PlayerViewModel,

        openLayer: function(){
            this.isOpened(true);
        },

        closeLayer: function(){
            this.isOpened(false);
        }

    };

    return PlayerViewModel;

});