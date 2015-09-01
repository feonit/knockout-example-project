/**
 * Created by Feonit on 13.07.15.
 */

define(['knockout'], function(ko){

    /**
     * This provides methods used for event handling. It's not meant to
     * be used directly.
     * @class DragAndDropModel
     * @constructs DragAndDropModel
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

    DragAndDropModel.prototype =
    /** @lends DragAndDropModel.prototype */
    {
        constructor: DragAndDropModel,

        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragstart : function(model, event){
            event.dataTransfer.effectAllowed = "move";
            /**
             * Fired on an element when a drag is started.
             * */
            if (ROOT.catalogViewModel().getSelectedTotalItemsLength() === 0){
                return false;
            }
            event.dataTransfer.setData(DragAndDropModel._MIME_TYPE, "fake data");
            ROOT.catalogViewModel().setIsMovingAllSelectedItemsState(true);
            this._createDragabbleElemView(event);
            DragAndDropModel._effectOnBodyScroll.start();
            return true;
        },
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragend : function(model, event){
            event.stopImmediatePropagation();
            ROOT.catalogViewModel().setIsMovingAllSelectedItemsState(false); //1
            event.dataTransfer.clearData(DragAndDropModel._MIME_TYPE);
            DragAndDropModel._effectOnBodyScroll.stop();
        },
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragover : function(model, event){
            //event.stopPropagation();
            this.isTaking(true);
        },
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragleave : function(model, event){
            event.stopImmediatePropagation();
            this.isTaking(false);
        },
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragenter : function(model, event){
            event.dataTransfer.dropEffect  = 'copy';
            this.isTaken(false); // для рестарта эффекта
            if (this.mayTake()){
                this.isTaking(true);
            }
        },
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
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
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        onToggleSelectStateClick : function(model, event){
            this.isSelected(!this.isSelected());
            event.stopImmediatePropagation();
        },
        /**
         * Handler
         * @private
         * */
        _createDragabbleElemView : function (event){
            var count = ROOT.catalogViewModel().getSelectedTotalItemsLength();

            var imageNode = document.getElementById('js_drag_item');
            var bodyNode = document.body;

            imageNode = imageNode.cloneNode(true);

            imageNode.innerHTML = '<span>' + count + '</span>';

            imageNode.classList.remove('none');

            // Добавляем imageNode на страницу
            bodyNode.appendChild(imageNode);

            // Устанавливаем imageNode в качестве картинки для перетаскивания
            event.dataTransfer.setDragImage(imageNode, imageNode.offsetWidth, imageNode.offsetHeight);

            // Удаляем imageNode через 1 милисекунду. Если удалить срзау,
            // то вызов setDragImage произойдет до того как отрендерится imageNode
            window.setTimeout(function() {
                imageNode.parentNode.removeChild(imageNode);
            }, 1);

            return imageNode;
        },
        /**
         * Handler
         * @private
         * */
        _dropData : function (){
            var that = this;

            function endProcessHandler(){
                ROOT.catalogViewModel().moveSelectedToFolder(that);               // 1
                ROOT.catalogViewModel().setIsMovedAllSelectedItemsState(true);    // 2
                ROOT.catalogViewModel().unselectAll();                            // 3
            }

            var data = ROOT.catalogViewModel().getDataOfMovingItems();


            var formatRequestData = {
                move: {
                    files_id: data.files,
                    folders_id: data.folders
                },
                to: this.id()
            };

            this._sendData(formatRequestData, endProcessHandler);
        },

        /**
         * @param {object} data — Format of request
         * @param {function} callback — Handler of success response
         * */
        _sendData : function(data, callback){

            fetch('some_url_for_save_change', {
                method: 'post',
                body: data
            }).then( function(){ console.log('Request succeeded with JSON response', data);
                callback();
            }).catch( function(error) { console.log('Request failed', error);
                callback();
            });
        }
    };

    /**
     * @memberof DragAndDropModel
     * @param {String} string
     */
    DragAndDropModel._serializationData = function(numbers){
        return JSON.stringify(numbers);
    };
    /**
     * @memberof DragAndDropModel
     * @param {String} string
     */
    DragAndDropModel._deserializationData = function(string){
        return JSON.parse(string);
    };

    DragAndDropModel._effectOnBodyScroll = (function(){

        /**
         * @param {Boolean} value top or bottom
         * */
        function _scroll(value){
            if (_scroll.timer) return;

            var a = document.querySelector('.middle_main_content');
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
                document.body.removeEventListener('dragover');
            }
        }

        function bindEventHandler(){
            document.body.draggable = true;

            var CONST_OFFSET = 5;

            document.body.addEventListener('dragover', function(event){
                var height = window.innerHeight;

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
