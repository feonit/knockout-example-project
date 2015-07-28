define(['infrastructure'], function(){

    return new function ApplicationSingleton(window, document, $, ko){

        var instanse = this;

        this.version = '1.0.0';

        this.constructor.prototype.start = function(){

            require(['VirtualFileSystemModel'], function(VirtualFileSystemModel){

                $(document).ready(function(){

                    window.ROOT = ko.observable({
                        virtualFileSystemModel : ko.observable(new VirtualFileSystemModel())
                    });

                    window.ROOT().virtualFileSystemModel().directoryTreeModel().fetch();
                    window.ROOT().virtualFileSystemModel().directoryTreeModel().rootFolder().open();

                    ko.applyBindings(window.ROOT);

                });

            });
        };

        this.constructor.prototype.stop = function(){

        };

        return function Application(){ return instanse }

    }(window, document, $, ko);
});