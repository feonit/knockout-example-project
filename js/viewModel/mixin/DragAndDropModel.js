/**
 * Created by Feonit on 13.07.15.
 */

define(['knockout'], function(ko){

    /**
     * This provides methods used for event handling. It's not meant to
     * be used directly.
     * @constructor DragAndDropModel
     * @mixin
     * */
    function DragAndDropModel(){

        // only for folders
        this.isTaking = ko.observable(false);
        this.isTaken = ko.observable(false);
        this.isFailed = ko.observable();

        // folders and files
        this.isMoving = ko.observable(false);
        this.isMoved = ko.observable(false);
        this.isSelected = ko.observable(false);

        this.containsInSelectedFolder = ko.observable(false);

        // если папка выбрана, она не может уже быть приемником, это поведение постоянно (задача - исключить выбранные папки и все дочерние из возможных приемников)
        this.mayTake = ko.computed(function(){
            return !this.isSelected();
        }, this);
    }

    DragAndDropModel.prototype = {
        constructor: DragAndDropModel,

        ondragstart : function(model, event){
            event.dataTransfer.effectAllowed = "move";
            /**
             * Fired on an element when a drag is started.
             * */
            if (API_VirtualFileSystem.getSelectedTotalItemsLength() === 0){
                return false;
            }

            // todo вынести отсюда обработку ошибок
            //API_VirtualFileSystem.getSelectedFolders().forEach(function(item){
            //    item.isFailed(false); // для эффекта, если уже была зафейленна
            //});

            //var data = API_VirtualFileSystem.getDataOfMovingItems();
            //var JSON = DragAndDropModel._serializationData(data); //{ files: [1,2,3], folders: [1,2,3]}


            //event.dataTransfer.setData(DragAndDropModel._MIME_TYPE, JSON);

            event.dataTransfer.setData(DragAndDropModel._MIME_TYPE, "fake data");

            API_VirtualFileSystem.setIsMovingAllSelectedItemsState(true);

            this._createDragabbleElemView(event);

            DragAndDropModel._effectOnBodyScroll.start();

            return true;
        },

        ondragend : function(model, event){
            event.stopImmediatePropagation();

            API_VirtualFileSystem.setIsMovingAllSelectedItemsState(false); //1

            event.dataTransfer.clearData(DragAndDropModel._MIME_TYPE);

            DragAndDropModel._effectOnBodyScroll.stop();
        },

        ondragover : function(model, event){
            //event.stopPropagation();
            this.isTaking(true);
        },

        ondragleave : function(model, event){
            event.stopImmediatePropagation();

            this.isTaking(false);

        },

        ondragenter : function(model, event){
            event.dataTransfer.dropEffect  = 'copy';

            //event.stopImmediatePropagation();

            this.isTaken(false); // для рестарта эффекта

            if (this.mayTake()){
                this.isTaking(true);
            }
        },

        ondrop : function(model, event){
            event.stopImmediatePropagation();

            // reset state
            this.isTaking(false);

            // if available for taking
            if (this.mayTake()) {
                this.isTaken(true);

                var that = this;
                this.open({
                    callback: function(){
                        that._dropData(event);
                    }
                });

            } else {
                this.isFailed(true);
                return false
            }
        },

        onToggleSelectStateClick : function(model, event){
            this.isSelected(!this.isSelected());
            event.stopImmediatePropagation();
        },

        _createDragabbleElemView : function (event){
            var count = API_VirtualFileSystem.getSelectedTotalItemsLength();

            var $image = $('#js_drag_item');

            $image = $image.clone();

            $image.html('<span>' + count + '</span>');

            $image.removeClass('none');

            // Добавляем $image на страницу
            $('body').append($image);

            // Устанавливаем $image в качестве картинки для перетаскивания
            event.dataTransfer.setDragImage($image.get(0), $image.outerWidth(), $image.outerHeight());

            // Удаляем $image через 1 милисекунду. Если удалить срзау,
            // то вызов setDragImage произойдет до того как отрендерится $image
            window.setTimeout(function() {
                $image.remove();
            }, 1);

            return $image
        },

        _dropData : function (event){
            var that = this;

            function endProcessHandler(){
                API_VirtualFileSystem.moveSelectedToFolder(that);               // 1
                API_VirtualFileSystem.setIsMovedAllSelectedItemsState(true);    // 2
                API_VirtualFileSystem.unselectAll();                            // 3
            }

            var data = API_VirtualFileSystem.getDataOfMovingItems();

            var $xhr = $.ajax({
                url : 'some_url_for_save_change',
                type: 'POST',
                data: {
                    move: {
                        files_id: data.files,
                        folders_id: data.folders
                    },
                    to: this.id()
                }
            });

            // rename to done
            $xhr.always(endProcessHandler);
        }
    };

    DragAndDropModel._serializationData = function(numbers){
        /** from json to object */
        return JSON.stringify(numbers);
    };

    DragAndDropModel._deserializationData = function(string){
        /** from object to json */
        return JSON.parse(string);
    };

    DragAndDropModel._effectOnBodyScroll = (function(){

        /**
         * @param {Boolean} value top or bottom
         * */
        function _scroll(value){
            if (_scroll.timer) return;

            var a = $('.middle_main_content');
            _scroll.timer = setInterval(function(){
                a.scrollTop( a.scrollTop() + (value ? 2 : -2))
            }, 10);
        }

        _scroll.stop = function(){
            if (_scroll.timer){
                clearInterval(_scroll.timer);
                delete _scroll.timer;
            }
        };

        function destroy(){
            if (_scroll.timer){
                document.body.draggable = false;
                _scroll.stop();
                $(document.body).off('dragover');
            }
        }

        function bindEventHandler(){
            document.body.draggable = true;

            var CONST_OFFSET = 5;

            $(document.body).on('dragover', function(event){
                var height = $(window).height();

                var FrameTop = Math.round(height/CONST_OFFSET);

                if (event.pageY < FrameTop){
                    _scroll(false);
                }

                if (event.pageY > FrameTop && event.pageY < (CONST_OFFSET-1)*FrameTop){
                    _scroll.stop();
                }

                if (event.pageY > (CONST_OFFSET-1)*FrameTop){
                    _scroll(true);
                }
            });
        }

        return {
            start: bindEventHandler,
            stop: destroy
        }
    })();

    DragAndDropModel._MIME_TYPE = 'text/plain';//https://msdn.microsoft.com/en-us/library/ms536352(v=vs.85).aspx

    return DragAndDropModel;
});
